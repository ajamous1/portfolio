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

export { SUPABASE_URL, SUPABASE_ANON_KEY }
