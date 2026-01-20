export class Input {
  isDragging: boolean
  startX: number
  startY: number
  currentX: number
  currentY: number
  ballStartX: number
  ballStartY: number

  constructor() {
    this.isDragging = false
    this.startX = 0
    this.startY = 0
    this.currentX = 0
    this.currentY = 0
    this.ballStartX = 0
    this.ballStartY = 0
  }

  handleStart(x: number, y: number, ballX: number, ballY: number) {
    this.isDragging = true
    this.startX = x
    this.startY = y
    this.currentX = x
    this.currentY = y
    this.ballStartX = ballX
    this.ballStartY = ballY
  }

  handleMove(x: number, y: number) {
    if (!this.isDragging) return
    this.currentX = x
    this.currentY = y
  }

  handleEnd(): { power: number; angle: number; deltaX: number; deltaY: number } | null {
    if (!this.isDragging) return null

    const deltaX = this.startX - this.currentX
    const deltaY = this.startY - this.currentY
    const power = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const angle = Math.atan2(deltaY, deltaX)

    this.isDragging = false

    return { power, angle, deltaX, deltaY }
  }

  getDragOffset(): { x: number; y: number } {
    if (!this.isDragging) return { x: 0, y: 0 }

    const deltaX = this.startX - this.currentX
    const deltaY = this.startY - this.currentY
    const maxPull = 120 // Increased max pull distance
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const clampedDistance = Math.min(distance, maxPull)

    if (clampedDistance === 0) return { x: 0, y: 0 }

    const ratio = clampedDistance / distance
    return {
      x: -deltaX * ratio,
      y: -deltaY * ratio,
    }
  }

  reset() {
    this.isDragging = false
    this.startX = 0
    this.startY = 0
    this.currentX = 0
    this.currentY = 0
  }
}
