import { Heading, Text } from '@pzh-ui/components'
import { AngleRight, Bars, Xmark } from '@pzh-ui/icons'
import { useKeyboardEvent, useWindowSize } from '@react-hookz/web'
import classNames from 'clsx'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { menuGroups } from '@/constants/menu'
import useBreakpoint from '@/hooks/useBreakpoint'

import { Container } from '../Container'
import SearchBar from '../SearchBar'

/**
 * A popup menu that can be used to navigate the application.
 */

interface NavigationPopupMenuProps {
    /* Parameter that if set to true, will show the menu. */
    isOpen: boolean
    /* Open/close the menu. */
    setIsOpen: (e: boolean) => void
}

const NavigationPopupMenu = ({
    isOpen,
    setIsOpen,
}: NavigationPopupMenuProps) => {
    const windowSize = useWindowSize()

    const { isMobile } = useBreakpoint()

    /** State for responsiveness */
    const [containerHeightStyle, setContainerHeightStyle] = useState<
        { maxHeight: string } | undefined
    >(undefined)

    useEffect(() => {
        setContainerHeightStyle({
            maxHeight: `calc(100vh - ${
                document.getElementById('top-navigation')?.offsetHeight + 'px'
            })`,
        })
    }, [windowSize])

    /** Handle close on Escape key event */
    useKeyboardEvent(true, ev => {
        ev.key === 'Escape' && setIsOpen(false)
    })

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
                        className="flex cursor-pointer items-center justify-center bg-pzh-blue-900 p-8 text-white"
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
                    <nav
                        id="popup-menu"
                        className="absolute left-0 top-24 z-10 w-full bg-white pb-8"
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
                                            className="text-pzh-green-500 underline hover:text-pzh-green-900">
                                            Zoek op de kaart
                                        </Link>
                                    </Text>
                                </div>
                            </div>
                            {menuGroups.map(group => (
                                <div
                                    key={group.title}
                                    className="col-span-6 mt-6 md:col-span-2">
                                    {group.to ? (
                                        <Link
                                            to={group.to}
                                            onClick={() => setIsOpen(false)}
                                            className="group flex items-center gap-1 hover:text-pzh-green-900">
                                            <Heading
                                                level="3"
                                                size="m"
                                                className="group-hover:text-pzh-green-900 group-hover:underline">
                                                {group.title}
                                            </Heading>
                                            <AngleRight
                                                size={20}
                                                className="-mt-0.5"
                                            />
                                        </Link>
                                    ) : (
                                        <Heading level="3" size="m">
                                            {group.title}
                                        </Heading>
                                    )}
                                    <ul className="mt-1">
                                        {group.items.map(item => (
                                            <ListItem
                                                key={item.text}
                                                text={item.text}
                                                setIsOpen={setIsOpen}
                                                to={item.to}
                                                {...('targetBlank' in item && {
                                                    targetBlank:
                                                        item.targetBlank,
                                                })}
                                            />
                                        ))}
                                    </ul>
                                </div>
                            ))}
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
    isMobile?: boolean
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
        className={classNames(
            'relative mb-1 flex items-center justify-center rounded px-2 pb-1 pt-2 transition-colors duration-100 ease-in lg:-mr-6',
            {
                hidden: isMobile,
                'text-white hover:bg-pzh-gray-100 hover:text-pzh-blue-500':
                    isOpen,
                'text-pzh-blue-500 hover:bg-pzh-gray-100 hover:text-pzh-blue-900':
                    !isOpen,
            }
        )}
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
            <li className="pt-1 text-pzh-green-500 hover:text-pzh-green-900">
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
        <li className="pt-1 text-pzh-green-500 hover:text-pzh-green-900">
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
