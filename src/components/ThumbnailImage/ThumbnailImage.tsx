import { useState, useEffect } from 'react'
import './ThumbnailImage.css'

interface ThumbnailImageProps {
  basePath: string // Path without extension, e.g., '/images/graphics-thumbnail'
  alt: string
  className?: string
}

function ThumbnailImage({ basePath, alt, className = '' }: ThumbnailImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(`${basePath}.png`)
  const [hasError, setHasError] = useState(false)

  // Reset state when basePath changes
  useEffect(() => {
    setImageSrc(`${basePath}.png`)
    setHasError(false)
  }, [basePath])

  const handleError = () => {
    // If PNG fails, try JPG
    if (imageSrc.endsWith('.png')) {
      setImageSrc(`${basePath}.jpg`)
    } else {
      // Both formats failed
      setHasError(true)
    }
  }

  if (hasError) {
    return null
  }

  return (
    <div className={`project-thumbnail ${className}`}>
      <img src={imageSrc} alt={alt} onError={handleError} />
    </div>
  )
}

export default ThumbnailImage
