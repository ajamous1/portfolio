// Supabase client configuration
// Replace these with your Supabase project credentials
// Get them from: https://app.supabase.com -> Your Project -> Settings -> API

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export interface PortfolioAsset {
  id: string
  category: 'graphics' | 'illustrations' | 'motion-graphics' | 'videos' | 'logos-brands' | 'misc'
  title?: string
  description?: string
  url: string
  thumbnail_url?: string
  file_type: 'image' | 'video'
  display_order: number
  created_at: string
}

// Simple fetch-based client (no SDK needed for read-only access)
export async function getAssets(category: PortfolioAsset['category']): Promise<PortfolioAsset[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase credentials not configured. Using empty array.')
    console.warn('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.local')
    return []
  }

  try {
    const url = `${SUPABASE_URL}/rest/v1/assets?category=eq.${category}&select=*&order=display_order.asc,created_at.desc`
    
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Supabase API Error (${response.status}):`, errorText)
      
      if (response.status === 401) {
        console.error('401 Unauthorized - Check:')
        console.error('1. Is your VITE_SUPABASE_ANON_KEY correct?')
        console.error('2. Have you created the RLS policy? (See SUPABASE_SETUP.md)')
        console.error('3. Does the "assets" table exist?')
      } else if (response.status === 404) {
        console.error('404 Not Found - The "assets" table might not exist. Run the SQL from SUPABASE_SETUP.md')
      }
      
      throw new Error(`Failed to fetch assets: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching assets:', error)
    return []
  }
}

// Upload file to Supabase Storage
export async function uploadFile(
  file: File,
  category: PortfolioAsset['category']
): Promise<string> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase credentials not configured')
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${category}/${fileName}`

  // Upload to storage
  const formData = new FormData()
  formData.append('file', file)

  const uploadResponse = await fetch(
    `${SUPABASE_URL}/storage/v1/object/portfolio/${filePath}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: formData,
    }
  )

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text()
    throw new Error(`Upload failed: ${uploadResponse.status} ${errorText}`)
  }

  // Get public URL
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/portfolio/${filePath}`
  return publicUrl
}

// Create asset entry in database
export async function createAsset(
  category: PortfolioAsset['category'],
  url: string,
  fileType: 'image' | 'video',
  title?: string,
  description?: string,
  thumbnailUrl?: string,
  displayOrder?: number
): Promise<PortfolioAsset> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase credentials not configured')
  }

  // Get max display_order for this category
  const existingAssets = await getAssets(category)
  const maxOrder = existingAssets.length > 0 
    ? Math.max(...existingAssets.map(a => a.display_order)) 
    : -1

  const response = await fetch(`${SUPABASE_URL}/rest/v1/assets`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({
      category,
      url,
      file_type: fileType,
      title: title || null,
      description: description || null,
      thumbnail_url: thumbnailUrl || null,
      display_order: displayOrder !== undefined ? displayOrder : maxOrder + 1,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Create asset error details:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
      url: `${SUPABASE_URL}/rest/v1/assets`,
      body: JSON.stringify({
        category,
        url,
        file_type: fileType,
        title: title || null,
        description: description || null,
        thumbnail_url: thumbnailUrl || null,
        display_order: displayOrder !== undefined ? displayOrder : maxOrder + 1,
      }),
    })
    throw new Error(`Failed to create asset: ${response.status} ${errorText}`)
  }

  const data = await response.json()
  return Array.isArray(data) ? data[0] : data
}

// Gallery Drawings Interface (stored in 'pics' table)
export interface GalleryDrawing {
  id: string
  image_url: string
  author_name: string
  created_at: string
  month_key: string
}

// Convert base64 data URL to File
function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

// Get current month key
function getCurrentMonthKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

// Get gallery drawings from Supabase
export async function getGalleryDrawings(): Promise<GalleryDrawing[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase credentials not configured. Using empty array.')
    return []
  }

  try {
    const currentMonthKey = getCurrentMonthKey()
    const url = `${SUPABASE_URL}/rest/v1/pics?month_key=eq.${currentMonthKey}&select=*&order=created_at.desc`
    
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Supabase API Error (${response.status}):`, errorText)
      return []
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching gallery drawings:', error)
    return []
  }
}

// Save gallery drawing to Supabase
export async function saveGalleryDrawing(imageData: string, authorName: string): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Supabase credentials not configured')
    return false
  }

  try {
    const currentMonthKey = getCurrentMonthKey()
    
    // Get current drawings to check limit
    const currentDrawings = await getGalleryDrawings()
    const MAX_ITEMS = 20

    // If at limit, delete the oldest (last in array since sorted newest first)
    if (currentDrawings.length >= MAX_ITEMS) {
      const oldestDrawing = currentDrawings[currentDrawings.length - 1]
      if (oldestDrawing) {
        // Delete from database
        const deleteResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/pics?id=eq.${oldestDrawing.id}`,
          {
            method: 'DELETE',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            },
          }
        )

        if (deleteResponse.ok) {
          // Also delete the file from storage if possible
          // Extract file path from URL
          const filePath = oldestDrawing.image_url.split('/portfolio/')[1]
          if (filePath) {
            try {
              await fetch(
                `${SUPABASE_URL}/storage/v1/object/portfolio/${filePath}`,
                {
                  method: 'DELETE',
                  headers: {
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'apikey': SUPABASE_ANON_KEY,
                  },
                }
              )
            } catch (err) {
              // Ignore storage deletion errors
              console.warn('Could not delete old file from storage:', err)
            }
          }
        }
      }
    }

    // Convert base64 to File
    const fileName = `gallery-${Date.now()}-${Math.random().toString(36).substring(7)}.png`
    const file = dataURLtoFile(imageData, fileName)
    const filePath = `gallery/${fileName}`

    // Upload to storage
    const formData = new FormData()
    formData.append('file', file)

    const uploadResponse = await fetch(
      `${SUPABASE_URL}/storage/v1/object/portfolio/${filePath}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
        },
        body: formData,
      }
    )

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('Upload failed:', errorText)
      return false
    }

    // Get public URL
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/portfolio/${filePath}`

    // Create database entry
    const response = await fetch(`${SUPABASE_URL}/rest/v1/pics`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        image_url: publicUrl,
        author_name: authorName || 'Anonymous',
        month_key: currentMonthKey,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to create gallery drawing:', errorText)
      return false
    }

    return true
  } catch (error) {
    console.error('Error saving gallery drawing:', error)
    return false
  }
}

// Delete a gallery drawing from Supabase (when image is missing)
export async function deleteGalleryDrawing(id: string): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Supabase credentials not configured')
    return false
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/pics?id=eq.${id}`,
      {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    )

    return response.ok
  } catch (error) {
    console.error('Error deleting gallery drawing:', error)
    return false
  }
}

export { SUPABASE_URL, SUPABASE_ANON_KEY }
