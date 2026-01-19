import { useState, useRef, useEffect } from 'react'
import './DrawingCanvas.css'

interface DrawingCanvasProps {
  onSave?: (imageData: string, authorName: string) => void
}

function DrawingCanvas({ onSave }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(4)
  const [authorName, setAuthorName] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 400
    canvas.height = 300

    // Set default background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.strokeStyle = color
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.beginPath()
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const handleSave = () => {
    if (!authorName.trim()) {
      alert('Please enter your name')
      return
    }

    const canvas = canvasRef.current
    if (!canvas || !onSave) return

    const imageData = canvas.toDataURL('image/png')
    onSave(imageData, authorName.trim())
    setShowSaveDialog(false)
    setAuthorName('')
    clearCanvas()
  }

  const colors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff'
  ]

  return (
    <div className="drawing-canvas-container">
      <div className="drawing-tools">
        <div className="color-picker-section">
          <label>Colors:</label>
          <div className="color-palette">
            {colors.map((c) => (
              <button
                key={c}
                className={`color-button ${color === c ? 'active' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>
        
        <div className="brush-size-section">
          <label>Brush Size: {brushSize}px</label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="brush-slider"
          />
        </div>

        <div className="tool-buttons">
          <button onClick={clearCanvas} className="tool-button">
            Clear
          </button>
          <button onClick={() => setShowSaveDialog(true)} className="tool-button tool-button-primary">
            Save Drawing
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="drawing-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      {showSaveDialog && (
        <div className="save-dialog-overlay" onClick={() => setShowSaveDialog(false)}>
          <div className="save-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Save Your Drawing</h3>
            <input
              type="text"
              placeholder="Your name (optional)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="name-input"
              maxLength={50}
            />
            <div className="save-dialog-buttons">
              <button onClick={() => setShowSaveDialog(false)} className="dialog-button dialog-button-secondary">
                Cancel
              </button>
              <button onClick={handleSave} className="dialog-button dialog-button-primary">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DrawingCanvas
