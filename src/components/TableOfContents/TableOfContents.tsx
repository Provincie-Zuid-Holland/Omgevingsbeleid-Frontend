import { AngleRight } from '@pzh-ui/icons'
import classNames from 'classnames'
import { useState } from 'react'
import { useEffectOnce } from 'react-use'

const TableOfContents = () => {
    const [elements, setElements] = useState<{ title?: string; y: number }[]>(
        []
    )
    const [activeItem, setActiveItem] = useState<string | undefined>('')

    /** Get all sections on the page and set in state */
    useEffectOnce(() => {
        const navHeight =
            document.getElementById('top-navigation')?.offsetHeight

        if (!navHeight) return

        const sections = Array.from(
            document.querySelectorAll('[data-section]')
        ) as HTMLDivElement[]

        setElements(
            sections.map(el => ({
                title: (el as HTMLDivElement).dataset.section,
                y: el.getBoundingClientRect().y - navHeight - 20, // 20 Pixels extra offset
            }))
        )

        /** Highlight active item on scroll */
        window.addEventListener('scroll', () => {
            const fromTop = window.pageYOffset + navHeight + 20
            const elements: HTMLDivElement[] = []

            ;[...sections].map((item, index) => {
                if (item.offsetTop < (index > 0 ? fromTop + 200 : fromTop)) {
                    elements.push(item)
                }
            })

            const cur = elements[elements.length - 1] as HTMLDivElement
            const id = cur ? cur.dataset.section : ''

            if (activeItem !== id) setActiveItem(id)
        })
    })

    if (!elements.length) return null

    return (
        <nav id="table-of-contents">
            <ul>
                {elements.map(el => (
                    <li
                        key={el.title}
                        id={el.title}
                        className={classNames('pt-1 cursor-pointer ', {
                            'text-pzh-green hover:text-pzh-green-dark':
                                activeItem !== el.title,
                            'text-pzh-blue hover:text-pzh-blue-dark font-bold':
                                activeItem === el.title,
                        })}>
                        <AngleRight size={16} className="absolute mt-1" />
                        <button
                            onClick={() => {
                                window.scrollTo({
                                    left: 0,
                                    top: el.y,
                                    behavior: 'smooth',
                                })
                            }}
                            className={classNames('block pl-5 text-left', {
                                underline: activeItem !== el.title,
                            })}>
                            {el.title}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default TableOfContents
