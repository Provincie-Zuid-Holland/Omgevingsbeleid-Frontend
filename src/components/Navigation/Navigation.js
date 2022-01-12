import { faEye, faSignIn } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import isToday from 'date-fns/isToday'
import parseISO from 'date-fns/parseISO'
import { useContext, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useWindowSize } from 'react-use'

import { Container } from '../Container'
import { NetworkGraph } from '../Network'
import GraphContext from './../../App/GraphContext'
import logoSVG from './../../images/PZH_Basislogo.svg'
import logoWhite from './../../images/PZH_Basislogo_white.png'
import BannerEnvironment from './../BannerEnvironment'
import DNABar from './../DNABar'
import NavigationPopupMenu from './../NavigationPopupMenu'

/**
 * Displays a navbar on top of the page which the user can use to login, logout and search within the omgevingsbeleid.
 *
 * @param {boolean} loggedIn - Parameter that is set true if user is logged in.
 * @param {function} setLoginState - Function to edit parent state.
 */
function Navigation({ loggedIn }) {
    const location = useLocation()
    const pathname = location.pathname
    const userIsInMuteerEnvironment = pathname.includes('/muteer/')
    const windowSize = useWindowSize()

    // State for popup menu
    const [isOpen, setIsOpen] = useState(false)

    const { graphIsOpen, setGraphIsOpen } = useContext(GraphContext)

    // If the user removes the banner a variable gets set in Local Storage.
    // This variable is valid for 24 hours and makes sure the banner will not show up again.
    const hideBannerLocalStorage = () => {
        const dateHideBanner = localStorage.getItem('__OB_hide_banner__')
        return isToday(
            typeof dateHideBanner === 'string'
                ? parseISO(dateHideBanner)
                : dateHideBanner
        )
    }

    const showBanner = userIsInMuteerEnvironment && !hideBannerLocalStorage()
    const isMobile = windowSize.width <= 640

    return (
        <div>
            <nav
                className={`fixed top-0 z-20 w-full sm:border-b ${
                    isOpen ? 'bg-pzh-blue' : 'bg-white'
                }`}
                id="navigation-main">
                {/* Banner that displays the current environment */}
                <BannerEnvironment
                    hideBannerLocalStorage={hideBannerLocalStorage}
                    userIsInMuteerEnvironment={userIsInMuteerEnvironment}
                />

                {/* Main container */}
                <Container>
                    {/* <div className={`grid grid-cols-6 gap-12 pzh-container`}> */}
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
                                icon={faEye}
                                className="mr-2">
                                Raadplegen
                            </MenuIcon>
                        ) : null}
                        {loggedIn && !isOpen && !userIsInMuteerEnvironment ? (
                            <MenuIcon
                                setIsOpen={setIsOpen}
                                to="/muteer/dashboard"
                                icon={faEye}
                                className="mr-2">
                                Bewerken
                            </MenuIcon>
                        ) : null}

                        {!loggedIn && !isOpen ? (
                            <MenuIcon
                                setIsOpen={setIsOpen}
                                to="/login"
                                icon={faSignIn}
                                className="mr-2"
                                Label={isMobile ? null : 'Inloggen'}
                            />
                        ) : null}

                        <NetworkGraph
                            graphIsOpen={graphIsOpen}
                            setGraphIsOpen={setGraphIsOpen}
                            showBanner={showBanner}
                        />

                        <NavigationPopupMenu
                            showBanner={showBanner}
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                        />
                    </div>
                    {/* </div> */}
                </Container>
            </nav>
            <DNABar />
        </div>
    )
}

const MenuIcon = ({
    to,
    icon,
    className,
    setIsOpen,
    Label,
    children = null,
}) => {
    return (
        <Link
            to={to}
            className="flex items-center justify-center px-2 py-2 font-bold transition duration-300 ease-in rounded text-pzh-blue hover:text-pzh-blue-dark"
            onClick={() => {
                setIsOpen(false)
            }}>
            <span>
                <FontAwesomeIcon
                    className={`${className} text-sm`}
                    style={{ fontSize: '0.9rem', marginTop: '-0.2rem' }}
                    icon={icon}
                />
                <span className="font-bold">{Label}</span>
            </span>
            <div>{children}</div>
        </Link>
    )
}

function Logo({ isOpen }) {
    return (
        <img
            className="inline-block object-contain"
            title="Provincie Zuid-Holland Logo"
            style={{ height: '96px' }}
            src={isOpen ? logoWhite : logoSVG}
            alt="Provincie Zuid-Holland Logo"
        />
    )
}

export default Navigation
