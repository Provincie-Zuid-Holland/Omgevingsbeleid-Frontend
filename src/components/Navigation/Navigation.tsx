import { ArrowRightFromBracket, Eye } from '@pzh-ui/icons'
import classNames from 'classnames'
import { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWindowSize } from 'react-use'

import useAuth from '@/hooks/useAuth'
import usePage from '@/hooks/usePage'
import logoSVG from '@/images/PZH_Basislogo.svg'
import logoWhite from '@/images/PZH_Basislogo_white.svg'
import hideBannerLocalStorage from '@/utils/hideBannerLocalStorage'

import BannerEnvironment from '../BannerEnvironment'
import { Container } from '../Container'
import NavigationPopupMenu from '../NavigationPopupMenu'
import UserMenu from '../UserMenu'

/**
 * Displays a navbar on top of the page which the user can use to login, logout and search within the omgevingsbeleid.
 */

const Navigation = () => {
    const { user } = useAuth()
    const userIsInMuteerEnvironment = usePage('/muteer')
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
                    sticky: !isAdvancedSearchPage,
                    relative: isAdvancedSearchPage,
                    'bg-pzh-blue': isOpen || userIsInMuteerEnvironment,
                    'bg-white': !isOpen && !userIsInMuteerEnvironment,
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
                        to={!!user ? '/muteer' : '/'}
                        className="relative"
                        style={
                            isMobile
                                ? { marginLeft: '-2rem' }
                                : { marginLeft: '-96px' }
                        }
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
                </div>

                {/* Buttons to toggle popup menu */}
                <div className="flex items-center justify-end col-span-2 my-auto sm:col-span-3">
                    {!!user && !isOpen && userIsInMuteerEnvironment ? (
                        <MenuIcon
                            setIsOpen={setIsOpen}
                            to="/"
                            icon={<Eye size={16} className="mr-2 -mt-1" />}
                            color="white">
                            Raadpleegomgeving
                        </MenuIcon>
                    ) : null}
                    {!!user && !isOpen && !userIsInMuteerEnvironment ? (
                        <MenuIcon
                            setIsOpen={setIsOpen}
                            to="/muteer"
                            icon={<Eye size={16} className="mr-2 -mt-1" />}
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
                                    className="mr-2 -mt-0.5 inline-block"
                                />
                            }
                            label={isMobile ? null : 'Inloggen'}
                            color="blue"
                        />
                    ) : null}

                    {!userIsInMuteerEnvironment && (
                        <NavigationPopupMenu
                            showBanner={showBanner}
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                        />
                    )}

                    {!!user && userIsInMuteerEnvironment && <UserMenu />}
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
    color: 'white' | 'blue'
}

const MenuIcon: FC<MenuIconProps> = ({
    to,
    icon,
    setIsOpen,
    label,
    children = null,
    color,
}) => (
    <Link
        to={to}
        className={classNames(
            'flex items-center justify-center px-2 py-2 font-bold transition duration-300 ease-in rounded',
            {
                'text-pzh-blue hover:text-pzh-blue-dark': color === 'blue',
                'text-pzh-white': color === 'white',
            }
        )}
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
    type: 'color' | 'white'
}

const Logo = ({ type }: LogoProps) => (
    <img
        className="inline-block object-contain"
        title="Provincie Zuid-Holland Logo"
        style={{ height: '96px' }}
        src={type === 'white' ? logoWhite : logoSVG}
        alt="Provincie Zuid-Holland Logo"
    />
)

export default Navigation
