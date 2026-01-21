/**
 * Bulk add assets to Supabase database
 * 
 * Usage:
 * 1. Make sure .env.local has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 * 2. Update the files array below with your file names
 * 3. Run: node scripts/bulk-add-assets.mjs
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from .env.local
let SUPABASE_URL = ''
let SUPABASE_ANON_KEY = ''

try {
  const envFile = readFileSync(join(__dirname, '..', '.env.local'), 'utf8')
  envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim()
      if (key === 'VITE_SUPABASE_URL') {
        SUPABASE_URL = value
      } else if (key === 'VITE_SUPABASE_ANON_KEY') {
        SUPABASE_ANON_KEY = value
      }
    }
  })
} catch (error) {
  console.error('Error reading .env.local:', error.message)
  console.error('Make sure .env.local exists with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env.local')
  process.exit(1)
}

// Configuration
const CATEGORY = 'logos-brands'
const BUCKET_NAME = 'portfolio'

// List of files to add (update this with your actual file names)
const files = [
  '2025allstar.png',
  'calipr.png',
  'hawkstalk.png',
  'kwilttlogo.png',
  'msl.png',
  'nextwave.png',
  'techhubpfp.png',
  'wolvespluglogo (1).png'
]

async function bulkAddAssets() {
  console.log(`Adding ${files.length} assets to ${CATEGORY} category...\n`)

  // Construct URLs and prepare data
  const assets = files.map((fileName, index) => {
    // Encode the file name for URL (handles spaces and special characters)
    const encodedFileName = encodeURIComponent(fileName)
    const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${CATEGORY}/${encodedFileName}`
    
    // Clean up title (remove extension and (1) suffix)
    const title = fileName
      .replace('.png', '')
      .replace('.jpg', '')
      .replace('.jpeg', '')
      .replace(' (1)', '')
      .trim()
    
    return {
      category: CATEGORY,
      url: url,
      file_type: 'image',
      display_order: index,
      title: title,
    }
  })

  console.log('Assets to add:')
  assets.forEach((asset, i) => {
    console.log(`${i + 1}. ${asset.title} - ${asset.url}`)
  })
  console.log('')

  // Insert all assets at once
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/assets`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(assets),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Error (${response.status}):`, errorText)
      throw new Error(`Failed to add assets: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`✅ Successfully added ${data.length} assets!`)
    console.log('\nAdded assets:')
    data.forEach((asset, i) => {
      console.log(`${i + 1}. ${asset.title || 'Untitled'} (ID: ${asset.id})`)
    })
  } catch (error) {
    console.error('Error adding assets:', error.message)
    process.exit(1)
  }
}

bulkAddAssets()
