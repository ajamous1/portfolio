import { Ball } from './Ball'
import { Hoop } from './Hoop'
import { Input } from './Input'

interface Feedback {
  type: 'make' | 'miss'
  x: number
  y: number
  time: number
}

export class Game {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  ball: Ball
  hoop: Hoop
  input: Input
  gravity: number
  lastTime: number
  isRunning: boolean
  feedbacks: Feedback[]

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Could not get 2d context')
    }
    this.ctx = context

    // Set canvas size
    this.resize()

    // Initialize game objects - horizontal layout
    const ballStartX = 80
    const ballStartY = canvas.height / 2
    this.ball = new Ball(ballStartX, ballStartY, 18)

    const hoopX = canvas.width - 100
    const hoopY = canvas.height / 2
    this.hoop = new Hoop(hoopX, hoopY)

    this.input = new Input()
    this.gravity = 900 // pixels per second squared
    this.lastTime = performance.now()
    this.isRunning = false
    this.feedbacks = []

    // Setup input handlers
    this.setupInput()
    this.setupResize()
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect()
    this.canvas.width = rect.width
    this.canvas.height = rect.height
  }

  setupResize() {
    window.addEventListener('resize', () => {
      this.resize()
      // Update ball and hoop positions - horizontal layout
      this.ball.startX = 80
      this.ball.startY = this.canvas.height / 2
      this.hoop.x = this.canvas.width - 100
      this.hoop.y = this.canvas.height / 2
      if (!this.ball.isShooting) {
        this.ball.reset()
      }
    })
  }

  setupInput() {
    const handleStart = (e: PointerEvent) => {
      if (this.ball.isShooting) return
      const rect = this.canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Check if click is near ball
      const dist = Math.sqrt(
        Math.pow(x - this.ball.x, 2) + Math.pow(y - this.ball.y, 2)
      )

      if (dist < this.ball.radius * 3) {
        this.input.handleStart(x, y, this.ball.x, this.ball.y)
        this.canvas.setPointerCapture(e.pointerId)
      }
    }

    const handleMove = (e: PointerEvent) => {
      if (!this.input.isDragging) return
      const rect = this.canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      this.input.handleMove(x, y)
    }

    const handleEnd = (e: PointerEvent) => {
      if (!this.input.isDragging) return
      const result = this.input.handleEnd()
      this.canvas.releasePointerCapture(e.pointerId)

      if (result) {
        const { power, deltaX, deltaY } = result
        const minPower = 20

        if (power < minPower) {
          this.ball.reset()
          return
        }

        // Calculate velocity (opposite of drag direction) - horizontal shooting
        const maxVelocity = 1200
        const velocityScale = Math.min(power * 6, maxVelocity) / power
        const velocityX = deltaX * velocityScale // Shoot horizontally
        const velocityY = deltaY * velocityScale * 1.2 // Increased vertical movement for arc

        this.ball.shoot(velocityX, velocityY)
      }
    }

    this.canvas.addEventListener('pointerdown', handleStart)
    this.canvas.addEventListener('pointermove', handleMove)
    this.canvas.addEventListener('pointerup', handleEnd)
    this.canvas.addEventListener('pointercancel', handleEnd)
  }

  update(deltaTime: number) {
    // Update feedback animations
    this.feedbacks = this.feedbacks.filter(feedback => {
      feedback.time -= deltaTime
      return feedback.time > 0
    })

    // Update ball physics
    this.ball.update(this.gravity, deltaTime)

    // Check collisions
    if (this.ball.isShooting) {
      const collision = this.hoop.checkCollision(
        this.ball.x,
        this.ball.y,
        this.ball.radius
      )

      if (collision.hit) {
        this.hoop.bounceBall(this.ball, collision)
      }

      // Check if ball goes through hoop
      if (this.hoop.checkScore(this.ball.x, this.ball.y, this.ball.radius, this.ball.vy)) {
        // Ball went through - show success feedback
        this.feedbacks.push({
          type: 'make',
          x: this.hoop.x,
          y: this.hoop.y,
          time: 1.5 // Show for 1.5 seconds
        })
        
        setTimeout(() => {
          this.ball.reset()
        }, 500)
      }

      // Reset if ball goes off screen (horizontal layout)
      if (
        this.ball.x > this.canvas.width + 100 ||
        this.ball.x < -100 ||
        this.ball.y > this.canvas.height + 100 ||
        this.ball.y < -100
      ) {
        // Ball missed - show miss feedback
        this.feedbacks.push({
          type: 'miss',
          x: this.canvas.width / 2,
          y: this.canvas.height / 2,
          time: 1.5
        })
        
        setTimeout(() => {
          this.ball.reset()
        }, 500)
      }
    }
  }

  render() {
    // Simple background
    this.ctx.fillStyle = '#f0f0f0'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Draw hoop
    this.hoop.draw(this.ctx)

    // Draw ball (with drag offset if dragging)
    if (this.input.isDragging && !this.ball.isShooting) {
      const offset = this.input.getDragOffset()
      this.ball.x = this.ball.startX + offset.x
      this.ball.y = this.ball.startY + offset.y
    }

    this.ball.draw(this.ctx)

    // Draw drag line
    if (this.input.isDragging && !this.ball.isShooting) {
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'
      this.ctx.lineWidth = 2
      this.ctx.setLineDash([5, 5])
      this.ctx.beginPath()
      this.ctx.moveTo(this.ball.startX, this.ball.startY)
      this.ctx.lineTo(this.ball.x, this.ball.y)
      this.ctx.stroke()
      this.ctx.setLineDash([])
    }

    // Draw feedback messages
    this.feedbacks.forEach(feedback => {
      const alpha = Math.min(feedback.time / 0.5, 1) // Fade out in last 0.5 seconds
      const scale = 1 + (1 - feedback.time / 1.5) * 0.3 // Scale up slightly
      
      this.ctx.save()
      this.ctx.globalAlpha = alpha
      this.ctx.translate(feedback.x, feedback.y)
      this.ctx.scale(scale, scale)
      
      if (feedback.type === 'make') {
        // Success feedback
        this.ctx.fillStyle = '#22c55e'
        this.ctx.font = 'bold 32px sans-serif'
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'middle'
        this.ctx.fillText('✓', 0, 0)
        
        // Draw circle around it
        this.ctx.strokeStyle = '#22c55e'
        this.ctx.lineWidth = 3
        this.ctx.beginPath()
        this.ctx.arc(0, 0, 25, 0, Math.PI * 2)
        this.ctx.stroke()
      } else {
        // Miss feedback
        this.ctx.fillStyle = '#ef4444'
        this.ctx.font = 'bold 28px sans-serif'
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'middle'
        this.ctx.fillText('Miss', 0, 0)
      }
      
      this.ctx.restore()
    })
  }

  gameLoop(currentTime: number) {
    if (!this.isRunning) return

    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1) // Cap at 100ms
    this.lastTime = currentTime

    this.update(deltaTime)
    this.render()

    requestAnimationFrame((time) => this.gameLoop(time))
  }

  start() {
    this.isRunning = true
    this.lastTime = performance.now()
    this.gameLoop(this.lastTime)
  }

  stop() {
    this.isRunning = false
  }

  reset() {
    this.ball.reset()
    this.input.reset()
  }
}
