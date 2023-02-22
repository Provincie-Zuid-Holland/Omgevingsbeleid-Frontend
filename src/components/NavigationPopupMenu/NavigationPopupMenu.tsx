import { Heading, Text } from '@pzh-ui/components'
import { AngleRight, Bars, Xmark } from '@pzh-ui/icons'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLockBodyScroll, useWindowSize } from 'react-use'

import { Container } from '../Container'
import SearchBar from '../SearchBar'

/**
 * A popup menu that can be used to navigate the application.
 *
 * @param {boolean} showBanner - Parameter that if set to true, will show the banner.
 * @param {boolean} isOpen - Parameter that if set to true, will show the menu.
 * @param {boolean} setIsOpen - Open/close the menu.
 */

interface NavigationPopupMenuProps {
    showBanner: boolean
    isOpen: boolean
    setIsOpen: (e: boolean) => void
}

const NavigationPopupMenu = ({
    showBanner,
    isOpen,
    setIsOpen,
}: NavigationPopupMenuProps) => {
    const location = useLocation()
    const windowSize = useWindowSize()
    useLockBodyScroll(isOpen)
    const [bannerAdjustedOffsetTop, setBannerAdjustedOffsetTop] = useState({})
    const [isMobile, setIsMobile] = useState(false)
    const [containerHeightStyle, setContainerHeightStyle] = useState<
        { maxHeight: string } | undefined
    >(undefined)

    useEffect(() => {
        if (showBanner) {
            setBannerAdjustedOffsetTop({
                top: '146px',
            })
        } else {
            setBannerAdjustedOffsetTop({
                top: '96px',
            })
        }
    }, [showBanner])

    /** State for responsiveness */
    useEffect(() => {
        setIsMobile(windowSize.width <= 640)
        setContainerHeightStyle({
            maxHeight: `calc(100vh - ${
                document.getElementById('top-navigation')?.offsetHeight + 'px'
            })`,
        })
    }, [windowSize])

    /** Handle close on Escape key event */
    useEffect(() => {
        function closeOnEscape(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                setIsOpen(false)
            }
        }
        window.addEventListener('keydown', closeOnEscape)
        return () => window.removeEventListener('keydown', closeOnEscape)
    }, [setIsOpen])

    return (
        <>
            <ToggleMenuButton
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                isMobile={isMobile}
            />
            {isMobile ? (
                <div className="fixed bottom-0 right-0 z-50">
                    <div
                        className="flex items-center justify-center p-8 text-white cursor-pointer bg-pzh-blue-dark"
                        onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? (
                            <Xmark
                                aria-hidden="true"
                                size={18}
                                className="absolute"
                            />
                        ) : (
                            <Bars
                                aria-hidden="true"
                                size={18}
                                className="absolute"
                            />
                        )}
                    </div>
                </div>
            ) : null}
            {isOpen ? (
                <>
                    <div
                        style={bannerAdjustedOffsetTop}
                        className="fixed top-0 left-0 z-0 block w-screen h-screen bg-gray-900 pointer-events-none opacity-40"></div>
                    <nav
                        id="popup-menu"
                        className="fixed top-0 left-0 z-10 w-full pb-8 bg-white"
                        style={bannerAdjustedOffsetTop}
                        aria-label="primary">
                        <Container
                            className="h-full overflow-y-auto"
                            style={isMobile ? containerHeightStyle : undefined}>
                            <div className="flex flex-col col-span-6 mt-6 md:items-center sm:flex-row">
                                <div className="relative flex items-center flex-1 w-full">
                                    <SearchBar
                                        callBack={() => {
                                            setIsOpen(false)
                                        }}
                                    />
                                </div>
                                <div className="mt-2 sm:ml-2 md:mt-0">
                                    <Text>
                                        of{' '}
                                        <Link
                                            to="/zoeken-op-kaart"
                                            onClick={() => setIsOpen(false)}
                                            className="underline text-pzh-green hover:text-pzh-green-dark">
                                            Zoek op de kaart
                                        </Link>
                                    </Text>
                                </div>
                            </div>
                            <div className="col-span-6 mt-6 md:col-span-2">
                                <Heading level="3">Omgevingsvisie</Heading>
                                <ul className="mt-1">
                                    <ListItem
                                        text="Ambities"
                                        setIsOpen={setIsOpen}
                                        to="/ambities"
                                    />

                                    <ListItem
                                        text="Beleidsdoelen"
                                        setIsOpen={setIsOpen}
                                        to="/beleidsdoelen"
                                    />

                                    <ListItem
                                        text="Beleidskeuzes"
                                        setIsOpen={setIsOpen}
                                        to="/beleidskeuzes"
                                    />
                                </ul>
                            </div>
                            <div className="col-span-6 mt-6 md:col-span-2">
                                <Heading level="3">Omgevingsprogramma</Heading>
                                <ul className="mt-1">
                                    <ListItem
                                        text="Thematische programma’s"
                                        setIsOpen={setIsOpen}
                                        to="/omgevingsprogramma/thematische-programmas"
                                    />
                                    <ListItem
                                        text="Gebiedsprogramma’s"
                                        setIsOpen={setIsOpen}
                                        to="/omgevingsprogramma/gebiedsprogrammas"
                                    />
                                    <ListItem
                                        text="Beleidsprestaties"
                                        setIsOpen={setIsOpen}
                                        to="/beleidsprestaties"
                                    />
                                </ul>
                            </div>
                            <div className="col-span-6 mt-6 md:col-span-2">
                                <Heading level="3">
                                    Omgevingsverordening
                                </Heading>
                                <ul className="mt-1">
                                    <ListItem
                                        text="Beleidsregels"
                                        setIsOpen={setIsOpen}
                                        to="/beleidsregels"
                                    />

                                    <ListItem
                                        targetBlank={true}
                                        text="Verordening"
                                        setIsOpen={setIsOpen}
                                        to="https://www.ruimtelijkeplannen.nl/web-roo/transform/NL.IMRO.9928.OVerordening2019-GC09/pt_NL.IMRO.9928.OVerordening2019-GC09.xml#NL.IMRO.PT.sf2d75b3e-7108-49c2-a4bd-cc4b35699474"
                                    />
                                </ul>
                            </div>
                            <div className="col-span-6 mt-6 md:col-span-2">
                                <Heading level="3">Actueel</Heading>
                                <ul className="mt-1">
                                    <ListItem
                                        text="Beleidswijzigingen"
                                        setIsOpen={setIsOpen}
                                        to="/in-bewerking"
                                    />

                                    <ListItem
                                        targetBlank={true}
                                        text="Lange Termijn Agenda"
                                        setIsOpen={setIsOpen}
                                        to="https://lta.zuid-holland.nl/"
                                    />
                                </ul>
                            </div>
                            <div className="col-span-6 mb-10 md:mb-0 md:mt-6 md:col-span-2">
                                <ul
                                    style={
                                        isMobile ? {} : { marginTop: '32px' }
                                    }>
                                    <ListItem
                                        text="Netwerkvisualisatie"
                                        setIsOpen={setIsOpen}
                                        to="/netwerkvisualisatie"
                                        state={{
                                            from:
                                                location.pathname +
                                                location.search,
                                        }}
                                        onKeyDown={(e: any) => {
                                            if (
                                                e.key === 'Tab' &&
                                                !e.shiftKey
                                            ) {
                                                e.preventDefault()
                                                document
                                                    .getElementById(
                                                        'popup-menu-toggle'
                                                    )
                                                    ?.focus()
                                            }
                                        }}
                                    />
                                </ul>
                            </div>
                        </Container>
                    </nav>
                </>
            ) : null}
        </>
    )
}

interface ToggleMenuButtonProps {
    isOpen: boolean
    setIsOpen: (e: boolean) => void
    isMobile: boolean
}

const ToggleMenuButton = ({
    isOpen,
    setIsOpen,
    isMobile,
}: ToggleMenuButtonProps) => (
    <button
        onKeyDown={e => {
            if (e.key === 'Tab' && e.shiftKey && isOpen) {
                e.preventDefault()
                document
                    .getElementById('menu-item-netwerkvisualisatie')
                    ?.focus()
            }
        }}
        id="popup-menu-toggle"
        className={`relative flex items-center justify-center px-2 pb-1 mb-1 pt-2 -mr-6 transition-colors duration-100 ease-in rounded ${
            isOpen
                ? 'text-white hover:bg-gray-100 hover:text-pzh-blue'
                : 'text-pzh-blue hover:text-pzh-blue-dark hover:bg-gray-100'
        } ${isMobile ? 'hidden' : ''}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
            <Xmark aria-hidden="true" size={18} className="mx-1 -mt-1" />
        ) : (
            <Bars aria-hidden="true" size={18} className="mx-1 -mt-1" />
        )}
        <span className="ml-1 font-bold">{isOpen ? 'Sluit menu' : 'Menu'}</span>
    </button>
)

interface ListItemProps {
    text: string
    to: string
    state?: any
    setIsOpen: (e: boolean) => void
    onKeyDown?: React.KeyboardEventHandler<HTMLAnchorElement>
    targetBlank?: boolean
}

const ListItem = ({
    text = '',
    to = '#',
    state,
    setIsOpen,
    onKeyDown,
    targetBlank = false,
}: ListItemProps) => {
    if (targetBlank) {
        return (
            <li className="pt-1 text-pzh-green hover:text-pzh-green-dark">
                <a
                    onKeyDown={onKeyDown}
                    href={to}
                    target={targetBlank ? '_blank' : ''}
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    id={`menu-item-${text.replace(/\s+/g, '-').toLowerCase()}`}>
                    <AngleRight className="mr-2 -mt-0.5 inline-block" />
                    <span className="underline">{text}</span>
                </a>
            </li>
        )
    }

    return (
        <li className="pt-1 text-pzh-green hover:text-pzh-green-dark">
            <Link
                onKeyDown={onKeyDown}
                to={to}
                state={state}
                onClick={() => setIsOpen(false)}
                id={`menu-item-${text.replace(/\s+/g, '-').toLowerCase()}`}>
                <AngleRight className="mr-2 -mt-0.5 inline-block" />
                <span className="underline">{text}</span>
            </Link>
        </li>
    )
}

export default NavigationPopupMenu
