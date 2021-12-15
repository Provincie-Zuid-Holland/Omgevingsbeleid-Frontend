import React from "react"
import { Link, useHistory } from "react-router-dom"

import {
    faChevronRight,
    faBars,
    faTimes,
} from "@fortawesome/pro-solid-svg-icons"
import { faSearch } from "@fortawesome/pro-light-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import useLockBodyScroll from "./../../utils/useLockBodyScroll"
import { useWindowSize } from "../../utils/useWindowSize"

import Container from "./../Container"
import Heading from "./../Heading"

/**
 * A popup menu that can be used to navigate the application.
 *
 * @param {boolean} showBanner - Parameter that if set to true, will show the banner.
 * @param {boolean} isOpen - Parameter that if set to true, will show the menu.
 * @param {boolean} setIsOpen - Open/close the menu.
 */
const NavigationPopupMenu = ({ showBanner, isOpen, setIsOpen }) => {
    const windowSize = useWindowSize()
    const history = useHistory()
    useLockBodyScroll({ modalOpen: isOpen })

    const [searchQuery, setSearchQuery] = React.useState("")
    const [bannerAdjustedOffsetTop, setBannerAdjustedOffsetTop] =
        React.useState({})
    const [isMobile, setIsMobile] = React.useState(false)
    const [containerHeightStyle, setContainerHeightStyle] =
        React.useState(false)

    React.useEffect(() => {
        if (showBanner) {
            setBannerAdjustedOffsetTop({
                top: "121px",
            })
        } else {
            setBannerAdjustedOffsetTop({
                top: "96px",
            })
        }
    }, [showBanner])

    /** State for responsiveness */
    React.useEffect(() => {
        setIsMobile(windowSize.width <= 640)
        setContainerHeightStyle({
            maxHeight: `calc(100vh - ${
                document.getElementById("navigation-main")?.offsetHeight + "px"
            })`,
        })
    }, [windowSize])

    /** Handle close on Escape key event */
    React.useEffect(() => {
        function closeOnEscape(e) {
            if (e.key === "Escape") {
                setIsOpen(false)
            }
        }
        window.addEventListener("keydown", closeOnEscape)
        return () => window.removeEventListener("keydown", closeOnEscape)
    }, [setIsOpen])

    return (
        <React.Fragment>
            <ToggleMenuButton
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                isMobile={isMobile}
            />
            {isMobile ? (
                <div className="fixed bottom-0 right-0 z-50">
                    <div
                        className="flex items-center justify-center p-8 text-white cursor-pointer bg-pzh-blue-dark"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <FontAwesomeIcon
                            className="absolute text-lg"
                            style={{ marginTop: "-0.2rem" }}
                            icon={isOpen ? faTimes : faBars}
                        />
                    </div>
                </div>
            ) : null}
            {isOpen ? (
                <React.Fragment>
                    <div
                        style={bannerAdjustedOffsetTop}
                        className="fixed top-0 left-0 z-0 block w-screen h-screen bg-gray-900 opacity-40"
                    ></div>
                    <div
                        id="popup-menu"
                        className="fixed top-0 left-0 z-10 w-full pb-8 bg-white"
                        style={bannerAdjustedOffsetTop}
                    >
                        <Container
                            className="h-full overflow-y-auto"
                            style={isMobile ? containerHeightStyle : null}
                        >
                            <div className="flex flex-col items-center col-span-6 mt-6 sm:flex-row">
                                <div className="relative flex items-center w-full">
                                    <FontAwesomeIcon
                                        className="absolute left-0 ml-2 text-lg text-pzh-blue-dark"
                                        icon={faSearch}
                                    />
                                    <input
                                        className={`pl-10 placeholder-gray-500 pr-6 rounded w-full appearance-none px-3 pb-1 border hover:border-opacity-50 border-pzh-blue border-opacity-30 transition-colors ease-in duration-100`}
                                        name="searchInput"
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value)
                                        }}
                                        autoComplete="off"
                                        id="navigation-popup-menu-search"
                                        type="text"
                                        value={searchQuery}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                // Enter key
                                                if (searchQuery.length === 0)
                                                    return
                                                history.push(
                                                    `/zoekresultaten?query=${searchQuery}`
                                                )
                                                setIsOpen(false)
                                            }
                                        }}
                                        placeholder={
                                            isMobile
                                                ? "Zoeken"
                                                : "Zoek binnen het beleid van de provincie Zuid-Holland"
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-span-6 mt-6 md:col-span-2">
                                <Heading level="3">Omgevingsvisie</Heading>
                                <ul className="mt-1">
                                    <ListItem
                                        text="Ambities"
                                        setIsOpen={setIsOpen}
                                        to="/overzicht/ambities"
                                    />

                                    <ListItem
                                        text="Beleidsdoelen"
                                        setIsOpen={setIsOpen}
                                        to="/overzicht/beleidsdoelen"
                                    />

                                    <ListItem
                                        text="Beleidskeuzes"
                                        setIsOpen={setIsOpen}
                                        to="/overzicht/beleidskeuzes"
                                    />
                                </ul>
                            </div>
                            <div className="col-span-6 mt-6 md:col-span-2">
                                <Heading level="3">Omgevingsprogramma</Heading>
                                <ul className="mt-1">
                                    <ListItem
                                        text="Maatregelen (Programma's)"
                                        setIsOpen={setIsOpen}
                                        to="/overzicht/maatregelen"
                                    />

                                    <ListItem
                                        text="Beleidsprestaties"
                                        setIsOpen={setIsOpen}
                                        to="/overzicht/beleidsprestaties"
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
                                        to="/overzicht/beleidsregels"
                                    />

                                    <ListItem
                                        text="Verordening"
                                        setIsOpen={setIsOpen}
                                        to={"/detail/verordening"}
                                    />
                                </ul>
                            </div>
                            <div className="col-span-6 mt-6 md:col-span-2">
                                <Heading level="3">Actueel</Heading>
                                <ul className="mt-1">
                                    <ListItem
                                        text="Terinzageleggeningen"
                                        setIsOpen={setIsOpen}
                                        to="/terinzageleggingen"
                                    />

                                    <ListItem
                                        text="Lange Termijn Agenda"
                                        setIsOpen={setIsOpen}
                                        to="#"
                                    />
                                </ul>
                            </div>
                            <div className="col-span-6 mb-10 md:mb-0 md:mt-6 md:col-span-2">
                                <ul
                                    style={
                                        isMobile ? null : { marginTop: "32px" }
                                    }
                                >
                                    <ListItem
                                        text="Netwerkvisualisatie"
                                        setIsOpen={setIsOpen}
                                        to="/netwerkvisualisatie"
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Tab" &&
                                                !e.shiftKey
                                            ) {
                                                e.preventDefault()
                                                document
                                                    .getElementById(
                                                        "popup-menu-toggle"
                                                    )
                                                    ?.focus()
                                            }
                                        }}
                                    />
                                </ul>
                            </div>
                        </Container>
                    </div>
                </React.Fragment>
            ) : null}
        </React.Fragment>
    )
}

const ToggleMenuButton = ({ isOpen, setIsOpen, isMobile }) => {
    return (
        <button
            onKeyDown={(e) => {
                if (e.key === "Tab" && e.shiftKey) {
                    console.log("EXEC")
                    e.preventDefault()
                    document
                        .getElementById("menu-item-netwerkvisualisatie")
                        ?.focus()
                }
            }}
            id="popup-menu-toggle"
            className={`relative flex items-center justify-center p-2 -mr-6 transition-colors duration-100 ease-in rounded ${
                isOpen
                    ? "text-white hover:bg-gray-100 hover:text-gray-800"
                    : "text-gray-800 hover:text-gray-900 hover:bg-gray-100"
            } ${isMobile ? "hidden" : ""}`}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
        >
            <FontAwesomeIcon
                className="mx-1"
                style={{ fontSize: "0.9rem", marginTop: "-0.2rem" }}
                icon={isOpen ? faTimes : faBars}
            />
            <span className="ml-1 font-bold">
                {isOpen ? "Sluit menu" : "Menu"}
            </span>
        </button>
    )
}

const ListItem = ({ text = "", to = "#", setIsOpen, onKeyDown = null }) => {
    return (
        <li className="pt-1 text-pzh-green">
            <Link
                onKeyDown={onKeyDown}
                to={to}
                onClick={() => setIsOpen(false)}
                id={`menu-item-${text.replace(/\s+/g, "-").toLowerCase()}`}
            >
                <FontAwesomeIcon className="mr-2" icon={faChevronRight} />
                <span className="underline">{text}</span>
            </Link>
        </li>
    )
}

export default NavigationPopupMenu
