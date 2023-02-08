import { Text } from '@pzh-ui/components'
import { Bars, Minus, Plus } from '@pzh-ui/icons'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLockBodyScroll, useWindowSize } from 'react-use'

import BackButton from '@/components/BackButton'
import { LoaderCard } from '@/components/Loader'

interface VerordeningSidebarProps {
    verordening: any
}

function VerordeningSidebar({ verordening }: VerordeningSidebarProps) {
    const windowSize = useWindowSize()

    const sidebarContainer = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(() => windowSize.width > 1028)
    useLockBodyScroll(isOpen && windowSize.width < 1028)

    const [sidebarStyle, setSidebarStyle] = useState({})
    const [buttonStyle, setButtonStyle] = useState({})

    /** Effect for sidebarStyle */
    useEffect(() => {
        const nav = document.getElementById('top-navigation')
        const navBottom = nav?.getBoundingClientRect().bottom

        setButtonStyle({
            top: navBottom,
        })
    }, [windowSize])

    /** Effect for sidebarStyle */
    useEffect(() => {
        if (windowSize.width && windowSize.width < 1028) {
            setSidebarStyle({
                left: 0,
                top: 150,
                width: '100vw',
                height: 'calc(100vh - 150px)',
            })
        } else if (windowSize.width) {
            if (!isOpen) {
                setIsOpen(true)
            }

            const container = sidebarContainer.current
            const containerOffsetTop = container?.offsetTop || 0
            const containerOffsetLeft = container?.offsetLeft || 0
            const containerWidth = container?.offsetWidth || 0
            const screenHeight = windowSize.height
            const offsetYAxis = 155

            const sidebarHeight =
                screenHeight - containerOffsetTop - offsetYAxis * 1.5

            setSidebarStyle({
                top: containerOffsetTop + offsetYAxis,
                height: sidebarHeight ? sidebarHeight : '50vh',
                width: containerWidth,
                left: containerOffsetLeft,
            })
        }
    }, [windowSize, isOpen])

    return (
        <div
            className="relative col-span-6 lg:col-span-2"
            ref={sidebarContainer}>
            <BackButton />
            <div
                style={buttonStyle}
                id="small-screen-verordening-nav"
                onClick={() => setIsOpen(!isOpen)}
                className="fixed left-0 z-50 flex items-center justify-center w-full py-2 text-lg transition-colors duration-150 ease-in bg-white border-t border-b cursor-pointer lg:hidden hover:bg-gray-50">
                <Bars className="mr-2 text-pzh-blue" />
                <span className="mt-1 font-bold text-pzh-blue">Inhoud</span>
            </div>
            <div
                style={sidebarStyle}
                className={`${
                    isOpen ? 'fixed' : 'hidden'
                } z-10 p-4 overflow-y-auto pb-16 bg-white text-pzh-blue-dark`}>
                <Text type="span" className="hidden font-bold lg:block">
                    Inhoud
                </Text>
                <Text type="body" className="block text-sm font-bold lg:mt-6">
                    Omgevingsverordening
                </Text>
                {verordening ? (
                    <ul className="pl-2 mt-4">
                        {verordening?.Structuur?.Children.map(
                            (chapter: any) => (
                                <VerordeningSidebarItem
                                    parentIsOpen={true}
                                    setNavMenuOpen={setIsOpen}
                                    key={chapter.UUID}
                                    item={chapter}
                                />
                            )
                        )}
                    </ul>
                ) : (
                    <div className="py-4">
                        <LoaderCard mb="mb-2" height="20" />
                        <LoaderCard mb="mb-2" height="20" />
                        <LoaderCard mb="mb-2" height="20" />
                    </div>
                )}
            </div>
        </div>
    )
}

interface VerordeningSidebarItemProps {
    item: any
    setNavMenuOpen: (state: boolean) => void
    parentIsOpen: boolean
}

const VerordeningSidebarItem = ({
    item,
    setNavMenuOpen,
    parentIsOpen,
}: VerordeningSidebarItemProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const windowSize = useWindowSize()

    const focusElement = (UUID: string) => {
        const element = document.getElementById(UUID)
        if (element) {
            element.focus()
        }
    }

    const setActive = () => {
        navigate(`${location.pathname}?actief=${item.UUID}`)
        if (windowSize.width < 1028) {
            setNavMenuOpen(false)
        }
    }

    if (
        item.Type === 'Hoofdstuk' ||
        item.Type === 'Paragraaf' ||
        item.Type === 'Afdeling'
    ) {
        const hasChildren = item?.Children.length > 0

        return (
            <li className="my-2">
                <div>
                    <button
                        onClick={() => hasChildren && setIsOpen(!isOpen)}
                        id={
                            parentIsOpen || item.Type === 'Hoofdstuk'
                                ? `verordening-sidebar-item-${item.UUID}`
                                : undefined
                        }
                        className="text-left cursor-pointer">
                        <div
                            className={`mr-2 inline-flex bg-pzh-blue-dark text-white${
                                hasChildren
                                    ? ' items-center justify-center'
                                    : ' opacity-0'
                            }`}
                            style={{ width: 13, height: 13, borderRadius: 2 }}>
                            {isOpen ? <Minus size={11} /> : <Plus size={11} />}
                        </div>
                        {hasChildren && (
                            <span className="sr-only">Open menu inhoud </span>
                        )}
                        <span className="font-bold">
                            {item.Type} {item.Volgnummer}
                        </span>
                    </button>
                    <button
                        onClick={setActive}
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                setActive()
                                focusElement(item.UUID)
                            }
                        }}
                        className="block pl-5 text-left cursor-pointer">
                        <span className="sr-only">Navigeer naar</span>
                        <span>{item.Titel}</span>
                    </button>
                </div>
                {hasChildren ? (
                    <ul className={`pl-4 my-1 ${isOpen ? 'block' : 'hidden'}`}>
                        {item.Children.map((child: any) => (
                            <VerordeningSidebarItem
                                setNavMenuOpen={setNavMenuOpen}
                                key={child.UUID}
                                item={child}
                                parentIsOpen={isOpen}
                            />
                        ))}
                    </ul>
                ) : null}
            </li>
        )
    } else if (item.Type === 'Lid' || item.Type === 'Artikel') {
        return (
            <li>
                <button
                    id={
                        parentIsOpen
                            ? `verordening-sidebar-item-${item.UUID}`
                            : undefined
                    }
                    className="pl-5 my-1 text-left cursor-pointer"
                    onClick={setActive}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            setActive()
                            focusElement(item.UUID)
                        } else if (e.key === 'ArrowRight') {
                            setActive()
                            focusElement(item.UUID)
                        }
                    }}>
                    <span className="font-bold">
                        {item.Type} {item.Volgnummer}
                    </span>
                    <span className="block">{item.Titel}</span>
                </button>
            </li>
        )
    }

    return null
}

export default VerordeningSidebar
