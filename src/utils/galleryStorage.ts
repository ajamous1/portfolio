export interface GalleryItem {
  id: string
  imageData: string
  authorName: string
  timestamp: number
  monthKey: string // Format: "YYYY-MM"
}

const STORAGE_KEY = 'tiny-canvas-gallery'
const MAX_ITEMS = 20

function getCurrentMonthKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function getNextMonthStart(): number {
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return nextMonth.getTime()
}

export function saveDrawing(imageData: string, authorName: string): boolean {
  try {
    const currentMonthKey = getCurrentMonthKey()
    const items = getGalleryItems()
    
    // Filter to current month only
    const currentMonthItems = items.filter(item => item.monthKey === currentMonthKey)
    
    // Check if gallery is full
    if (currentMonthItems.length >= MAX_ITEMS) {
      return false // Gallery full
    }
    
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      imageData,
      authorName: authorName || 'Anonymous',
      timestamp: Date.now(),
      monthKey: currentMonthKey,
    }
    
    // Add new item and keep only current month items
    const updatedItems = [...currentMonthItems, newItem]
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems))
    return true
  } catch (error) {
    console.error('Error saving drawing:', error)
    return false
  }
}

export function getGalleryItems(): GalleryItem[] {
  try {
    const currentMonthKey = getCurrentMonthKey()
    const stored = localStorage.getItem(STORAGE_KEY)
    
    if (!stored) return []
    
    const items: GalleryItem[] = JSON.parse(stored)
    
    // Filter to current month only (auto-expire old months)
    const currentMonthItems = items.filter(item => item.monthKey === currentMonthKey)
    
    // If we have items from a different month, clear them
    if (currentMonthItems.length !== items.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentMonthItems))
    }
    
    // Sort by timestamp (newest first)
    return currentMonthItems.sort((a, b) => b.timestamp - a.timestamp)
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
