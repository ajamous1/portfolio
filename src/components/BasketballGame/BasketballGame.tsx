import { useEffect, useRef } from 'react'
import { Game } from './game/Game'
import './BasketballGame.css'

function BasketballGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<Game | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const game = new Game(canvasRef.current)
    gameRef.current = game
    game.start()

    return () => {
      game.stop()
    }
  }, [])

  const handleReset = () => {
    if (gameRef.current) {
      gameRef.current.reset()
    }
  }

  return (
    <div className="basketball-game">
      <canvas
        ref={canvasRef}
        className="basketball-canvas"
      />
      <div className="basketball-game-instructions">
        <p>Drag the ball back to aim, release to shoot</p>
      </div>
      <div className="basketball-game-controls">
        <button className="reset-button" onClick={handleReset}>
          Reset Ball
        </button>
      </div>
    </div>
  )
}

export default BasketballGame
