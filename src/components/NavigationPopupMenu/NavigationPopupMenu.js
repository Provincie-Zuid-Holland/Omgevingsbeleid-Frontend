import React from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { Transition } from "@headlessui/react"

import { faSearch, faBars, faTimes } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// Import API and Env variable used for the banner
import axios from "./../../API/axios"

// Import dimension variables
import allDimensies from "./../../constants/dimensies"

// Import useLockBodyScroll to stop html body scroll when the modal is open
import useLockBodyScroll from "./../../utils/useLockBodyScroll"

import LoaderSpinner from "./../LoaderSpinner"

/**
 * Displays the navigation menu in a popup menu.
 *
 * @param {boolean} showBanner - Used to display the banner within the component.
 * @param {boolean} isOpen - Used to display the modal component.
 * @param {function} setIsOpen - Function to edit parent state.
 */
const NavigationPopupMenu = ({ showBanner, isOpen, setIsOpen }) => {
    // Popup state
    const [activeTab, setActiveTab] = React.useState("Ambities")
    const [filterQuery, setFilterQuery] = React.useState("")

    // Loading state
    const [isLoading, setIsLoading] = React.useState(true)
    const [verordeningIsLoading, setVerordeningIsLoading] = React.useState(true)

    // Dimension state
    const [ambities, setAmbities] = React.useState(null)
    const [beleidsdoelen, setBeleidsdoelen] = React.useState(null)
    const [beleidsprestaties, setBeleidsprestaties] = React.useState(null)
    const [beleidskeuzes, setBeleidskeuzes] = React.useState(null)
    const [maatregelen, setMaatregelen] = React.useState(null)
    const [beleidsregels, setBeleidsregels] = React.useState(null)
    const [verordeningStructuur, setVerordeningStructuur] = React.useState(null)

    // On mount get dimension data from API
    React.useEffect(() => {
        Promise.all([
            axios
                .get(`${allDimensies.AMBITIES.API_ENDPOINT_VIGEREND}`)
                .then((res) => setAmbities(res.data))
                .catch((err) => console.log(err)),
            axios
                .get(`${allDimensies.BELEIDSDOELEN.API_ENDPOINT_VIGEREND}`)
                .then((res) => setBeleidsdoelen(res.data))
                .catch((err) => console.log(err)),
            axios
                .get(`${allDimensies.BELEIDSPRESTATIES.API_ENDPOINT_VIGEREND}`)
                .then((res) => setBeleidsprestaties(res.data))
                .catch((err) => console.log(err)),
            axios
                .get(`${allDimensies.BELEIDSKEUZES.API_ENDPOINT_VIGEREND}`)
                .then((res) => setBeleidskeuzes(res.data))
                .catch((err) => console.log(err)),
            axios
                .get(`${allDimensies.BELEIDSREGELS.API_ENDPOINT_VIGEREND}`)
                .then((res) => setBeleidsregels(res.data))
                .catch((err) => console.log(err)),
            axios
                .get(`${allDimensies.MAATREGELEN.API_ENDPOINT_VIGEREND}`)
                .then((res) => setMaatregelen(res.data))
                .catch((err) => console.log(err)),
            axios
                .get(`${allDimensies.VERORDENINGSTRUCTUUR.API_ENDPOINT}`)
                .then((res) => {
                    // Generate the URL for the first item of the lineage
                    const firstLineage = res.data[0]
                    // Used to push in the levels until we find an 'Artikel
                    let position = []

                    // TODO: Fix bug when there is no article in the first [0][0][0]
                    const traverseItems = (children) => {
                        if (children[0] && children[0].Type !== "Artikel") {
                            position.push(0)
                            return traverseItems(children[0].Children)
                        } else {
                            return children[0]
                        }
                    }

                    let firstArtikel = traverseItems(
                        firstLineage.Structuur.Children
                    )
                    const generateURL = (position, firstArtikel) => {
                        if (position.length === 1) {
                            return `/detail/verordeningen/${firstLineage.ID}/${firstArtikel.UUID}?hoofdstuk=0&nest_1=0&nest_2=null&nest_3=null`
                        } else if (position.length === 2) {
                            return `/detail/verordeningen/${firstLineage.ID}/${firstArtikel.UUID}?hoofdstuk=0&nest_1=0&nest_2=0&nest_3=null`
                        } else if (position.length === 3) {
                            return `/detail/verordeningen/${firstLineage.ID}/${firstArtikel.UUID}?hoofdstuk=0&nest_1=0&nest_2=0&nest_3=0`
                        }
                    }
                    setVerordeningStructuur(generateURL(position, firstArtikel))
                    setVerordeningIsLoading(false)
                })
                .catch((err) => console.log(err)),
        ])
            .then(() => setIsLoading(false))
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }, [])

    /**
     * Function to check if the activeTab parameter is linked to a currentContstant case and return the specific allDimensies parameter.
     */
    const getCurrentConstants = () => {
        switch (activeTab) {
            case "Ambities":
                return allDimensies["AMBITIES"]
            case "Beleidsdoelen":
                return allDimensies["BELEIDSDOELEN"]
            case "Beleidskeuzes":
                return allDimensies["BELEIDSKEUZES"]
            case "Maatregelen (Programma's)":
                return allDimensies["MAATREGELEN"]
            case "Beleidsregels":
                return allDimensies["BELEIDSREGELS"]
            case "Beleidsprestaties":
                return allDimensies["BELEIDSPRESTATIES"]

            default:
                return {}
        }
    }

    /**
     * Function to check if the activeTab parameter is linked to a CurrentItem case and return the specific allDimensies parameter.
     */
    const getCurrentItems = () => {
        switch (activeTab) {
            case "Ambities":
                return ambities
            case "Beleidsdoelen":
                return beleidsdoelen
            case "Beleidskeuzes":
                return beleidskeuzes
            case "Maatregelen (Programma's)":
                return maatregelen
            case "Beleidsregels":
                return beleidsregels
            case "Beleidsprestaties":
                return beleidsprestaties

            default:
                return []
        }
    }

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

    const currentItems = getCurrentItems()

    return (
        <React.Fragment>
            <button
                id="popup-menu-toggle"
                className="flex items-center justify-center px-2 py-2 text-gray-800 transition-colors duration-100 ease-in rounded hover:bg-gray-100 hover:text-gray-900"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
            >
                <FontAwesomeIcon
                    className="mx-1"
                    icon={isOpen ? faTimes : faBars}
                />
            </button>
            <Transition
                show={isOpen}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 -translate-y-5"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-5"
            >
                <div
                    id="popup-menu"
                    className="fixed top-0 left-0 w-full pt-16 bg-white"
                    style={
                        showBanner
                            ? {
                                  height: "calc(100vh - 73px)",
                                  top: "121px",
                              }
                            : {
                                  height: "calc(100vh - 73px)",
                                  top: "73px",
                              }
                    }
                >
                    <div className="container flex h-full px-6 mx-auto">
                        <div className="w-3/12 h-full pt-4 border-r border-gray-300">
                            <h3 className="text-xl font-bold text-pzh-blue">
                                Omgevingsvisie
                            </h3>
                            <nav className="mt-5">
                                <TabMenuItem
                                    activeTab={activeTab}
                                    tabTitle="Ambities"
                                    setActiveTab={setActiveTab}
                                />
                                <TabMenuItem
                                    activeTab={activeTab}
                                    tabTitle="Beleidsdoelen"
                                    setActiveTab={setActiveTab}
                                />
                                <TabMenuItem
                                    activeTab={activeTab}
                                    tabTitle="Beleidskeuzes"
                                    setActiveTab={setActiveTab}
                                />
                            </nav>
                            <h3 className="mt-16 text-xl font-bold text-pzh-blue">
                                Uitvoering
                            </h3>
                            <nav className="mt-5">
                                <TabMenuItem
                                    activeTab={activeTab}
                                    tabTitle="Maatregelen (Programma's)"
                                    setActiveTab={setActiveTab}
                                />
                                <TabMenuItem
                                    activeTab={activeTab}
                                    tabTitle="Beleidsprestaties"
                                    setActiveTab={setActiveTab}
                                />
                                <TabMenuItem
                                    activeTab={activeTab}
                                    tabTitle="Beleidsregels"
                                    setActiveTab={setActiveTab}
                                />
                                <TabMenuItemLink
                                    href={
                                        isLoading ? "#" : verordeningStructuur
                                    }
                                    tabId={`popup-menu-item-Verordening`}
                                    tabTitle="Verordening"
                                    setIsOpen={setIsOpen}
                                />
                            </nav>
                        </div>
                        {/* REFACTOR */}
                        <div className="flex flex-col w-9/12 pl-5">
                            <div className="flex items-end w-full pb-5 border-b border-gray-300">
                                <h3
                                    id={`selected-type-${activeTab}`}
                                    className="w-full text-xl font-bold text-pzh-blue"
                                >
                                    {activeTab}{" "}
                                    {isLoading &&
                                    verordeningIsLoading ? null : (
                                        <span className="ml-2 text-gray-600">
                                            {currentItems !== null
                                                ? currentItems.filter((item) =>
                                                      item?.Titel?.toLowerCase()?.includes(
                                                          filterQuery.toLowerCase()
                                                      )
                                                  ).length
                                                : null}
                                        </span>
                                    )}
                                </h3>
                                <div>
                                    <label
                                        htmlFor="filter-query"
                                        className="sr-only"
                                    >
                                        Filter
                                    </label>
                                    <div className="relative w-64 mt-1 rounded-md shadow-sm">
                                        <input
                                            id="filter-query"
                                            value={filterQuery}
                                            onChange={(e) =>
                                                setFilterQuery(e.target.value)
                                            }
                                            className="block w-full pr-10 form-input "
                                            placeholder={`Zoek in ${getCurrentConstants().TITLE_PLURAL.toLowerCase()}`}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <FontAwesomeIcon
                                                className="ml-2 text-gray-400"
                                                icon={faSearch}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="h-full pt-2 overflow-y-auto">
                                <nav
                                    id="popup-menu-active-nav"
                                    className="flex flex-wrap pb-12 items-top"
                                >
                                    {isLoading || !currentItems ? (
                                        <div className="flex items-center justify-center w-full h-24 text-gray-500">
                                            <LoaderSpinner />
                                        </div>
                                    ) : (
                                        currentItems
                                            .filter((item) =>
                                                item?.Titel?.toLowerCase()?.includes(
                                                    filterQuery.toLowerCase()
                                                )
                                            )
                                            .sort(function (a, b) {
                                                if (a.Titel < b.Titel) {
                                                    return -1
                                                }
                                                if (a.Titel > b.Titel) {
                                                    return 1
                                                }
                                                return 0
                                            })
                                            .map((item, index) => (
                                                <Link
                                                    key={item.UUID}
                                                    className={`w-1/2 group flex items-center px-3 py-2 text-sm leading-5 font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition ease-in-out duration-150  ${
                                                        index % 2 === 0
                                                            ? "pr-4"
                                                            : "pl-4"
                                                    }`}
                                                    onClick={() =>
                                                        setIsOpen(false)
                                                    }
                                                    to={`/detail/${
                                                        getCurrentConstants()
                                                            .SLUG_OVERVIEW
                                                    }/${item.UUID}`}
                                                >
                                                    {item.Titel}
                                                </Link>
                                            ))
                                    )}
                                    {!isLoading &&
                                    currentItems &&
                                    currentItems.filter((item) =>
                                        item?.Titel?.toLowerCase()?.includes(
                                            filterQuery?.toLowerCase()
                                        )
                                    ).length === 0 ? (
                                        <span
                                            className="px-3 mt-2 text-gray-500 cursor-pointer hover:text-gray-700 text-italic"
                                            onClick={() => {
                                                setFilterQuery("")
                                                document
                                                    .getElementById(
                                                        "filter-query"
                                                    )
                                                    .focus()
                                            }}
                                        >
                                            Er zijn geen resultaten
                                        </span>
                                    ) : null}
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </React.Fragment>
    )
}

/**
 * Function to render the TabMenuItem in the NavigationPopupMenu component.
 *
 * @param {boolean} activeTab - Parameter that is used to set the tabTitle to tabIsActive, if activeTab is set true.
 * @param {string} tabTitle - Parameter that contains the title of the tab.
 * @param {function} setActiveTab - Parameter that is used to set the tabTitle parameter as activeTab.
 */
const TabMenuItem = ({ activeTab, tabTitle, setActiveTab }) => {
    const tabIsActive = activeTab === tabTitle

    return (
        <button
            onClick={() => setActiveTab(tabTitle)}
            id={`popup-menu-item-${tabTitle}`}
            className={`w-full font-medium rounded-md-l group flex items-center px-3 py-2 text-sm leading-5 hover:text-gray-900 transition ease-in-out duration-150 mt-1 ${
                tabIsActive
                    ? "bg-gray-100 hover:bg-gray-100 focus:outline-none"
                    : "hover:bg-gray-100 focus:outline-none focus:bg-gray-50 cursor-pointer"
            }`}
            aria-current={tabIsActive ? "page" : false}
        >
            <span className="truncate">{tabTitle}</span>
        </button>
    )
}

/**
 * Function to render the TabMenuItemLink component, that contains a link.
 *
 * @function
 *
 * @param {string} tabTitle - Displays the title of the link.
 * @param {url} href - Contains the target location of the link.
 * @param {function} setIsOpen - Used to set the parent state to false.
 * @param {number} tabId - Contains the id of the link.
 */
const TabMenuItemLink = ({ tabTitle, href, setIsOpen, tabId, callback }) => {
    return (
        <Link
            id={tabId}
            onClick={() => {
                setIsOpen(false)
                if (callback) callback()
            }}
            to={href}
            className={`w-full font-medium rounded-md-l group flex items-center px-3 py-2 text-sm leading-5 hover:text-gray-900 transition ease-in-out duration-150 mt-1 hover:bg-gray-100 focus:outline-none focus:bg-gray-50 cursor-pointer`}
        >
            <span className="truncate">{tabTitle}</span>
        </Link>
    )
}

export default NavigationPopupMenu
