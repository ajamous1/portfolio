export interface FontMeta {
  name: string
  tagline: string
  description: string
  cssStack?: string
}

const FONT_DATA: FontMeta[] = [
  {
    name: 'Helvetica',
    tagline: 'The Subway Standard',
    description: 'Designed for clarity, Helvetica became the voice of NYC\'s subway and a global wayfinding icon.',
    cssStack: 'Helvetica, Arial, sans-serif',
  },
  {
    name: 'Inter',
    tagline: 'Optimized for screens',
    description: 'A typeface carefully crafted for computer screens, featuring a tall x-height to aid in readability of mixed-case and lower-case text.',
    cssStack: 'Inter, system-ui, sans-serif',
  },
  {
    name: 'Roboto',
    tagline: 'Geometric and friendly',
    description: 'A natural-width typeface that makes reading more comfortable and natural.',
    cssStack: 'Roboto, sans-serif',
  },
  {
    name: 'Playfair Display',
    tagline: 'Elegant serif',
    description: 'A transitional design with high contrast and delicate hairlines.',
    cssStack: 'Playfair Display, serif',
  },
]

export function getFontByName(name: string): FontMeta {
  const font = FONT_DATA.find(f => f.name.toLowerCase() === name.toLowerCase())
  return font || FONT_DATA[0]
}

export { FONT_DATA }
