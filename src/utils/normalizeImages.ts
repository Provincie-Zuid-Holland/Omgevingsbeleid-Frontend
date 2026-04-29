// Using tokens over <img> keeps diffs stable
const IMG_TOKEN_PREFIX = 'PZHIMGTOKEN'
const TOKEN_RE = /PZHIMGTOKEN[a-z0-9]+/g
const WRAPPED_TOKEN_RE = /<(del|ins)>\s*(PZHIMGTOKEN[a-z0-9]+)\s*<\/\1>/g

function contentKey(imgHtml: string): string {
    let hash = 0
    for (let i = 0; i < imgHtml.length; i++) {
        hash = Math.imul(31, hash) + (imgHtml.codePointAt(i) ?? 0)
    }
    return `${IMG_TOKEN_PREFIX}${(hash >>> 0).toString(36)}`
}

export function replaceImagesWithTokens(
    html: string,
    store: Record<string, string>
): string {
    return html.replaceAll(/<img[^>]*>/g, match => {
        const key = contentKey(match)
        store[key] = match
        return key
    })
}

export function restoreImagesWithDiff(
    html: string,
    storeA: Record<string, string>,
    storeB: Record<string, string>
): string {
    const resolve = (key: string): string => {
        const oldImg = storeA[key]
        const newImg = storeB[key]

        if (oldImg && newImg) {
            if (oldImg === newImg) return oldImg
            return `<del>⚠️ Oude afbeelding<br/>${oldImg}</del><ins>⚠️ Nieuwe afbeelding<br/>${newImg}</ins>`
        }
        if (oldImg) return `<del>⚠️ Afbeelding verwijderd<br/>${oldImg}</del>`
        if (newImg) return `<ins>⚠️ Afbeelding toegevoegd<br/>${newImg}</ins>`
        return ''
    }

    // prevent double nesting of <del>/<ins>
    return html
        .replaceAll(WRAPPED_TOKEN_RE, (_, _tag, key) => resolve(key))
        .replaceAll(TOKEN_RE, key => resolve(key))
}
