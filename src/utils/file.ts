import { getAccessToken } from '@/api/instance'
import { ToastType } from '@/config/notifications'

import getApiUrl from './getApiUrl'
import globalErrorBoundary from './globalErrorBoundary'
import globalRouter from './globalRouter'
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
            method: postData ? 'POST' : 'GET',
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'Content-Type': 'application/json',
            },
            ...(postData && { body: JSON.stringify(postData) }),
        })

        if (!response.ok) {
            const error = new Error(
                `HTTP error! status: ${response.status}`
            ) as Error & { status?: number }
            error.status = response.status
            throw error
        }

        const blob = await response.blob()
        const contentDisposition = response.headers.get('content-disposition')
        const fileNameMatch = contentDisposition?.match(/filename="?(.+)"?/)
        const fileName = fileNameMatch?.[1] || 'downloaded_file'

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()

        // Clean up
        link.remove()
        URL.revokeObjectURL(url)
    } catch (error) {
        handleDownloadError(error)
    }
}

// Helper function to handle errors
const handleDownloadError = (error: unknown) => {
    const typedError = error as Error & { status?: number }
    const status = typedError.status

    console.error(`Error fetching data: ${typedError.message}`)

    const authErrors = new Set([401, 403])
    if (status && authErrors.has(status)) {
        toastNotification('notLoggedIn')
        globalRouter.navigate?.('/login')
        return
    }

    if (status === 500) {
        globalErrorBoundary.showBoundary?.(error)
        return
    }

    const errorMessages: Map<number, ToastType> = new Map([
        [441, 'error441'],
        [442, 'error442'],
        [443, 'error443'],
        [444, 'error444'],
    ])

    if (status && errorMessages.has(status)) {
        toastNotification(errorMessages.get(status)!)
        return
    }
}
