import { Heading, Text } from '@pzh-ui/components'
import { AngleRight, Bars, Xmark } from '@pzh-ui/icons'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useKey, useWindowSize } from 'react-use'

import useBreakpoint from '@/hooks/useBreakpoint'

import { Container } from '../Container'
import SearchBar from '../SearchBar'

/**
 * A popup menu that can be used to navigate the application.
 *
 * @param {boolean} isOpen - Parameter that if set to true, will show the menu.
 * @param {boolean} setIsOpen - Open/close the menu.
 */

interface NavigationPopupMenuProps {
    isOpen: boolean
    setIsOpen: (e: boolean) => void
}

const NavigationPopupMenu = ({
    isOpen,
    setIsOpen,
}: NavigationPopupMenuProps) => {
    const location = useLocation()
    const windowSize = useWindowSize()

    const { isMobile } = useBreakpoint()

    const [containerHeightStyle, setContainerHeightStyle] = useState<
        { maxHeight: string } | undefined
    >(undefined)

    /** State for responsiveness */
    useEffect(() => {
        setContainerHeightStyle({
            maxHeight: `calc(100vh - ${
                document.getElementById('top-navigation')?.offsetHeight + 'px'
            })`,
        })
    }, [windowSize])

    /** Handle close on Escape key event */
    useKey('Escape', () => setIsOpen(false))

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
                        className="flex cursor-pointer items-center justify-center bg-pzh-blue-dark p-8 text-white"
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
                    <div className="pointer-events-none fixed left-0 top-[96px] z-0 block h-screen w-screen bg-gray-900 opacity-40" />
                    <nav
                        id="popup-menu"
                        className="fixed left-0 top-[96px] z-10 w-full bg-white pb-8"
                        aria-label="primary">
                        <Container
                            className="h-full overflow-y-auto"
                            style={isMobile ? containerHeightStyle : undefined}>
                            <div className="col-span-6 mt-6 flex flex-col sm:flex-row md:items-center">
                                <div className="relative flex w-full flex-1 items-center">
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
                                            className="text-pzh-green underline hover:text-pzh-green-dark">
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
                                        to="/omgevingsvisie/ambities"
                                    />

                                    <ListItem
                                        text="Beleidsdoelen"
                                        setIsOpen={setIsOpen}
                                        to="/omgevingsvisie/beleidsdoelen"
                                    />

                                    <ListItem
                                        text="Beleidskeuzes"
                                        setIsOpen={setIsOpen}
                                        to="/omgevingsvisie/beleidskeuzes"
                                    />
                                </ul>
                            </div>
                            <div className="col-span-6 mt-6 md:col-span-2">
                                <Link
                                    to="/omgevingsprogramma"
                                    onClick={() => setIsOpen(false)}>
                                    <Heading level="3">
                                        Omgevingsprogramma
                                    </Heading>
                                </Link>
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
                                        text="Maatregelen"
                                        setIsOpen={setIsOpen}
                                        to="/omgevingsprogramma/maatregelen"
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
                                        to="/omgevingsverordening/beleidsregels"
                                    />

                                    <ListItem
                                        text="Verordening"
                                        setIsOpen={setIsOpen}
                                        targetBlank
                                        to="https://www.ruimtelijkeplannen.nl/web-roo/transform/NL.IMRO.9928.OVerordening2019-GC10/pt_NL.IMRO.9928.OVerordening2019-GC10.xml"
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
                                        targetBlank
                                        text="Lange Termijn Agenda"
                                        setIsOpen={setIsOpen}
                                        to="https://lta.zuid-holland.nl/"
                                    />
                                </ul>
                            </div>
                            <div className="col-span-6 mb-10 md:col-span-2 md:mb-0 md:mt-6">
                                <ul
                                    className={classNames({
                                        'mt-[32px]': !isMobile,
                                    })}>
                                    <ListItem
                                        text="Beleidsnetwerk"
                                        setIsOpen={setIsOpen}
                                        to="/beleidsnetwerk"
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
                document.getElementById('menu-item-beleidsnetwerk')?.focus()
            }
        }}
        id="popup-menu-toggle"
        className={`relative -mr-6 mb-1 flex items-center justify-center rounded px-2 pb-1 pt-2 transition-colors duration-100 ease-in ${
            isOpen
                ? 'text-white hover:bg-gray-100 hover:text-pzh-blue'
                : 'text-pzh-blue hover:bg-gray-100 hover:text-pzh-blue-dark'
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
                    <AngleRight className="-mt-0.5 mr-2 inline-block" />
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
                <AngleRight className="-mt-0.5 mr-2 inline-block" />
                <span className="underline">{text}</span>
            </Link>
        </li>
    )
}

export default NavigationPopupMenu
