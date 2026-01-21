import { getGalleryDrawings, saveGalleryDrawing, type GalleryDrawing } from '../lib/supabase'

export interface GalleryItem {
  id: string
  imageData: string
  authorName: string
  timestamp: number
  monthKey: string // Format: "YYYY-MM"
}

function getCurrentMonthKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function getNextMonthStart(): number {
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return nextMonth.getTime()
}

// Convert GalleryDrawing from Supabase to GalleryItem format
function convertToGalleryItem(drawing: GalleryDrawing): GalleryItem {
  return {
    id: drawing.id,
    imageData: drawing.image_url, // Use URL instead of base64
    authorName: drawing.author_name,
    timestamp: new Date(drawing.created_at).getTime(),
    monthKey: drawing.month_key,
  }
}

export async function saveDrawing(imageData: string, authorName: string): Promise<boolean> {
  // Use Supabase for persistent storage
  return await saveGalleryDrawing(imageData, authorName)
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    // Fetch from Supabase
    const drawings = await getGalleryDrawings()
    return drawings.map(convertToGalleryItem)
  } catch (error) {
    console.error('Error loading gallery:', error)
    return []
  }
}

export function getDaysUntilReset(): number {
  const now = Date.now()
  const nextMonthStart = getNextMonthStart()
  const daysUntil = Math.ceil((nextMonthStart - now) / (1000 * 60 * 60 * 24))
  return daysUntil
}

export function clearGallery(): void {
  localStorage.removeItem(STORAGE_KEY)
}
