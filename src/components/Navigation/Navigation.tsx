import { ArrowRightFromBracket, Eye } from '@pzh-ui/icons'
import classNames from 'classnames'
import { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWindowSize } from 'react-use'

import usePage from '@/hooks/usePage'
import logoSVG from '@/images/PZH_Basislogo.svg'
import logoWhite from '@/images/PZH_Basislogo_white.png'
import hideBannerLocalStorage from '@/utils/hideBannerLocalStorage'

import BannerEnvironment from '../BannerEnvironment'
import { Container } from '../Container'
import NavigationPopupMenu from '../NavigationPopupMenu'

/**
 * Displays a navbar on top of the page which the user can use to login, logout and search within the omgevingsbeleid.
 *
 * @param {boolean} loggedIn - Parameter that is set true if user is logged in.
 */

interface NavigationProps {
    loggedIn: boolean
}

const Navigation = ({ loggedIn }: NavigationProps) => {
    const userIsInMuteerEnvironment = usePage('/muteer/')
    const isAdvancedSearchPage = usePage('/zoeken-op-kaart')
    const windowSize = useWindowSize()
    const [showBanner, setShowBanner] = useState(
        userIsInMuteerEnvironment && !hideBannerLocalStorage()
    )

    // State for popup menu
    const [isOpen, setIsOpen] = useState(false)
    const isMobile = windowSize.width <= 640

    return (
        <header
            className={classNames(
                'top-0 z-20 w-full border-b border-b-pzh-cool-gray-light/30',
                {
                    fixed: !isAdvancedSearchPage,
                    relative: isAdvancedSearchPage,
                    'bg-pzh-blue': isOpen,
                    'bg-white': !isOpen,
                }
            )}
            id="top-navigation">
            <BannerEnvironment
                hideBannerLocalStorage={hideBannerLocalStorage}
                userIsInMuteerEnvironment={userIsInMuteerEnvironment}
                showBanner={showBanner}
                setShowBanner={setShowBanner}
            />

            <Container>
                {/* Logo */}
                <div className="col-span-4 my-auto sm:col-span-3">
                    <Link
                        id="href-naar-home"
                        to={loggedIn ? '/muteer/dashboard' : '/'}
                        className="relative z-10"
                        style={
                            isMobile
                                ? { marginLeft: '-2rem' }
                                : { marginLeft: '-96px' }
                        }
                        onClick={() => {
                            setIsOpen(false)
                        }}>
                        <Logo isOpen={isOpen} />
                    </Link>
                </div>

                {/* Buttons to toggle popup menu */}
                <div className="flex items-center justify-end col-span-2 my-auto sm:col-span-3">
                    {loggedIn && !isOpen && userIsInMuteerEnvironment ? (
                        <MenuIcon
                            setIsOpen={setIsOpen}
                            to="/"
                            icon={<Eye size={16} className="mr-2 -mt-1" />}>
                            Raadplegen
                        </MenuIcon>
                    ) : null}
                    {loggedIn && !isOpen && !userIsInMuteerEnvironment ? (
                        <MenuIcon
                            setIsOpen={setIsOpen}
                            to="/muteer/dashboard"
                            icon={
                                <Eye
                                    aria-hidden="true"
                                    size={16}
                                    className="mr-2 -mt-1"
                                />
                            }>
                            Bewerken
                        </MenuIcon>
                    ) : null}

                    {!loggedIn && !isOpen ? (
                        <MenuIcon
                            setIsOpen={setIsOpen}
                            to="/login"
                            icon={
                                <ArrowRightFromBracket
                                    size={16}
                                    className="mr-2 -mt-0.5 inline-block"
                                    aria-hidden="true"
                                />
                            }
                            label={isMobile ? null : 'Inloggen'}
                        />
                    ) : null}

                    <NavigationPopupMenu
                        showBanner={showBanner}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    />
                </div>
            </Container>
        </header>
    )
}

interface MenuIconProps {
    to: string
    icon: JSX.Element
    className?: string
    setIsOpen: (e: boolean) => void
    label?: string | null
}

const MenuIcon: FC<MenuIconProps> = ({
    to,
    icon,
    setIsOpen,
    label,
    children = null,
}) => (
    <Link
        to={to}
        className="flex items-center justify-center px-2 py-2 font-bold transition duration-300 ease-in rounded text-pzh-blue hover:text-pzh-blue-dark"
        onClick={() => {
            setIsOpen(false)
        }}>
        <span>
            {icon}
            <span className="font-bold">{label}</span>
        </span>
        <div>{children}</div>
    </Link>
)

interface LogoProps {
    isOpen: boolean
}

const Logo = ({ isOpen }: LogoProps) => (
    <img
        className="inline-block object-contain"
        title="Provincie Zuid-Holland Logo"
        style={{ height: '96px' }}
        src={isOpen ? logoWhite : logoSVG}
        alt="Provincie Zuid-Holland Logo"
    />
)

export default Navigation
