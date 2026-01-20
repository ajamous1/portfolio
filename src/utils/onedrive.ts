/**
 * Converts OneDrive share links to embed URLs
 * 
 * OneDrive embed format: https://onedrive.live.com/embed?resid={FILE_ID}&authkey={AUTH_KEY}&em=2
 * 
 * To get the embed URL:
 * 1. Right-click the video in OneDrive
 * 2. Select "Embed"
 * 3. Copy the iframe src URL
 * 
 * Or manually convert:
 * - Share link: https://onedrive.live.com/?id=...&cid=...&resid=FILE_ID&authkey=AUTH_KEY
 * - Extract FILE_ID and AUTH_KEY
 * - Use: https://onedrive.live.com/embed?resid=FILE_ID&authkey=AUTH_KEY&em=2
 */

export function isOneDriveUrl(url: string): boolean {
  return url.includes('onedrive.live.com') || url.includes('1drv.ms')
}

export function convertToOneDriveEmbed(url: string): string {
  // If it's already an embed URL, return as-is
  if (url.includes('/embed') || url.includes('1drv.ms/v')) {
    return url
  }

  // Handle 1drv.ms short URLs (they work directly as embed URLs)
  if (url.includes('1drv.ms')) {
    return url
  }

  // Try to extract file ID and authkey from share link
  try {
    const urlObj = new URL(url)
    const resid = urlObj.searchParams.get('resid') || urlObj.searchParams.get('id')
    const authkey = urlObj.searchParams.get('authkey')
    
    if (resid && authkey) {
      return `https://onedrive.live.com/embed?resid=${resid}&authkey=${authkey}&em=2`
    }
  } catch (e) {
    // URL parsing failed, return as-is
  }

  // If we can't convert it, return the original URL
  return url
}

/**
 * Get embed URL from OneDrive share link
 * For the first video, you'll need to:
 * 1. Right-click the video file in OneDrive
 * 2. Click "Embed" 
 * 3. Copy the iframe src URL (looks like: https://onedrive.live.com/embed?resid=...&authkey=...&em=2)
 * 4. Use that URL in the database
 */
export function getOneDriveEmbedUrl(shareLink: string): string {
  return convertToOneDriveEmbed(shareLink)
}
