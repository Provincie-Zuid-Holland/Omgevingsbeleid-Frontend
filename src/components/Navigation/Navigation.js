import React from "react"
import { Link, useLocation } from "react-router-dom"
import isToday from "date-fns/isToday"
import parseISO from "date-fns/parseISO"

import { faEye, faSignInAlt } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import NavigationPopupMenu from "./../NavigationPopupMenu"
import NetworkGraph from "./../NetworkGraph"
import DNABar from "./../DNABar"
import BannerEnvironment from "./../BannerEnvironment"

import GraphContext from "./../../App/GraphContext"

import logoSVG from "./../../images/PZH_Basislogo.svg"
import useBanner from "../../utils/useBanner"
import { useWindowSize } from "../../utils/useWindowSize"

function Navigation({ loggedIn, setLoginState }) {
    const location = useLocation()
    const pathname = location.pathname
    const userIsInMuteerEnvironment = pathname.includes("/muteer/")
    const windowSize = useWindowSize()

    const [DNABarWidth, setDNABarWidth] = React.useState(
        windowSize.width <= 768 ? 40 : 96
    )

    // State for popup menu
    const [isOpen, setIsOpen] = React.useState(false)
    const { graphIsOpen, setGraphIsOpen } = React.useContext(GraphContext)
    const { locationEqualsMutateEnv } = useBanner(graphIsOpen)

    // If the user removes the banner a variable gets set in Local Storage.
    // This variable is valid for 24 hours and makes sure the banner will not show up again.
    const hideBannerLocalStorage = () => {
        const dateHideBanner = localStorage.getItem("__OB_hide_banner__")
        return isToday(
            typeof dateHideBanner === "string"
                ? parseISO(dateHideBanner)
                : dateHideBanner
        )
    }

    function logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem(process.env.REACT_APP_KEY_API_ACCESS_TOKEN)
        localStorage.removeItem(process.env.REACT_APP_KEY_IDENTIFIER)

        setLoginState(false)
    }

    const showBanner = userIsInMuteerEnvironment && !hideBannerLocalStorage()

    /**
     * # Logo
     * -> Het logo heeft een minimale hoogte van 70 pixels.
     * -> Hoogte logo (inclusief bounding box): 96 pixels
     *
     * # Grid
     * -> Het grid heeft zes kollomen
     * ->
     */

    return (
        <div>
            <nav
                className={`fixed top-0 z-20 w-full transition-all duration-200 ease-in bg-white border-b`}
                id="navigation-main"
            >
                {/* Banner that displays the current environment */}
                <BannerEnvironment
                    hideBannerLocalStorage={hideBannerLocalStorage}
                    userIsInMuteerEnvironment={userIsInMuteerEnvironment}
                />

                {/* Main container */}
                <div className="grid grid-cols-6 gap-12 bg-white pzh-container">
                    {/* Logo */}
                    <div className="col-start-1 col-end-3 my-auto">
                        <Link
                            id="href-naar-home"
                            to={loggedIn ? "/muteer/dashboard" : "/"}
                            className="relative z-10"
                            style={{ "margin-left": "-96px" }}
                            onClick={() => {
                                setIsOpen(false)
                            }}
                        >
                            <Logo />
                        </Link>
                    </div>

                    {/* Buttons to toggle popup menu */}
                    <div className="flex items-center justify-end col-span-3 col-end-7 my-auto">
                        {loggedIn && userIsInMuteerEnvironment ? (
                            <MenuIcon
                                setIsOpen={setIsOpen}
                                to="/"
                                icon={faEye}
                                className="mr-3"
                                children="Raadplegen"
                            />
                        ) : null}
                        {loggedIn && !userIsInMuteerEnvironment ? (
                            <MenuIcon
                                setIsOpen={setIsOpen}
                                to="/muteer/dashboard"
                                icon={faEye}
                                className="mr-3"
                                children="Bewerken"
                            />
                        ) : null}

                        {!loggedIn ? (
                            <MenuIcon
                                setIsOpen={setIsOpen}
                                to="/login"
                                icon={faSignInAlt}
                                className="mx-1"
                                Label="Inloggen"
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
                </div>
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
            className="flex items-center justify-center px-2 py-2 text-gray-800 transition duration-300 ease-in rounded hover:text-gray-800"
            onClick={() => {
                setIsOpen(false)
            }}
        >
            <span>
                <FontAwesomeIcon
                    className={`${className} text-sm`}
                    style={{ fontSize: "0.9rem", marginTop: "-0.2rem" }}
                    icon={icon}
                />
                <span className="ml-1 font-bold">{Label}</span>
            </span>
            <div className="text-sm">{children}</div>
        </Link>
    )
}

function Logo() {
    return (
        <img
            className="inline-block"
            title="Provincie Zuid-Holland Logo"
            style={{ height: "96px" }}
            src={logoSVG}
            alt="Provincie Zuid-Holland Logo"
        />
    )
}

export default Navigation
