const base64ImgRegex = /<img[^>]+src="data:image\/[^">]+"[^>]*>/g

export function normalizeImages(htmlA: string, htmlB: string) {
    const imgsA = htmlA.match(base64ImgRegex) || []
    const imgsB = htmlB.match(base64ImgRegex) || []

    let normalizedA = htmlA
    let normalizedB = htmlB

    imgsA.forEach((imgTag, i) => {
        const otherImg = imgsB[i]

        if (otherImg === imgTag) {
            // identical image, replace both with a lightweight placeholder
            normalizedA = normalizedA.replace(imgTag, '<img src="[image]" />')
            normalizedB = normalizedB.replace(otherImg, '<img src="[image]" />')
        } else {
            // different image, mark them explicitly
            normalizedA = normalizedA.replace(
                imgTag,
                '<span>⚠️ Afbeelding gewijzigd (oud)</span>'
            )
            if (otherImg) {
                normalizedB = normalizedB.replace(
                    otherImg,
                    '<span>⚠️ Afbeelding gewijzigd (nieuw)</span>'
                )
            }
        }
    })

    return { normalizedA, normalizedB }
}
