import { useState, useEffect } from 'react'
import { getGalleryItems, getDaysUntilReset, GalleryItem } from '../../utils/galleryStorage'
import './Gallery.css'

function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGallery()
    
    // Refresh gallery every minute to check for new drawings
    const interval = setInterval(loadGallery, 60000)
    return () => clearInterval(interval)
  }, [])

  const loadGallery = async () => {
    setLoading(true)
    try {
      const galleryItems = await getGalleryItems()
      setItems(galleryItems)
    } catch (error) {
      console.error('Error loading gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  const daysUntilReset = getDaysUntilReset()

  if (loading) {
    return (
      <div className="gallery-container">
        <div className="gallery-header">
          <h3>Gallery</h3>
          <p className="gallery-reset-info">Resets in {daysUntilReset} day{daysUntilReset !== 1 ? 's' : ''}</p>
        </div>
        <div className="gallery-empty">
          <p>Loading gallery...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="gallery-container">
        <div className="gallery-header">
          <h3>Gallery</h3>
          <p className="gallery-reset-info">Resets in {daysUntilReset} day{daysUntilReset !== 1 ? 's' : ''}</p>
        </div>
        <div className="gallery-empty">
          <p>No drawings yet. Be the first to submit!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h3>Gallery ({items.length}/20)</h3>
        <p className="gallery-reset-info">Resets in {daysUntilReset} day{daysUntilReset !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="gallery-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className="gallery-item"
            onClick={() => setSelectedItem(item)}
          >
            <img src={item.imageData} alt={`Drawing by ${item.authorName}`} />
            <div className="gallery-item-info">
              <span className="gallery-author">{item.authorName}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="gallery-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
            <button className="gallery-modal-close" onClick={() => setSelectedItem(null)}>
              ×
            </button>
            <img src={selectedItem.imageData} alt={`Drawing by ${selectedItem.authorName}`} />
            <div className="gallery-modal-info">
              <p className="gallery-modal-author">By {selectedItem.authorName}</p>
              <p className="gallery-modal-date">
                {new Date(selectedItem.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery
