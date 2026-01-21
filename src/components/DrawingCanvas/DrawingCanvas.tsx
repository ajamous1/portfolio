import { useState, useRef, useEffect } from 'react'
import './DrawingCanvas.css'

interface DrawingCanvasProps {
  onSave?: (imageData: string, authorName: string) => void
}

type Tool = 'brush' | 'eraser' | 'bucket'

function DrawingCanvas({ onSave }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(4)
  const [authorName, setAuthorName] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [tool, setTool] = useState<Tool>('brush')

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

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    return { x, y }
  }


  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getCanvasCoordinates(e)

    if (tool === 'bucket') {
      floodFill(ctx, x, y, color)
      return
    }

    setIsDrawing(true)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool === 'bucket') return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getCanvasCoordinates(e)

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = brushSize
      ctx.lineCap = 'round'
      ctx.strokeStyle = 'rgba(0,0,0,1)'
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.lineWidth = brushSize
      ctx.lineCap = 'round'
      ctx.strokeStyle = color
    }
    
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

      ctx.globalCompositeOperation = 'source-over'
      ctx.beginPath()
    }
  }

  const floodFill = (ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const width = canvas.width
    const height = canvas.height

    // Convert fill color to RGB
    const fillR = parseInt(fillColor.slice(1, 3), 16)
    const fillG = parseInt(fillColor.slice(3, 5), 16)
    const fillB = parseInt(fillColor.slice(5, 7), 16)

    // Get the color at the starting point
    const startIdx = (Math.floor(startY) * width + Math.floor(startX)) * 4
    const startR = data[startIdx]
    const startG = data[startIdx + 1]
    const startB = data[startIdx + 2]

    // If the fill color matches the start color, do nothing
    if (startR === fillR && startG === fillG && startB === fillB) {
      return
    }

    // Stack-based flood fill algorithm
    const stack: Array<[number, number]> = [[Math.floor(startX), Math.floor(startY)]]
    const visited = new Set<string>()

    while (stack.length > 0) {
      const [x, y] = stack.pop()!
      const key = `${x},${y}`

      if (visited.has(key) || x < 0 || x >= width || y < 0 || y >= height) {
        continue
      }

      const idx = (y * width + x) * 4
      const r = data[idx]
      const g = data[idx + 1]
      const b = data[idx + 2]

      // Check if pixel matches the start color
      if (r !== startR || g !== startG || b !== startB) {
        continue
      }

      visited.add(key)

      // Fill the pixel
      data[idx] = fillR
      data[idx + 1] = fillG
      data[idx + 2] = fillB
      data[idx + 3] = 255

      // Add neighbors to stack
      stack.push([x + 1, y])
      stack.push([x - 1, y])
      stack.push([x, y + 1])
      stack.push([x, y - 1])
    }

    ctx.putImageData(imageData, 0, 0)
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
        
        <div className="tool-selector-section">
          <label>Tool:</label>
          <div className="tool-selector">
            <button
              className={`tool-select-button ${tool === 'brush' ? 'active' : ''}`}
              onClick={() => setTool('brush')}
            >
              Brush
            </button>
            <button
              className={`tool-select-button ${tool === 'eraser' ? 'active' : ''}`}
              onClick={() => setTool('eraser')}
            >
              Eraser
            </button>
            <button
              className={`tool-select-button ${tool === 'bucket' ? 'active' : ''}`}
              onClick={() => setTool('bucket')}
            >
              Fill
            </button>
          </div>
        </div>

        <div className="brush-size-section">
          <label>{tool === 'bucket' ? 'Fill Tool' : `${tool === 'eraser' ? 'Eraser' : 'Brush'} Size: ${brushSize}px`}</label>
          {tool !== 'bucket' && (
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="brush-slider"
            />
          )}
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
