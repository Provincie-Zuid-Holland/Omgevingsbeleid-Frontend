const EMPTY_TAG_SELECTOR = 'em, strong, b, i, u, sub, sup'

export function isVisuallyEmpty(value: string): boolean {
    return (
        value
            .replace(/&nbsp;/gi, ' ')
            .replace(/\u00A0/g, ' ')
            .replace(/\u200B/g, '')
            .replace(/<br\s*\/?>/gi, '')
            .trim() === ''
    )
}

function unwrapElement(el: Element): void {
    el.replaceWith(...Array.from(el.childNodes))
}

export function cleanEmptyRteNodes(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html')

    let removedSomething = true

    while (removedSomething) {
        removedSomething = false

        // unwrap empty inline tags, preserving spaces inside them
        Array.from(doc.querySelectorAll(EMPTY_TAG_SELECTOR)).forEach(el => {
            if (isVisuallyEmpty(el.innerHTML)) {
                unwrapElement(el)
                removedSomething = true
            }
        })

        // remove empty paragraphs
        Array.from(doc.querySelectorAll('p'))
            .filter(p => !p.closest('table'))
            .forEach(p => {
                if (isVisuallyEmpty(p.innerHTML)) {
                    p.remove()
                    removedSomething = true
                }
            })

        // remove empty list items
        Array.from(doc.querySelectorAll('li')).forEach(li => {
            if (isVisuallyEmpty(li.innerHTML)) {
                li.remove()
                removedSomething = true
            }
        })

        // remove empty lists
        Array.from(doc.querySelectorAll('ul, ol')).forEach(list => {
            if (!list.querySelector('li')) {
                list.remove()
                removedSomething = true
            }
        })
    }

    return doc.body.innerHTML
}
