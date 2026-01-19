import { useState } from 'react'
import './FontCardBack.css'
import { FontMeta } from '../../data/fonts'

export interface FontCardBackProps {
  font: FontMeta
  showGrid?: boolean
  className?: string
}

function generateLettersAndNumbers(isUppercase: boolean): string {
  const letters = Array.from({ length: 26 }, (_, i) => 
    String.fromCharCode((isUppercase ? 65 : 97) + i)
  ).join('')
  const numbers = '0123456789'
  
  return `${letters}\n\n${numbers}`
}

export default function FontCardBack({ 
  font, 
  showGrid = true, 
  className = ''
}: FontCardBackProps) {
  const [previewMode, setPreviewMode] = useState<'description' | 'letters'>('description')
  const [isUppercase, setIsUppercase] = useState(false)

  const fontFamily = font.cssStack || 'inherit'

  const getDisplayText = () => {
    if (previewMode === 'description') {
      return isUppercase ? font.description.toUpperCase() : font.description
    } else {
      return generateLettersAndNumbers(isUppercase)
    }
  }

  const togglePreviewMode = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreviewMode(prev => prev === 'description' ? 'letters' : 'description')
  }
  
  const toggleCase = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsUppercase(prev => !prev)
  }

  return (
    <div 
      className={`font-card-back ${showGrid ? 'with-grid' : ''} ${className}`}
      data-mode="headline"
    >
      <div className="font-card-back-header">
        <h2 className="font-card-back-name" style={{ fontFamily }}>
          {font.name}
        </h2>
        <p className="font-card-back-tagline">
          {font.tagline}
        </p>
      </div>

      <div className="font-card-back-preview" style={{ fontFamily }}>
        <div 
          className="font-card-back-preview-text" 
          data-type={previewMode}
          style={{ fontFamily }}
        >
          {getDisplayText()}
        </div>
      </div>

      <div className="font-card-back-toggle-group" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={`font-card-back-control-button ${previewMode === 'description' ? 'active' : ''}`}
          onClick={togglePreviewMode}
          aria-pressed={previewMode === 'description'}
          aria-label="Toggle between description and letters"
        >
          {previewMode === 'description' ? 'Letters' : 'Description'}
        </button>
        
        <button
          type="button"
          className={`font-card-back-control-button font-card-back-case-button ${isUppercase ? 'active' : ''}`}
          onClick={toggleCase}
          aria-pressed={isUppercase}
          aria-label="Toggle between uppercase and lowercase"
        >
          {isUppercase ? 'Lowercase' : 'Uppercase'}
        </button>
      </div>
    </div>
  )
}
