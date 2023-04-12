import { Text } from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'
import classNames from 'classnames'
import { useEffect, useState } from 'react'

const TableOfContents = ({ display }: { display: 'block' | 'fixed' }) => {
    const [elements, setElements] = useState<
        { title: string | null; id: string; y: number }[]
    >([])

    /** Get all H2 elements on the page and set in state */
    useEffect(() => {
        const navHeight =
            document.getElementById('top-navigation')?.offsetHeight

        if (!navHeight) return

        setElements(
            Array.from(document.querySelectorAll('h2')).map(el => ({
                title: el.textContent,
                id: el.id,
                y: el.getBoundingClientRect().y - navHeight - 20, // 20 Pixels extra offset
            }))
        )
    }, [])

    if (!elements.length) return null

    return (
        <div
            className={
                display === 'block'
                    ? 'p-6 mt-6 bg-pzh-cool-gray-light bg-opacity-30 block xl:hidden'
                    : 'hidden mt-12 xl:block sticky top-[120px]'
            }>
            <Text type="body-bold">Op deze pagina</Text>
            <nav>
                <ul
                    className={classNames({
                        'grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-0 mt-2':
                            display === 'block',
                    })}>
                    {elements.map(el => (
                        <li
                            key={el.id}
                            className="pt-1 cursor-pointer text-pzh-blue hover:text-pzh-blue-dark">
                            <AngleRight size={16} className="absolute mt-1" />
                            <button
                                onClick={() => {
                                    window.scrollTo({
                                        left: 0,
                                        top: el.y,
                                        behavior: 'smooth',
                                    })
                                }}
                                className="block pl-5 underline decoration-1 text-left">
                                {el.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}

export default TableOfContents
