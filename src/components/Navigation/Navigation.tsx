import { Badge } from '@pzh-ui/components'
import { ArrowRightFromBracket, Eye } from '@pzh-ui/icons'
import { useClickOutside } from '@react-hookz/web'
import classNames from 'clsx'
import { ReactNode, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { environment } from '@/api/instance'
import useAuth from '@/hooks/useAuth'
import useBreakpoint from '@/hooks/useBreakpoint'
import usePage from '@/hooks/usePage'
import logoSVG from '@/images/PZH_Basislogo.svg'
import logoWhite from '@/images/PZH_Basislogo_white.svg'
import getEnvironmentText from '@/utils/getEnvironmentName'

import { Container } from '../Container'
import NavigationPopupMenu from '../NavigationPopupMenu'
import UserMenu from '../Users/UserMenu'

/**
 * Displays a navbar on top of the page which the user can use to login, logout and search within the omgevingsbeleid.
 */

const Navigation = () => {
    const { user } = useAuth()
    const userIsInMuteerEnvironment = usePage('/muteer')
    const isAdvancedSearchPage = usePage('/zoeken-op-kaart')

    const headerRef = useRef<HTMLElement>(null)

    // State for popup menu
    const [isOpen, setIsOpen] = useState(false)
    const { isDesktop, isMobile } = useBreakpoint()

    /** Handle close on click outside */
    useClickOutside(headerRef, () => {
        setIsOpen(false)
    })

    return (
        <header
            className={classNames(
                'border-b-pzh-gray-200 top-0 z-[99] h-24 w-full border-b',
                {
                    sticky: !isAdvancedSearchPage,
                    relative: isAdvancedSearchPage,
                    'bg-pzh-blue-500': isOpen || userIsInMuteerEnvironment,
                    'bg-pzh-white': !isOpen && !userIsInMuteerEnvironment,
                }
            )}
            id="top-navigation">
            <Container reference={headerRef}>
                {/* Logo */}
                <div className="col-span-4 my-auto sm:col-span-3">
                    <Link
                        id="href-naar-home"
                        to={
                            !!user && userIsInMuteerEnvironment
                                ? '/muteer'
                                : '/'
                        }
                        className={classNames('relative', {
                            '-ml-8': !isDesktop,
                            '-ml-24': isDesktop,
                        })}
                        onClick={() => {
                            setIsOpen(false)
                        }}>
                        <Logo
                            type={
                                isOpen || userIsInMuteerEnvironment
                                    ? 'white'
                                    : 'color'
                            }
                        />
                    </Link>

                    {userIsInMuteerEnvironment && (
                        <Badge
                            text={getEnvironmentText(environment)}
                            variant="white"
                        />
                    )}
                </div>

                {/* Buttons to toggle popup menu */}
                <div className="col-span-2 my-auto flex items-center justify-end gap-x-4 sm:col-span-3">
                    {!!user && !isOpen && userIsInMuteerEnvironment ? (
                        <MenuIcon
                            setIsOpen={setIsOpen}
                            to="/"
                            icon={<Eye size={16} className="mr-2" />}
                            color="white">
                            Raadpleegomgeving
                        </MenuIcon>
                    ) : null}
                    {!!user && !isOpen && !userIsInMuteerEnvironment ? (
                        <MenuIcon
                            setIsOpen={setIsOpen}
                            to="/muteer"
                            icon={<Eye size={16} className="mr-2" />}
                            color="blue">
                            Bewerken
                        </MenuIcon>
                    ) : null}

                    {!!!user && !isOpen ? (
                        <MenuIcon
                            setIsOpen={setIsOpen}
                            to="/login"
                            icon={
                                <ArrowRightFromBracket
                                    size={16}
                                    className="mr-2 inline-block"
                                    aria-hidden="true"
                                />
                            }
                            label="Inloggen"
                            className="sr-only md:not-sr-only"
                            color="blue"
                        />
                    ) : null}

                    {!userIsInMuteerEnvironment && (
                        <NavigationPopupMenu
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                        />
                    )}

                    {!!user && userIsInMuteerEnvironment && <UserMenu />}
                </div>
            </Container>
            {isOpen && (
                <div className="bg-pzh-gray-800/30 fixed top-24 left-0 z-0 block h-screen w-screen" />
            )}
        </header>
    )
}

interface MenuIconProps {
    children?: ReactNode
    to: string
    icon: JSX.Element
    className?: string
    setIsOpen: (e: boolean) => void
    label?: string | null
    color: 'white' | 'blue'
}

const MenuIcon = ({
    to,
    icon,
    setIsOpen,
    label,
    children = null,
    color,
    className,
}: MenuIconProps) => (
    <Link
        to={to}
        className={classNames(
            'flex items-center justify-center rounded font-bold transition duration-300 ease-in',
            {
                'text-pzh-blue-500 hover:text-pzh-blue-900': color === 'blue',
                'text-pzh-white': color === 'white',
            }
        )}
        onClick={() => {
            setIsOpen(false)
        }}>
        <span>
            {icon}
            <span className={classNames('font-bold', className)}>{label}</span>
        </span>
        <div>{children}</div>
    </Link>
)

interface LogoProps {
    type: 'color' | 'white'
}

const Logo = ({ type }: LogoProps) => (
    <img
        className="inline-block h-24 object-contain"
        title="Provincie Zuid-Holland, naar de homepage"
        src={type === 'white' ? logoWhite : logoSVG}
        alt="Provincie Zuid-Holland, naar de homepage"
    />
)

export default Navigation
