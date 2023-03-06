import { Text } from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'
import { useEffect, useRef, useState } from 'react'
import { useWindowSize } from 'react-use'

const TableOfContents = ({ display }: { display: 'block' | 'fixed' }) => {
    const windowSize = useWindowSize()

    const [style, setStyle] = useState({})
    const [h2Elements, setH2Elements] = useState<
        { title: string | null; id: string; y: number }[]
    >([])

    const container = useRef<HTMLDivElement>(null)

    /** Get x and y of sidebar container */
    useEffect(() => {
        if (!container.current) return

        const rect = container.current.getBoundingClientRect()
        if (display === 'block') {
            setStyle({
                display: 'block',
            })
        } else if (display === 'fixed') {
            setStyle({
                x: rect.x,
                y: rect.y,
                width: rect.width,
                display: 'fixed',
            })
        } else {
            throw new Error('No correct display value')
        }
    }, [container, windowSize, display])

    /** Get all H2 elements on the page and set in state */
    useEffect(() => {
        const navHeight =
            document.getElementById('top-navigation')?.offsetHeight

        if (!navHeight) return

        setH2Elements(
            Array.from(document.querySelectorAll('h2')).map(el => ({
                title: el.textContent,
                id: el.id,
                y: el.getBoundingClientRect().y - navHeight - 20, // 20 Pixels extra offset
            }))
        )
    }, [])

    return (
        <div
            className={
                display === 'block'
                    ? 'col-span-6 p-6 mt-6 bg-pzh-cool-gray-light bg-opacity-30 block xl:hidden'
                    : 'relative hidden col-span-1 mt-12 xl:block'
            }
            ref={container}>
            <div className="z-10" style={style}>
                <Text
                    type="span"
                    className="block font-bold"
                    color="text-pzh-blue-dark">
                    Op deze pagina
                </Text>
                <nav id={`table-of-contents-${display}`}>
                    <ul
                        className={
                            display === 'block'
                                ? 'grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-0 mt-2'
                                : ''
                        }>
                        {h2Elements.map(el => (
                            <li
                                key={el.id}
                                tabIndex={0}
                                onClick={() => {
                                    window.scrollTo({
                                        left: 0,
                                        top: el.y,
                                        behavior: 'smooth',
                                    })
                                }}
                                className="pt-1 cursor-pointer text-pzh-blue hover:text-pzh-blue-dark">
                                <AngleRight
                                    size={16}
                                    className="absolute mt-1"
                                />
                                <button
                                    onClick={() => {
                                        window.scrollTo({
                                            left: 0,
                                            top: el.y,
                                            behavior: 'smooth',
                                        })
                                    }}
                                    className="block pl-5 underline decoration-1">
                                    {el.title}
                                </button>
                            </li>
                        ))}
                        <li className="flex items-start py-1 transition-colors duration-100 ease-in text-pzh-blue hover:text-pzh-blue-dark"></li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default TableOfContents
