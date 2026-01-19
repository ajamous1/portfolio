import { Ball } from './Ball'
import { Hoop } from './Hoop'
import { Input } from './Input'

export class Game {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  ball: Ball
  hoop: Hoop
  input: Input
  score: number
  gravity: number
  lastTime: number
  isRunning: boolean

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Could not get 2d context')
    }
    this.ctx = context

    // Set canvas size
    this.resize()

    // Initialize game objects
    const ballStartX = canvas.width / 2
    const ballStartY = canvas.height - 80
    this.ball = new Ball(ballStartX, ballStartY, 15)

    const hoopX = canvas.width / 2
    const hoopY = 120
    this.hoop = new Hoop(hoopX, hoopY)

    this.input = new Input()
    this.score = 0
    this.gravity = 800 // pixels per second squared
    this.lastTime = performance.now()
    this.isRunning = false

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
      // Update ball and hoop positions
      this.ball.startX = this.canvas.width / 2
      this.ball.startY = this.canvas.height - 80
      this.hoop.x = this.canvas.width / 2
      this.hoop.y = 120
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

        // Calculate velocity (opposite of drag direction)
        const maxVelocity = 600
        const velocityScale = Math.min(power * 3, maxVelocity) / power
        const velocityX = deltaX * velocityScale
        const velocityY = deltaY * velocityScale

        this.ball.shoot(velocityX, velocityY)
      }
    }

    this.canvas.addEventListener('pointerdown', handleStart)
    this.canvas.addEventListener('pointermove', handleMove)
    this.canvas.addEventListener('pointerup', handleEnd)
    this.canvas.addEventListener('pointercancel', handleEnd)
  }

  update(deltaTime: number) {
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

      // Check score
      if (this.hoop.checkScore(this.ball.x, this.ball.y, this.ball.radius, this.ball.vy)) {
        this.score++
        setTimeout(() => {
          this.ball.reset()
        }, 500)
      }

      // Reset if ball goes off screen
      if (
        this.ball.y > this.canvas.height + 100 ||
        this.ball.x < -100 ||
        this.ball.x > this.canvas.width + 100
      ) {
        setTimeout(() => {
          this.ball.reset()
        }, 500)
      }
    }
  }

  render() {
    // Clear canvas
    this.ctx.fillStyle = '#1a5f1a'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Draw court lines
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    this.ctx.lineWidth = 2
    this.ctx.setLineDash([10, 10])
    this.ctx.beginPath()
    this.ctx.moveTo(0, this.canvas.height - 60)
    this.ctx.lineTo(this.canvas.width, this.canvas.height - 60)
    this.ctx.stroke()
    this.ctx.setLineDash([])

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
      const offset = this.input.getDragOffset()
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      this.ctx.lineWidth = 2
      this.ctx.setLineDash([5, 5])
      this.ctx.beginPath()
      this.ctx.moveTo(this.ball.startX, this.ball.startY)
      this.ctx.lineTo(this.ball.x, this.ball.y)
      this.ctx.stroke()
      this.ctx.setLineDash([])
    }

    // Draw score
    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = 'bold 24px sans-serif'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, 40)
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
    this.score = 0
    this.ball.reset()
    this.input.reset()
  }
}
