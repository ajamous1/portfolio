export class Hoop {
  x: number
  y: number
  rimRadius: number
  backboardWidth: number
  backboardHeight: number
  netHeight: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    this.rimRadius = 30
    this.backboardWidth = 100
    this.backboardHeight = 70
    this.netHeight = 40
  }

  checkCollision(ballX: number, ballY: number, ballRadius: number): { hit: boolean; type: 'rim' | 'backboard' | null } {
    // Backboard collision (left side of backboard)
    const backboardLeft = this.x - this.backboardWidth / 2
    const backboardRight = this.x + this.backboardWidth / 2
    const backboardTop = this.y - this.backboardHeight / 2
    const backboardBottom = this.y + this.backboardHeight / 2

    if (
      ballX - ballRadius < backboardRight &&
      ballX + ballRadius > backboardLeft &&
      ballY - ballRadius < backboardBottom &&
      ballY + ballRadius > backboardTop
    ) {
      return { hit: true, type: 'backboard' }
    }

    // Rim collision (circle)
    const distToRim = Math.sqrt(
      Math.pow(ballX - this.x, 2) + Math.pow(ballY - this.y, 2)
    )

    if (distToRim < this.rimRadius + ballRadius && distToRim > this.rimRadius - ballRadius) {
      return { hit: true, type: 'rim' }
    }

    return { hit: false, type: null }
  }

  checkScore(ballX: number, ballY: number, ballRadius: number, ballVy: number): boolean {
    // Ball must be moving downward and pass through hoop area
    if (ballVy <= 0) return false

    const distToCenter = Math.sqrt(
      Math.pow(ballX - this.x, 2) + Math.pow(ballY - this.y, 2)
    )

    // Ball passes through rim
    if (distToCenter < this.rimRadius - ballRadius && ballY > this.y) {
      return true
    }

    return false
  }

  bounceBall(ball: { vx: number; vy: number }, collision: { hit: boolean; type: 'rim' | 'backboard' | null }) {
    if (!collision.hit) return

    if (collision.type === 'backboard') {
      // Bounce off backboard (reverse x velocity, reduce slightly)
      ball.vx *= -0.7
      ball.vy *= 0.9
    } else if (collision.type === 'rim') {
      // Bounce off rim (reverse both velocities, reduce)
      ball.vx *= -0.6
      ball.vy *= -0.5
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()

    // Backboard
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#333333'
    ctx.lineWidth = 3
    ctx.fillRect(
      this.x - this.backboardWidth / 2,
      this.y - this.backboardHeight / 2,
      this.backboardWidth,
      this.backboardHeight
    )
    ctx.strokeRect(
      this.x - this.backboardWidth / 2,
      this.y - this.backboardHeight / 2,
      this.backboardWidth,
      this.backboardHeight
    )

    // Backboard center line
    ctx.strokeStyle = '#333333'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(this.x - 30, this.y)
    ctx.lineTo(this.x + 30, this.y)
    ctx.stroke()

    // Rim
    ctx.strokeStyle = '#ff6b35'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.rimRadius, 0, Math.PI * 2)
    ctx.stroke()

    // Net
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.lineWidth = 2
    const netSegments = 8
    for (let i = 0; i < netSegments; i++) {
      const angle = (i / netSegments) * Math.PI * 2
      const startX = this.x + Math.cos(angle) * this.rimRadius
      const startY = this.y + Math.sin(angle) * this.rimRadius
      const endX = this.x + Math.cos(angle) * (this.rimRadius * 0.7)
      const endY = this.y + this.netHeight + Math.sin(angle) * (this.rimRadius * 0.3)

      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.stroke()
    }

    ctx.restore()
  }
}
