/**
 * Sanitizes a filename to ensure it's compatible with S3 object key naming guidelines
 * Based on AWS S3 documentation: https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
 */
export function sanitizeFileName(fileName: string) {
    // Handle non-string inputs
    if (!fileName || typeof fileName !== 'string') return ''

    // Trim spaces from the entire filename first
    fileName = fileName.trim()

    // Handle special cases
    if (fileName === '.' || fileName === '..' || /^\.+$/.test(fileName))
        return fileName

    // Handle hidden files and special extensions
    if (fileName.startsWith('.') && !fileName.includes('/', 1)) {
        return fileName.toLowerCase()
    }

    // Split filename and extension
    const parts = fileName.split('.')
    const hasExtension = parts.length > 1
    const name = hasExtension ? parts.slice(0, -1).join('.') : fileName
    const ext = hasExtension ? '.' + parts[parts.length - 1].toLowerCase() : ''

    // Normalize Unicode characters and convert to ASCII where possible
    let sanitized = name
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^\x20-\x7E]/g, '') // Remove non-ASCII characters

    // Replace all types of whitespace with word boundaries
    sanitized = sanitized
        .split(/[\s\t\n\r]+/) // Split on any whitespace
        .filter(Boolean) // Remove empty parts
        .join('_') // Join with underscores

    // Replace other problematic characters
    sanitized = sanitized
        .replace(/[&$@=;:+,?()[\]{}'"<>|~!#^*\\/]/g, '_') // Special handling characters
        .replace(/_+/g, '_') // Collapse multiple underscores into one
        .replace(/^[_\W]+|[_\W]+$/g, '') // Remove leading/trailing underscores and non-word chars
        .toLowerCase() // Convert to lowercase for consistency

    // Handle case where sanitized is empty but has extension
    if (!sanitized && hasExtension) return ext

    // Limit length (allowing for UTF-8 multi-byte characters and extension)
    const maxBytes = 900 // Conservative limit below 1,024
    let bytes = 0
    let truncated = ''

    for (let i = 0; i < sanitized.length; i++) {
        const char = sanitized[i]
        const charBytes = new TextEncoder().encode(char).length

        if (bytes + charBytes <= maxBytes) {
            truncated += char
            bytes += charBytes
        } else {
            break
        }
    }

    // Combine truncated name with extension
    return truncated + ext
}
