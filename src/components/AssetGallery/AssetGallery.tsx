import { useEffect, useState } from 'react'
import { getAssets, type PortfolioAsset } from '../../lib/supabase'
import { isOneDriveUrl, convertToOneDriveEmbed } from '../../utils/onedrive'
import './AssetGallery.css'

interface AssetGalleryProps {
  category: PortfolioAsset['category']
  preserveAspectRatio?: boolean
  fullWidth?: boolean
}

function AssetGallery({ category, preserveAspectRatio = false, fullWidth = false }: AssetGalleryProps) {
  const [assets, setAssets] = useState<PortfolioAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAsset, setSelectedAsset] = useState<PortfolioAsset | null>(null)

  useEffect(() => {
    async function loadAssets() {
      setLoading(true)
      const data = await getAssets(category)
      setAssets(data)
      setLoading(false)
    }
    loadAssets()
  }, [category])

  if (loading) {
    return (
      <div className="asset-gallery-loading">
        <p>Loading...</p>
      </div>
    )
  }

  if (assets.length === 0) {
    return (
      <div className="asset-gallery-empty">
        <p>No assets found. Upload files in Supabase to see them here.</p>
      </div>
    )
  }

  return (
    <>
      <div className={`asset-gallery ${preserveAspectRatio ? 'preserve-aspect' : ''} ${fullWidth ? 'full-width' : ''}`}>
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="asset-item"
            onClick={() => setSelectedAsset(asset)}
          >
            {asset.file_type === 'image' ? (
              <img 
                src={asset.url} 
                alt={asset.title || 'Portfolio asset'} 
                loading="lazy"
              />
            ) : isOneDriveUrl(asset.url) ? (
              <div className="asset-video-thumbnail asset-onedrive-thumbnail">
                <iframe
                  src={convertToOneDriveEmbed(asset.url)}
                  title={asset.title || 'Video'}
                  allow="autoplay"
                  frameBorder="0"
                  scrolling="no"
                />
                <div className="asset-play-icon">▶</div>
              </div>
            ) : (
              <div className="asset-video-thumbnail">
                <video src={asset.thumbnail_url || asset.url} muted />
                <div className="asset-play-icon">▶</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedAsset && (
        <div 
          className="asset-modal-overlay" 
          onClick={() => setSelectedAsset(null)}
        >
          <div 
            className={`asset-modal ${selectedAsset.file_type === 'video' ? 'asset-modal-video' : ''}`} 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="asset-modal-close" 
              onClick={() => setSelectedAsset(null)}
            >
              ×
            </button>
            {selectedAsset.file_type === 'image' ? (
              <img 
                src={selectedAsset.url} 
                alt={selectedAsset.title || 'Portfolio asset'} 
              />
            ) : isOneDriveUrl(selectedAsset.url) ? (
              <iframe
                src={convertToOneDriveEmbed(selectedAsset.url)}
                title={selectedAsset.title || 'Video'}
                allow="autoplay; fullscreen"
                frameBorder="0"
                scrolling="no"
                allowFullScreen
              />
            ) : (
              <video 
                src={selectedAsset.url} 
                controls 
                autoPlay
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default AssetGallery
