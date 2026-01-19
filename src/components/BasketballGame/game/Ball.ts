export class Ball {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  startX: number
  startY: number
  isShooting: boolean

  constructor(startX: number, startY: number, radius: number = 15) {
    this.startX = startX
    this.startY = startY
    this.x = startX
    this.y = startY
    this.radius = radius
    this.vx = 0
    this.vy = 0
    this.isShooting = false
  }

  reset() {
    this.x = this.startX
    this.y = this.startY
    this.vx = 0
    this.vy = 0
    this.isShooting = false
  }

  update(gravity: number, deltaTime: number) {
    if (!this.isShooting) return

    this.vy += gravity * deltaTime
    this.x += this.vx * deltaTime
    this.y += this.vy * deltaTime
  }

  shoot(velocityX: number, velocityY: number) {
    this.vx = velocityX
    this.vy = velocityY
    this.isShooting = true
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    
    // Ball shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.beginPath()
    ctx.ellipse(this.x, this.y + this.radius + 2, this.radius * 0.8, this.radius * 0.4, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Ball
    const gradient = ctx.createRadialGradient(
      this.x - this.radius * 0.3,
      this.y - this.radius * 0.3,
      0,
      this.x,
      this.y,
      this.radius
    )
    gradient.addColorStop(0, '#ff8c42')
    gradient.addColorStop(1, '#ff6b35')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
    
    // Ball lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.lineWidth = 1.5
    
    // Horizontal line
    ctx.beginPath()
    ctx.moveTo(this.x - this.radius * 0.7, this.y)
    ctx.lineTo(this.x + this.radius * 0.7, this.y)
    ctx.stroke()
    
    // Vertical line
    ctx.beginPath()
    ctx.moveTo(this.x, this.y - this.radius * 0.7)
    ctx.lineTo(this.x, this.y + this.radius * 0.7)
    ctx.stroke()
    
    ctx.restore()
  }
}
