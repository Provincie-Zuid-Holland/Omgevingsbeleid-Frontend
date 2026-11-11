import { ValidationError } from '@/api/fetchers.schemas'
import { getAccessToken } from '@/api/instance'

import getApiUrl from './getApiUrl'
import { handleHttpError } from './handleHttpError'
import { toastNotification } from './toastNotification'

const PDF_SERVICE_ERROR_MESSAGES = [
    'PDF preview service timed out',
    'PDF preview service is unreachable',
    'PDF preview service is unavailable',
]

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

export const downloadFile = async (
    path: string,
    postData?: object,
    openInNewTab = false
) => {
    try {
        const accessToken = getAccessToken()

        const response = await fetch(`${getApiUrl()}${path}`, {
            method: postData ? 'POST' : 'GET',
            headers: {
                ...(accessToken && {
                    Authorization: `Bearer ${accessToken}`,
                }),
                'Content-Type': 'application/json',
            },
            ...(postData && { body: JSON.stringify(postData) }),
        })

        if (!response.ok) {
            let detail: ValidationError[] | undefined

            try {
                const body = (await response.json()) as {
                    detail?: ValidationError[]
                }
                detail = body?.detail
            } catch {
                detail = undefined
            }

            const error = new Error(
                `HTTP error! status: ${response.status}`
            ) as Error & { status?: number; detail?: ValidationError[] }
            error.status = response.status
            error.detail = detail
            throw error
        }

        const blob = await response.blob()
        const contentDisposition = response.headers.get('content-disposition')
        const fileNameMatch = contentDisposition?.match(/filename="?(.+)"?/)
        const fileName = fileNameMatch?.[1] || 'downloaded_file'

        const fileUrl = URL.createObjectURL(blob)

        if (openInNewTab) {
            window.open(fileUrl, '_blank')
            setTimeout(() => URL.revokeObjectURL(fileUrl), 10_000)
        } else {
            const link = document.createElement('a')
            link.href = fileUrl
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            link.remove()
            URL.revokeObjectURL(fileUrl)
        }
    } catch (error) {
        handleDownloadError(error)
    }
}

const handleDownloadError = (error: unknown) => {
    const typedError = error as Error & {
        status?: number
        detail?: ValidationError[]
    }
    const status = typedError.status

    console.error(`Error fetching data: ${typedError.message}`)

    if (status === 503) {
        const isPdfServiceError = typedError.detail?.some(detail =>
            PDF_SERVICE_ERROR_MESSAGES.some(message =>
                detail.msg?.includes(message)
            )
        )

        if (isPdfServiceError) {
            toastNotification('pdfPreviewError')
        }
        return
    }

    handleHttpError(status, error, { extraToasts: { 444: 'error444' } })
}
