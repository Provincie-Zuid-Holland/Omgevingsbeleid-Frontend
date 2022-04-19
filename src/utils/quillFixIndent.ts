// https://github.com/quilljs/quill/issues/979

interface NestedElement {
    content: string
    indent: number
    classes: string
}

export function quillDecodeIndent(text: string) {
    if (!text || text.length === 0) {
        return text
    }

    const tempEl = window.document.createElement('div')
    tempEl.setAttribute('style', 'display: none;')
    tempEl.innerHTML = text
    ;['ul', 'ol'].forEach(type => {
        // Grab each list, and work on it in turn
        Array.from(tempEl.querySelectorAll(type)).forEach(outerListEl => {
            const listChildren = Array.from(outerListEl.children).filter(
                el => el.tagName === 'LI'
            )

            let lastLiLevel = 0

            const parentElementsStack: Element[] = []
            const root = document.createElement(type)

            parentElementsStack.push(root)

            listChildren.forEach(e => {
                const currentLiLevel = getQuillListLevel(e)
                e.className = e.className.replace(
                    getIndentClass(currentLiLevel),
                    ''
                )
                e.removeAttribute('class')

                const difference = currentLiLevel - lastLiLevel
                lastLiLevel = currentLiLevel

                if (difference > 0) {
                    let currentDiff = difference

                    while (currentDiff > 0) {
                        let lastLiInCurrentLevel =
                            seekLastElement(
                                parentElementsStack
                            ).lastElementChild

                        if (!lastLiInCurrentLevel) {
                            lastLiInCurrentLevel = document.createElement('li')
                            encode_addChildToCurrentParent(
                                parentElementsStack,
                                lastLiInCurrentLevel
                            )
                        }

                        const newList = document.createElement(type)
                        lastLiInCurrentLevel.appendChild(newList)
                        parentElementsStack.push(newList)

                        currentDiff--
                    }
                }

                if (difference < 0) {
                    let currentDiff = difference

                    while (currentDiff < 0) {
                        parentElementsStack.pop()

                        currentDiff++
                    }
                }

                encode_addChildToCurrentParent(parentElementsStack, e)
            })

            outerListEl.innerHTML = root.innerHTML
        })
    })

    const newContent = tempEl.innerHTML
    tempEl.remove()
    const cleanedUpContent = quillRemoveEmptyClasses(newContent)
    return cleanedUpContent
}

export function quillEncodeIndent(text: string) {
    if (!text || text.length === 0) {
        return text
    }

    const tempEl = window.document.createElement('div')
    tempEl.setAttribute('style', 'display: none;')
    tempEl.innerHTML = text
    ;['ul', 'ol'].forEach(type => {
        Array.from(tempEl.querySelectorAll(type)).forEach(outerListEl => {
            const listResult = Array.from(outerListEl.children)
                .filter(e => e.tagName === 'LI')
                .map(e => encode_UnwindElement(type.toUpperCase(), e, 0))
                .reduce((prev, c) => [...prev, ...c], []) // flatten list
                .map(e => encode_GetLi(e))
                .reduce((prev, c) => `${prev}${c}`, '') // merge to one string

            outerListEl.innerHTML = listResult
        })
    })

    const newContent = tempEl.innerHTML
    tempEl.remove()

    return newContent
}

function encode_UnwindElement(
    listType: string,
    li: Element,
    level: number
): NestedElement[] {
    const childElements = Array.from(li.children)
        .filter(innerElement => innerElement.tagName === listType)
        .map(innerList =>
            Array.from(li.removeChild(innerList).children)
                .map(nestedListElement =>
                    encode_UnwindElement(
                        listType,
                        innerList.removeChild(nestedListElement),
                        level + 1
                    )
                )
                .reduce((prev, c) => [...prev, ...c], [])
        )
        .reduce((prev, c) => [...prev, ...c], [])

    const current: NestedElement = {
        classes: li.className,
        content: li.innerHTML,
        indent: level,
    }

    return [current, ...childElements]
}

function encode_GetLi(e: NestedElement) {
    if (e.content.length === 0) {
        return ''
    }
    let cl = ''
    if (e.indent > 0) {
        cl += `${getIndentClass(e.indent)}`
    }
    if (e.classes.length > 0) {
        cl += ` ${e.classes}`
    }
    return `<li${cl.length > 0 ? ` class="${cl}"` : ''}>${e.content}</li>`
}

function seekLastElement(list: Element[]): Element {
    return list[list.length - 1]
}

function encode_addChildToCurrentParent(
    parentStack: Element[],
    child: Element
): void {
    const currentParent = seekLastElement(parentStack)
    currentParent.appendChild(child)
}

function getQuillListLevel(el: Element) {
    const className = el.className || '0'
    return +className.replace(/[^\d]/g, '')
}

function getIndentClass(level: number) {
    return `ql-indent-${level}`
}

export function quillRemoveEmptyClasses(text: string) {
    return text.replace(/class="(?:\s*)"/g, '')
}
