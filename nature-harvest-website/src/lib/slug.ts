/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Generate a product slug from product name and ID
 * Format: product-name-id
 */
export function generateProductSlug(productName: string, productId: string): string {
  const nameSlug = generateSlug(productName)
  // Use last 8 characters of ID for uniqueness
  const idSuffix = productId.slice(-8)
  return `${nameSlug}-${idSuffix}`
}

/**
 * Extract product ID from a slug
 * If the slug contains an ID suffix (last 8 chars), we'll need to match it
 */
export function extractIdFromSlug(slug: string): string | null {
  // Check if it's a valid MongoDB ObjectId (24 hex characters)
  if (/^[0-9a-fA-F]{24}$/.test(slug)) {
    return slug
  }
  
  // Try to extract ID from slug format: name-id
  const parts = slug.split('-')
  if (parts.length > 1) {
    const possibleId = parts[parts.length - 1]
    // If the last part looks like an ID suffix (8 hex chars), we'll need to search
    if (/^[0-9a-fA-F]{8}$/.test(possibleId)) {
      return null // Will need to search by slug
    }
  }
  
  return null
}

/**
 * Check if a string is a valid MongoDB ObjectId
 */
export function isObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

