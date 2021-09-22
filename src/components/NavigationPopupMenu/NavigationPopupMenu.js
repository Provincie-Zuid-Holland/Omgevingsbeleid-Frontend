import React from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { Transition } from "@headlessui/react"

import {
    faChevronRight,
    faBars,
    faTimes,
} from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import axios from "./../../API/axios"

import useLockBodyScroll from "./../../utils/useLockBodyScroll"

import Container from "./../Container"
import Heading from "./../Heading"

/**
 * Component that renders the NavigationPopupMenu component.
 *
 * @param {boolean} showBanner - Parameter that if set to true, will show the banner.
 * @param {boolean} isOpen - Parameter that is used to show certain elements within the rendered component, if the parameter is set true.
 * @param {boolean} setIsOpen - Parameter that is used for an onclick function to set the isOpen parameter to true or false, when the parameter itsef is set to true or false.
 */
const NavigationPopupMenu = ({ showBanner, isOpen, setIsOpen }) => {
    const [searchQuery, setSearchQuery] = React.useState("")

    // If the modal is open we lock the HTML body scroll
    useLockBodyScroll({ modalOpen: isOpen })

    // Eventlistener for closing the modal with the Escape key
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
            <button
                id="popup-menu-toggle"
                className={`relative flex items-center justify-center px-2 pt-2 pb-1 -mr-6 transition-colors duration-100 ease-in rounded ${
                    isOpen
                        ? "text-white hover:bg-gray-100 hover:text-gray-800"
                        : "text-gray-800 hover:text-gray-900 hover:bg-gray-100"
                }`}
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
            >
                <FontAwesomeIcon
                    className="mx-1"
                    style={{ fontSize: "0.9rem", marginTop: "-0.2rem" }}
                    icon={isOpen ? faTimes : faBars}
                />
                <span className="ml-1 font-bold">Menu</span>
            </button>
            <Transition
                show={isOpen}
                enter=""
                enterFrom=""
                enterTo=""
                leave=""
                leaveFrom=""
                leaveTo=""
            >
                <div
                    id="popup-menu"
                    className="fixed top-0 left-0 w-full bg-white"
                    style={
                        showBanner
                            ? {
                                  height: "calc(100vh - 97px)",
                                  top: "121px",
                              }
                            : {
                                  height: "calc(100vh - 97px)",
                                  top: "97px",
                              }
                    }
                >
                    <Container>
                        <div className="flex items-center col-span-6 mt-6">
                            <input
                                className={`block w-5/6 pr-10 placeholder-gray-500 rounded appearance-none px-3 py-1 border hover:border-opacity-50 border-pzh-blue border-opacity-30 transition-colors ease-in duration-100`}
                                name="searchInput"
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                }}
                                autoComplete="off"
                                id="navigation-popup-menu-search"
                                type="text"
                                value={searchQuery}
                                placeholder="Zoek binnen het beleid van de provincie Zuid-Holland"
                            />
                            <div className="flex w-1/6 pl-2">
                                <span>of</span>
                                <span className="ml-2 underline text-pzh-green">
                                    Zoek op de kaart
                                </span>
                            </div>
                        </div>
                        <div className="col-span-2 mt-6">
                            <Heading level="3">Omgevingsvisie</Heading>
                            <ul className="mt-1">
                                <ListItem
                                    setIsOpen={setIsOpen}
                                    to="/overzicht/ambities"
                                >
                                    Ambities
                                </ListItem>
                                <ListItem
                                    setIsOpen={setIsOpen}
                                    to="/overzicht/beleidsdoelen"
                                >
                                    Beleidsdoelen
                                </ListItem>
                                <ListItem
                                    setIsOpen={setIsOpen}
                                    to="/overzicht/beleidskeuzes"
                                >
                                    Beleidskeuzes
                                </ListItem>
                            </ul>
                        </div>
                        <div className="col-span-2 mt-6">
                            <Heading level="3">Omgevingsprogramma</Heading>
                            <ul className="mt-1">
                                <ListItem
                                    setIsOpen={setIsOpen}
                                    to="/overzicht/maatregelen"
                                >
                                    Maatregelen (Programma's)
                                </ListItem>
                                <ListItem
                                    setIsOpen={setIsOpen}
                                    to="/overzicht/beleidsprestaties"
                                >
                                    Beleidsprestaties
                                </ListItem>
                            </ul>
                        </div>
                        <div className="col-span-2 mt-6">
                            <Heading level="3">Omgevingsverordening</Heading>
                            <ul className="mt-1">
                                <ListItem
                                    setIsOpen={setIsOpen}
                                    to="/overzicht/beleidsregels"
                                >
                                    Beleidsregels
                                </ListItem>
                                <ListItem
                                    setIsOpen={setIsOpen}
                                    to="/overzicht/beleidsdoelen"
                                >
                                    Verordening
                                </ListItem>
                            </ul>
                        </div>
                        <div className="col-span-2 mt-6">
                            <Heading level="3">Actueel</Heading>
                            <ul className="mt-1">
                                <ListItem setIsOpen={setIsOpen} to="#">
                                    Terinzageleggeningen
                                </ListItem>
                                <ListItem setIsOpen={setIsOpen} to="#">
                                    Lange Termijn Agenda
                                </ListItem>
                            </ul>
                        </div>
                        <div className="col-span-2 mt-6">
                            <ul style={{ marginTop: "32px" }}>
                                <ListItem
                                    setIsOpen={setIsOpen}
                                    to="/overzicht/ambities"
                                >
                                    Netwerkvisualisatie
                                </ListItem>
                            </ul>
                        </div>
                    </Container>
                </div>
            </Transition>
        </React.Fragment>
    )
}

const ListItem = ({ children, to = "#", setIsOpen }) => {
    return (
        <li className="pt-1 text-pzh-green">
            <Link to={to} onClick={() => setIsOpen(false)}>
                <FontAwesomeIcon className="mr-2" icon={faChevronRight} />
                <span className="underline">{children}</span>
            </Link>
        </li>
    )
}

export default NavigationPopupMenu
