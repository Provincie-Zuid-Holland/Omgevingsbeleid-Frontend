export function replaceImagesWithTokens(
    html: string,
    store: Record<string, string>
): string {
    let counter = 0
    return html.replace(/<img[^>]*>/g, match => {
        const key = `IMG-${counter++}` // no prefix → consistent
        store[key] = match
        return `[[${key}]]`
    })
}

export function restoreImagesWithDiff(
    html: string,
    storeA: Record<string, string>,
    storeB: Record<string, string>
): string {
    return html.replace(/\[\[(.*?)\]\]/g, (_, key) => {
        const oldImg = storeA[key]
        const newImg = storeB[key]

        if (oldImg && newImg) {
            if (oldImg === newImg) {
                return oldImg
            }
            return `
        <del>⚠️ Oude afbeelding<br/>${oldImg}</del>
        <ins>⚠️ Nieuwe afbeelding<br/>${newImg}</ins>
      `
        }

        if (oldImg && !newImg) {
            return `<del>⚠️ Afbeeding verwijderd<br/>${oldImg}</del>`
        }

        if (!oldImg && newImg) {
            return `<ins>⚠️ Afbeelding toegevoegd<br/>${newImg}</ins>`
        }

        return ''
    })
}
