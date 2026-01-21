import { useState, useCallback } from 'react'
import { uploadFile, createAsset, type PortfolioAsset } from '../../lib/supabase'
import './BulkUpload.css'

interface FileWithPreview {
  file: File
  preview: string
  id: string
  selected: boolean
  category: PortfolioAsset['category'] | null
}

function BulkUpload() {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [redditUrl, setRedditUrl] = useState('')
  const [loadingReddit, setLoadingReddit] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const addFiles = useCallback((newFiles: File[]) => {
    const filesWithPreview = newFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${Date.now()}-${Math.random()}`,
      selected: true,
      category: null as PortfolioAsset['category'] | null,
    }))

    setFiles(prev => [...prev, ...filesWithPreview])
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/') || file.type.startsWith('video/')
    )

    addFiles(droppedFiles)
  }, [addFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        file => file.type.startsWith('image/') || file.type.startsWith('video/')
      )
      addFiles(selectedFiles)
    }
  }, [addFiles])

  const fetchRedditImage = useCallback(async (url: string) => {
    setLoadingReddit(true)
    setError(null)

    try {
      // Convert Reddit URL to JSON API endpoint
      const jsonUrl = url.replace(/\/$/, '') + '.json'
      
      // Try fetching via CORS proxy
      let data: any = null
      let lastError: Error | null = null
      
      // Try corsproxy.io first
      try {
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(jsonUrl)}`
        const response = await fetch(proxyUrl)
        
        if (response.ok) {
          const text = await response.text()
          try {
            data = JSON.parse(text)
          } catch (parseError) {
            // If it's not JSON, might be HTML wrapped, try to extract JSON
            const jsonMatch = text.match(/\[.*\]/s)
            if (jsonMatch) {
              data = JSON.parse(jsonMatch[0])
            } else {
              throw new Error('Failed to parse JSON response')
            }
          }
        } else {
          throw new Error(`Proxy returned ${response.status}`)
        }
      } catch (err) {
        lastError = err instanceof Error ? err : new Error('Proxy fetch failed')
        
        // Fallback: try api.allorigins.win
        try {
          const proxyUrl2 = `https://api.allorigins.win/raw?url=${encodeURIComponent(jsonUrl)}`
          const response2 = await fetch(proxyUrl2)
          
          if (response2.ok) {
            const text2 = await response2.text()
            try {
              data = JSON.parse(text2)
            } catch (parseError2) {
              const jsonMatch2 = text2.match(/\[.*\]/s)
              if (jsonMatch2) {
                data = JSON.parse(jsonMatch2[0])
              } else {
                throw new Error('Failed to parse JSON from fallback proxy')
              }
            }
          } else {
            throw new Error(`Fallback proxy returned ${response2.status}`)
          }
        } catch (err2) {
          throw new Error('Unable to fetch Reddit post. Please try downloading the image manually.')
        }
      }
      
      if (!data) {
        throw lastError || new Error('Failed to fetch Reddit post data')
      }
      
      // Extract image URL from Reddit post data
      let imageUrl: string | null = null
      
      if (data[0]?.data?.children[0]?.data) {
        const postData = data[0].data.children[0].data
        
        // Check for direct image URL (i.redd.it)
        if (postData.url_overridden_by_dest && 
            (postData.url_overridden_by_dest.includes('i.redd.it') || 
             postData.url_overridden_by_dest.match(/\.(jpg|jpeg|png|gif|webp)$/i))) {
          imageUrl = postData.url_overridden_by_dest
        }
        // Check for preview image
        else if (postData.preview?.images?.[0]?.source?.url) {
          imageUrl = postData.preview.images[0].source.url.replace(/&amp;/g, '&')
        }
        // Check for gallery images
        else if (postData.gallery_data?.items?.[0]) {
          const mediaId = postData.gallery_data.items[0].media_id
          if (postData.media_metadata?.[mediaId]?.s?.u) {
            imageUrl = postData.media_metadata[mediaId].s.u.replace(/&amp;/g, '&')
          }
        }
      }

      if (!imageUrl) {
        throw new Error('No image found in this Reddit post')
      }

      // Fetch the image
      const imageResponse = await fetch(imageUrl)
      if (!imageResponse.ok) {
        throw new Error('Failed to download image')
      }

      const blob = await imageResponse.blob()
      
      // Get filename from URL or use default
      const urlParts = imageUrl.split('/')
      const filename = urlParts[urlParts.length - 1].split('?')[0] || 'reddit-image.jpg'
      
      // Create File object from blob
      const file = new File([blob], filename, { type: blob.type || 'image/jpeg' })
      
      // Add to files list
      addFiles([file])
      setRedditUrl('')
      setSuccess('Image loaded from Reddit!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load image from Reddit')
      console.error('Reddit fetch error:', err)
    } finally {
      setLoadingReddit(false)
    }
  }, [addFiles])

  const handleRedditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!redditUrl.trim()) return
    
    // Validate and normalize Reddit URL
    let normalizedUrl = redditUrl.trim()
    
    // Remove query parameters and fragments
    normalizedUrl = normalizedUrl.split('?')[0].split('#')[0]
    
    // Ensure it's a valid Reddit post URL
    if (!normalizedUrl.includes('reddit.com') || !normalizedUrl.includes('/comments/')) {
      setError('Please enter a valid Reddit post URL')
      return
    }
    
    // Ensure it starts with https://
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl
    }
    
    // Convert http to https
    normalizedUrl = normalizedUrl.replace(/^http:\/\//, 'https://')

    await fetchRedditImage(normalizedUrl)
  }

  const toggleSelect = (id: string) => {
    setFiles(prev =>
      prev.map(f => (f.id === id ? { ...f, selected: !f.selected } : f))
    )
  }

  const setCategory = (id: string, category: PortfolioAsset['category']) => {
    setFiles(prev =>
      prev.map(f => (f.id === id ? { ...f, category } : f))
    )
  }

  const selectAll = () => {
    setFiles(prev => prev.map(f => ({ ...f, selected: true })))
  }

  const deselectAll = () => {
    setFiles(prev => prev.map(f => ({ ...f, selected: false })))
  }

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }

  const handleUpload = async () => {
    const selectedFiles = files.filter(f => f.selected && f.category)
    const withoutCategory = files.filter(f => f.selected && !f.category)

    if (withoutCategory.length > 0) {
      setError(`Please assign a category to ${withoutCategory.length} file(s)`)
      return
    }

    if (selectedFiles.length === 0) {
      setError('Please select at least one file and assign a category')
      return
    }

    setError(null)
    setSuccess(null)
    setUploading(true)
    setProgress(0)

    try {
      // Group by category
      const byCategory = selectedFiles.reduce((acc, file) => {
        const cat = file.category!
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(file)
        return acc
      }, {} as Record<PortfolioAsset['category'], FileWithPreview[]>)

      let uploaded = 0
      const total = selectedFiles.length

      // Upload files by category
      for (const [category, categoryFiles] of Object.entries(byCategory)) {
        for (const fileWithPreview of categoryFiles) {
          const file = fileWithPreview.file
          const fileType = file.type.startsWith('video/') ? 'video' : 'image'

          // Upload file
          const url = await uploadFile(file, category as PortfolioAsset['category'])

          // Create database entry
          await createAsset(
            category as PortfolioAsset['category'],
            url,
            fileType,
            file.name.replace(/\.[^/.]+$/, ''), // Remove extension for title
            undefined,
            undefined,
            undefined
          )

          uploaded++
          setProgress((uploaded / total) * 100)
        }
      }

      // Clean up preview URLs
      selectedFiles.forEach(f => URL.revokeObjectURL(f.preview))

      // Remove uploaded files
      setFiles(prev => prev.filter(f => !selectedFiles.includes(f)))

      setSuccess(`Successfully uploaded ${uploaded} file(s)!`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const categories: PortfolioAsset['category'][] = [
    'graphics',
    'illustrations',
    'motion-graphics',
    'videos',
    'logos-brands',
    'misc',
  ]

  return (
    <div className="bulk-upload-container">
      <div className="bulk-upload-header">
        <h2>Bulk Upload</h2>
        <p>Upload multiple images and assign them to categories</p>
      </div>

      <div className="bulk-upload-reddit-section">
        <form onSubmit={handleRedditSubmit} className="bulk-upload-reddit-form">
          <input
            type="text"
            value={redditUrl}
            onChange={(e) => setRedditUrl(e.target.value)}
            placeholder="Paste Reddit post URL (e.g., https://www.reddit.com/r/...)"
            className="bulk-upload-reddit-input"
            disabled={loadingReddit || uploading}
          />
          <button
            type="submit"
            disabled={loadingReddit || uploading || !redditUrl.trim()}
            className="bulk-upload-reddit-button"
          >
            {loadingReddit ? 'Loading...' : 'Load from Reddit'}
          </button>
        </form>
      </div>

      <div
        className={`bulk-upload-dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="bulk-file-upload"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="bulk-upload-input-hidden"
          disabled={uploading}
        />
        <label htmlFor="bulk-file-upload" className="bulk-upload-label">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p>Drag & drop files here or click to browse</p>
          <p className="bulk-upload-hint">Supports images and videos</p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="bulk-upload-files">
          <div className="bulk-upload-actions">
            <button onClick={selectAll} disabled={uploading}>
              Select All
            </button>
            <button onClick={deselectAll} disabled={uploading}>
              Deselect All
            </button>
            <span className="bulk-upload-count">
              {files.filter(f => f.selected).length} of {files.length} selected
            </span>
          </div>

          <div className="bulk-upload-grid">
            {files.map(fileWithPreview => (
              <div
                key={fileWithPreview.id}
                className={`bulk-upload-item ${fileWithPreview.selected ? 'selected' : ''}`}
              >
                <div className="bulk-upload-checkbox">
                  <input
                    type="checkbox"
                    checked={fileWithPreview.selected}
                    onChange={() => toggleSelect(fileWithPreview.id)}
                    disabled={uploading}
                  />
                </div>
                <div className="bulk-upload-preview">
                  {fileWithPreview.file.type.startsWith('image/') ? (
                    <img src={fileWithPreview.preview} alt={fileWithPreview.file.name} />
                  ) : (
                    <video src={fileWithPreview.preview} muted />
                  )}
                </div>
                <div className="bulk-upload-info">
                  <p className="bulk-upload-filename" title={fileWithPreview.file.name}>
                    {fileWithPreview.file.name}
                  </p>
                  <select
                    value={fileWithPreview.category || ''}
                    onChange={(e) => setCategory(fileWithPreview.id, e.target.value as PortfolioAsset['category'])}
                    disabled={uploading || !fileWithPreview.selected}
                    className="bulk-upload-category-select"
                  >
                    <option value="">Select category...</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="bulk-upload-remove"
                  onClick={() => removeFile(fileWithPreview.id)}
                  disabled={uploading}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="bulk-upload-submit">
            {uploading && (
              <div className="bulk-upload-progress-bar">
                <div
                  className="bulk-upload-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            <button
              onClick={handleUpload}
              disabled={uploading || files.filter(f => f.selected && f.category).length === 0}
              className="bulk-upload-button"
            >
              {uploading ? `Uploading... ${Math.round(progress)}%` : `Upload ${files.filter(f => f.selected && f.category).length} file(s)`}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bulk-upload-error">
          <p>Error: {error}</p>
        </div>
      )}

      {success && (
        <div className="bulk-upload-success">
          <p>{success}</p>
        </div>
      )}
    </div>
  )
}

export default BulkUpload
