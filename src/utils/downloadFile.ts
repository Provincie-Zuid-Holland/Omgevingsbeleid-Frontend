import { getAccessToken } from '@/api/instance'

import getApiUrl from './getApiUrl'

const downloadFile = async (path: string) => {
    try {
        const response = await fetch(`${getApiUrl()}/${path}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const blob = await response.blob()
        const contentDisposition = response.headers.get('content-disposition')
        let fileName = 'downloaded_file'
        if (contentDisposition) {
            fileName = contentDisposition.split('=')[1]
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
        console.error(`Error fetching data: ${error}`)
    }
}

export default downloadFile
