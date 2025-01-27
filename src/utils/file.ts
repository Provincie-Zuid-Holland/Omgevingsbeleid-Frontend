import { getAccessToken } from '@/api/instance'

import getApiUrl from './getApiUrl'
import { toastNotification } from './toastNotification'

export const fileToBase64 = async (file: File): Promise<string> =>
    await new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.addEventListener('load', () => {
            const result = reader.result as string
            resolve(result)
        })

        reader.addEventListener('error', reject)

        reader.readAsDataURL(file)
    })

export async function base64ToFile(
    dataUrl: string,
    fileName: string
): Promise<File> {
    const res: Response = await fetch(dataUrl)
    const blob: Blob = await res.blob()

    return new File([blob], fileName, { type: 'image/png' })
}

export const downloadFile = async (path: string, postData?: object) => {
    try {
        const response = await fetch(`${getApiUrl()}/${path}`, {
            method: !!postData ? 'POST' : 'GET',
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'Content-Type': 'application/json',
            },
            ...(!!postData && {
                body: JSON.stringify(postData),
            }),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const blob = await response.blob()
        const contentDisposition = response.headers.get('content-disposition')

        let fileName = 'downloaded_file'

        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/)
            if (fileNameMatch && fileNameMatch.length > 1) {
                fileName = fileNameMatch[1]
            }
        }

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()

        // Clean up
        link.parentNode?.removeChild(link)
        URL.revokeObjectURL(url)
    } catch (error) {
        toastNotification('error')
        console.error(`Error fetching data: ${error}`)

        return Promise.reject(error)
    }
}
