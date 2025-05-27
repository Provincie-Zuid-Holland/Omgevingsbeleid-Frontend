import CryptoJS from 'crypto-js'

const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET_KEY

/**
 * Encrypt data synchronously using AES
 */
export function encryptData<T>(data: T): string {
    const key = CryptoJS.SHA256(SECRET_KEY) // Ensure 256-bit key
    const iv = CryptoJS.lib.WordArray.random(16) // Generate 16-byte IV
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, { iv })

    return `${CryptoJS.enc.Base64.stringify(iv)}:${encrypted.toString()}`
}

/**
 * Decrypt data synchronously using AES
 */
export function decryptData<T>(cipherText: string | null): T | null {
    if (!cipherText) return null

    try {
        const [ivBase64, encryptedData] = cipherText.split(':')
        if (!ivBase64 || !encryptedData) {
            throw new Error('Invalid cipherText format.')
        }

        const key = CryptoJS.SHA256(SECRET_KEY) // Ensure key is 256-bit
        const iv = CryptoJS.enc.Base64.parse(ivBase64) // Correctly parse IV

        const decrypted = CryptoJS.AES.decrypt(encryptedData, key, { iv })
        const decryptedString = decrypted.toString(CryptoJS.enc.Utf8)

        if (!decryptedString) {
            throw new Error('Decryption resulted in an empty string.')
        }

        return JSON.parse(decryptedString) as T
    } catch (error) {
        console.error('Decryption failed:', error)
        return null
    }
}
