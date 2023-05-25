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
