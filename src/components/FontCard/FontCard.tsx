import { useState, useEffect, useRef } from 'react'
import './FontCard.css'
import FontCardBack from './FontCardBack'
import { FontMeta, getFontByName } from '../../data/fonts'

export interface FontCardProps {
  fontName: string
  index?: number
}

function FontCard({ fontName, index = 0 }: FontCardProps) {
  const [flipped, setFlipped] = useState(false)
  const [animated, setAnimated] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const delay = 120 + (index * 40)
    
    const timer = setTimeout(() => {
      setAnimated(true)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [index])

  const getFontMeta = (name: string): FontMeta => {
    return getFontByName(name)
  }

  const getSvgPath = (name: string): string => {
    const normalized = name.replace(/\s+/g, '').toLowerCase()
    const path = `/assets/cards/mytypecard${normalized}.svg`
    return path
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement
    target.style.display = 'none'
  }

  const handleCardClick = () => {
    setFlipped(prev => !prev)
  }

  return (
    <div 
      ref={cardRef}
      className={`font-card-wrapper ${animated ? 'animate' : ''}`} 
      onClick={handleCardClick}
    >
      <div className={`font-card-inner ${flipped ? 'flipped' : ''}`}>
        <div className="font-card-front">
          <img 
            src={getSvgPath(fontName)} 
            alt={fontName} 
            className="font-card-image"
            onError={handleImageError}
          />
        </div>
        <div className="font-card-back-wrapper">
          <FontCardBack 
            font={getFontMeta(fontName)}
            showGrid={false}
            className="font-card-back-content"
          />
        </div>
      </div>
    </div>
  )
}

export default FontCard
