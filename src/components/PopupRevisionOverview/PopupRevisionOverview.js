import React from "react"
import { Transition } from "@headlessui/react"
import { format } from "date-fns"
import nlLocale from "date-fns/locale/nl"
import { faTimes } from "@fortawesome/pro-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Select from "react-select"

import axios from "../../API/axios"

import LoaderSpinner from "../LoaderSpinner"
import LeafletRevisionOverview from "./../LeafletRevisionOverview"
import ViewFieldIngelogdExtraInfo from "./../ViewFieldIngelogdExtraInfo"

import useClickOutsideContainer from "./../../utils/useClickOutsideContainer"
import useCloseWithEscapeKey from "./../../utils/useCloseWithEscapeKey"
import useLockBodyScroll from "./../../utils/useLockBodyScroll"

import networkGraphConnectionProperties from "./../../constants/networkGraphConnectionProperties"

import UserContext from "./../../App/UserContext"

/**
 * Function to get the text indicating its validity.
 *
 * @function
 *
 * @param {object} object - The text within this object parameter is checked within this function.
 */
const getValidText = (object) => {
    if (!object["Begin_Geldigheid"]) return "Er is nog geen begin geldigheid"

    const textDate = format(
        new Date(object["Begin_Geldigheid"]),
        "d MMMM yyyy",
        {
            locale: nlLocale,
        }
    )
    const isActive =
        object.Status && object.Status === "Vigerend" ? "Sinds" : "Vanaf"

    return isActive + " " + textDate
}

/**
 * Function that returns the left and right revision options.
 *
 * @function
 *
 * @param {array} revisionObjects - Contains the revision objects
 * @param {null|string} leftSelect - Contains null if none is selected, else it contains the UUID that is selected
 * @param {null|string} rightSelect - Contains null if none is selected, else it contains the UUID that is selected
 */
function getSelectOptions(revisionObjects, leftSelect, rightSelect) {
    /**
     * Checks if an options is disabled.
     * When we select an option, we disable the previous or following options, based on the optionsType
     * @function
     *
     * @param {number} index - Index in of the item in the revisionObjects array
     * @param {string} optionsType - Containing the options type value.
     * @returns {boolean} indicating if the option is disabled or not
     */
    const checkIsDisabled = (index, optionsType) => {
        if (optionsType === "left" && !rightSelect) return false
        if (optionsType === "right" && !leftSelect) return false

        const leftSelectIndex = revisionObjects.findIndex(
            (e) => e.UUID === leftSelect
        )
        const rightSelectIndex = revisionObjects.findIndex(
            (e) => e.UUID === rightSelect
        )

        if (optionsType === "left") {
            // Disabled if the rightSelectIndex comes after the current object index
            return index <= rightSelectIndex
        } else if (optionsType === "right") {
            // Disabled if the leftSelectIndex comes after the current object index
            return index >= leftSelectIndex
        }
    }

    /**
     * Function to map over the revision objects and return the value of the label, value and isDisabled parameters.
     *
     * @param {array} revisionObjects - Contains the revision objects
     * @param {string} type - Parameter containing the 'left' or 'right' value.
     */
    const getOptions = (revisionObjects, type) =>
        revisionObjects.map((obj, index) => {
            return {
                label: `${getValidText(obj)} (${obj.uiStatus})`,
                value: obj.UUID,
                isDisabled: checkIsDisabled(index, type),
            }
        })

    const optionsLeft = getOptions(revisionObjects, "left")
    const optionsRight = getOptions(revisionObjects, "right")

    return [optionsLeft, optionsRight]
}

/**
 * Displays an popup containing the Revisieoverzicht with a list of beleidskeuzes, which the user can compare two beleidskeuzes.
 *
 * @Component
 *
 * @param {boolean} revisionOverviewOpen - Indicating if the revision overview is open
 * @param {function} setRevisionOverviewOpen - Function to open/close the RevisionOverviewOpen popup.
 * @param {object} dataObject - Contains the data of the object the user is viewing on the detail page.
 * @param {object[]} revisionObjects - Containing a collection of revisions in object form.
 */
const PopupRevisionOverview = ({
    revisionOverviewOpen,
    setRevisionOverviewOpen,
    dataObject,
    revisionObjects,
}) => {
    // Used to lock the vertical body scroll (overflow)
    const [bodyLock, setBodyLock] = React.useState(false)

    // Options for the select component
    const [optionsLeft, setOptionsLeft] = React.useState(false)
    const [optionsRight, setOptionsRight] = React.useState(false)

    const [leftSelect, setLeftSelect] = React.useState(null)
    const [rightSelect, setRightSelect] = React.useState(null)

    const [changesFromApi, setChangesFromApi] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(false)

    const innerContainer = React.useRef(null)

    useClickOutsideContainer(innerContainer, (event) => {
        // The following function is to prevent closing when a click happens on the scrollbar
        // scrollWidth gets the width of the element without the scrollbar

        const fixedContainerEl = document.getElementById(
            "revisionOverview-container-fixed"
        )

        if (fixedContainerEl.scrollWidth <= event.clientX) return

        setRevisionOverviewOpen(false)
    })

    useCloseWithEscapeKey(innerContainer, () => {
        setRevisionOverviewOpen(false)
    })

    // Reset when the user opens the window
    React.useLayoutEffect(() => {
        if (revisionOverviewOpen) {
            setLeftSelect(null)
            setRightSelect(null)
            setChangesFromApi(null)
        }
    }, [revisionOverviewOpen])

    React.useEffect(() => {
        if (revisionOverviewOpen) {
            setBodyLock(true)
        } else {
            setTimeout(() => {
                setBodyLock(false)
            }, 110) // duration of the Transition + 1ms margin, this prevents two scrollbars
        }
    }, [revisionOverviewOpen])

    const selectOnScroll = () => {
        const selectContainer = document.getElementById(
            "revisionOverview-select-container"
        )
        const selectHeader = document.getElementById("revisionOverview-header")

        if (!selectContainer) return
        if (!selectHeader) return

        const selectWidth = selectContainer.offsetWidth
        const extraMargin = 32
        const selectHeight = selectContainer.offsetHeight + extraMargin
        const selectTop = selectContainer.getBoundingClientRect().top
        const headerBottom = selectHeader.getBoundingClientRect().bottom

        if (selectTop < 0) {
            selectContainer.classList.add("fixed", "top-0", "z-10", "shadow-md")
            selectContainer.style.width = selectWidth + "px"
            selectHeader.style.marginBottom = selectHeight + "px"
        } else if (headerBottom > 0) {
            selectContainer.style.width = "100%"
            selectHeader.style.marginBottom = 0 + "px"
            selectContainer.classList.remove(
                "fixed",
                "top-0",
                "z-10",
                "shadow-md"
            )
        }
    }

    React.useEffect(() => {
        const sortedRevisionObjects = revisionObjects.sort(
            (a, b) =>
                new Date(b.Begin_Geldigheid) - new Date(a.Begin_Geldigheid)
        )

        const [
            optionsFromRevisionsLeft,
            optionsFromRevisionsRight,
        ] = getSelectOptions(sortedRevisionObjects, leftSelect, rightSelect)

        setOptionsLeft(optionsFromRevisionsLeft)
        setOptionsRight(optionsFromRevisionsRight)

        // If both leftSelect and rightSelect have a value, we get the new changes
        if (!leftSelect || !rightSelect) return

        setIsLoading(true)

        axios
            .get(`changes/beleidskeuzes/${leftSelect}/${rightSelect}`)
            .then((res) => {
                setChangesFromApi(res.data)
                setIsLoading(false)
            })
    }, [leftSelect, rightSelect, revisionObjects])

    // Disables body vertical scroll when revisieOverzicht is open
    useLockBodyScroll({ modalOpen: bodyLock })

    return (
        <React.Fragment>
            <Transition
                show={revisionOverviewOpen}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
            </Transition>
            <div
                id="revisionOverview-container-fixed"
                onScroll={selectOnScroll}
                className={`fixed inset-0 z-10 w-full overflow-y-auto ${
                    revisionOverviewOpen ? "" : "pointer-events-none"
                }`}
            >
                <Transition
                    show={revisionOverviewOpen}
                    enter="transition ease-out duration-150 transform"
                    enterFrom="-translate-y-1 scale-95"
                    enterTo="translate-y-0 scale-100"
                    leave="transition ease-in duration-100 transform"
                    leaveFrom="translate-y-0 scale-100"
                    leaveTo="-translate-y-1 scale-95"
                >
                    <div
                        className="container px-6 mx-auto mt-32 mb-48 pointer-events-auto"
                        ref={innerContainer}
                    >
                        <div className="relative z-50 w-full text-gray-700 bg-white rounded-md shadow-md">
                            <div
                                className="block w-full p-10 pb-0 transition-shadow duration-200 ease-in bg-gray-100 rounded-t-md"
                                id="revisionOverview-header"
                            >
                                <div
                                    onClick={() => {
                                        setRevisionOverviewOpen(false)
                                    }}
                                    className="absolute top-0 right-0 px-3 py-2 mt-8 mr-8 text-gray-600 transition-colors duration-100 ease-in cursor-pointer hover:text-gray-800"
                                    id={`close-revisionOverview`}
                                >
                                    <FontAwesomeIcon
                                        className="text-lg"
                                        icon={faTimes}
                                    />
                                </div>
                                <h2 className="block mb-1 text-xl font-bold tracking-wide text-pzh-blue">
                                    Revisieoverzicht
                                </h2>
                                <p className="w-full leading-7 text-gray-800 break-words whitespace-pre-line">
                                    Vergelijk de versies van de Beleidskeuze “
                                    {dataObject.Titel}”.
                                </p>
                            </div>
                            <div
                                id="revisionOverview-select-container"
                                className="block w-full px-10 pt-5 pb-6 bg-gray-100 border-b border-gray-300"
                            >
                                <div className="flex items-center justify-between">
                                    <Select
                                        className="w-1/2 mr-5 shadow"
                                        id={`revisie-from`}
                                        name="revisie-form-from"
                                        onChange={(e) => setLeftSelect(e.value)}
                                        options={optionsLeft}
                                        placeholder={`Selecteer een beleidskeuze...`}
                                    />
                                    <Select
                                        className="w-1/2 ml-5 shadow"
                                        id={`revisie-from`}
                                        name="revisie-form-from"
                                        onChange={(e) =>
                                            setRightSelect(e.value)
                                        }
                                        options={optionsRight}
                                        placeholder={`Selecteer een beleidskeuze...`}
                                    />
                                </div>
                            </div>
                            <div className="w-full bg-white rounded-b-md">
                                {isLoading && !changesFromApi ? (
                                    <div className="flex items-center justify-center w-full h-64 text-xl text-gray-600">
                                        <LoaderSpinner />
                                    </div>
                                ) : changesFromApi && !isLoading ? (
                                    <ChangeContainer
                                        revisionObjects={revisionObjects}
                                        oldObject={changesFromApi.old}
                                        changesObject={changesFromApi.changes}
                                        originalObject={dataObject}
                                    />
                                ) : changesFromApi && isLoading ? (
                                    <React.Fragment>
                                        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen text-xl text-gray-600">
                                            <LoaderSpinner />
                                        </div>
                                        <div className="opacity-50">
                                            <ChangeContainer
                                                revisionObjects={
                                                    revisionObjects
                                                }
                                                oldObject={changesFromApi.old}
                                                changesObject={
                                                    changesFromApi.changes
                                                }
                                                originalObject={dataObject}
                                            />
                                        </div>
                                    </React.Fragment>
                                ) : (
                                    <div className="flex items-center justify-center w-full h-64 text-xl text-gray-600">
                                        <span className="italic text-gray-500">
                                            Selecteer twee beleidskeuzes om te
                                            vergelijken
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </React.Fragment>
    )
}

/**
 * Displays a container aligned to the left with children components in it.
 *
 * @param {object} children - Children component(s)
 */
const ContainerLeft = ({ children }) => (
    <div className={`w-1/2 pr-5`}>{children}</div>
)

/**
 * Displays a container aligned to the right with children components in it.
 *
 * @param {object} children - Children component(s)
 */
const ContainerRight = ({ children }) => (
    <div className={`w-1/2 pl-5`}>{children}</div>
)

/**
 * Displays a beleidskeuze on the left and a beleidskeuze on the right, which the user can compare the changes.
 *
 * @param {object} oldObject - Contains the old object data.
 * @param {object} changesObject - Contains the object with changes.
 * @param {object} originalObject - Contains the object in its original form
 * @param {array} revisionObjects - Contains a list of revisions from the parent state.
 */
const ChangeContainer = ({
    oldObject,
    changesObject,
    originalObject,
    revisionObjects,
}) => {
    const { user } = React.useContext(UserContext)
    return (
        <div className="min-h-screen pb-16">
            <div className="mt-8">
                <ContainerMain>
                    {/* Section - Title */}
                    <ContainerLeft>
                        <span className="block text-lg font-bold opacity-25 text-primary-super-dark">
                            Beleidskeuze
                        </span>
                        <Title title={oldObject.Titel} />
                    </ContainerLeft>

                    <ContainerRight>
                        <span className="block text-lg font-bold opacity-25 text-primary-super-dark">
                            Beleidskeuze
                        </span>
                        <Title title={changesObject.Titel} />
                    </ContainerRight>

                    {/* Section - Display extra information if user is logged in */}
                    {user ? (
                        <div className="flex justify-between w-full mt-4">
                            <ContainerLeft>
                                <ViewFieldIngelogdExtraInfo
                                    hideEdit={true}
                                    crudObject={oldObject}
                                />
                            </ContainerLeft>

                            <ContainerRight>
                                <ViewFieldIngelogdExtraInfo
                                    hideEdit={true}
                                    crudObject={changesObject}
                                />
                            </ContainerRight>
                        </div>
                    ) : null}

                    {/* Section - Date */}
                    <ContainerLeft>
                        <ValidText
                            revisionObjects={revisionObjects}
                            object={oldObject}
                        />
                    </ContainerLeft>

                    <ContainerRight>
                        <ValidText
                            revisionObjects={revisionObjects}
                            object={changesObject}
                        />
                    </ContainerRight>

                    {/* Section - Omschrijving Keuze */}
                    <ContainerLeft>
                        <Text
                            textContent={oldObject.Omschrijving_Keuze}
                            label="Wat wil de provincie bereiken?"
                        />
                    </ContainerLeft>

                    <ContainerRight>
                        <Text
                            textContent={changesObject.Omschrijving_Keuze}
                            label="Wat wil de provincie bereiken?"
                        />
                    </ContainerRight>

                    {/* Section - Aanleiding */}
                    <ContainerLeft>
                        <Text
                            textContent={oldObject.Aanleiding}
                            label="Aanleiding"
                        />
                    </ContainerLeft>

                    <ContainerRight>
                        <Text
                            textContent={changesObject.Aanleiding}
                            label="Aanleiding"
                        />
                    </ContainerRight>

                    {/* Section - Provinciaal Belang */}
                    <ContainerLeft>
                        <Text
                            textContent={oldObject.Provinciaal_Belang}
                            label="Provinciaal Belang"
                        />
                    </ContainerLeft>

                    <ContainerRight>
                        <Text
                            textContent={changesObject.Provinciaal_Belang}
                            label="Provinciaal Belang"
                        />
                    </ContainerRight>

                    {/* Section - Omschrijving Toelichting */}
                    <ContainerLeft>
                        <Text
                            textContent={oldObject.Omschrijving_Werking}
                            label="Toelichting"
                        />
                    </ContainerLeft>

                    <ContainerRight>
                        <Text
                            textContent={changesObject.Omschrijving_Werking}
                            label="Toelichting"
                        />
                    </ContainerRight>

                    {/* Section - Nationaal Belangen */}
                    <ContainerLeft>
                        <Belangen
                            placeholder="Er zijn geen nationale belangen gekoppeld"
                            label="Nationale Belangen"
                            object={oldObject}
                            type="Nationaal Belang"
                        />
                    </ContainerLeft>

                    <ContainerRight>
                        <Belangen
                            placeholder="Er zijn geen nationale belangen gekoppeld"
                            label="Nationale Belangen"
                            containsChanges={true}
                            object={changesObject}
                            type="Nationaal Belang"
                        />
                    </ContainerRight>

                    {/* Section - Wettelijke Taak & Bevoegdheid */}
                    <ContainerLeft>
                        <Belangen
                            placeholder="Er zijn geen wettelijke taken gekoppeld"
                            label="Wettelijke Taken"
                            object={oldObject}
                            type="Wettelijke Taak & Bevoegdheid"
                        />
                    </ContainerLeft>

                    <ContainerRight>
                        <Belangen
                            placeholder="Er zijn geen wettelijke taken gekoppeld"
                            label="Wettelijke Taken"
                            containsChanges={true}
                            object={changesObject}
                            type="Wettelijke Taak & Bevoegdheid"
                        />
                    </ContainerRight>
                </ContainerMain>
            </div>

            {/* Section - Koppelingen */}
            <div>
                <DividerWithTitle title={`Koppelingen & Relaties`} />
                <RelationsConnectionsText
                    originalObject={oldObject}
                    objectChanges={changesObject}
                />
            </div>

            {/* Section - GEO */}
            <div className="mt-10">
                <DividerWithTitle title={`Werkingsgebied`} singleTitle={true} />
                <ContainerMain>
                    <RevisionWerkingsgebied
                        originalObject={originalObject}
                        changesObject={changesObject}
                    />
                </ContainerMain>
            </div>
        </div>
    )
}

/**
 * Displays the revisie werkingsgebied on a map.
 *
 * @param {Object} originalObject - Contains the object in its original form
 * @param {Object} changesObject - Contains the object with changes on the properties (e.g. Propertie: {"new": [...], "removed": [...], "same": [...]})
 */
const RevisionWerkingsgebied = ({ originalObject, changesObject }) => {
    /**
     * We get this werkingsgebied from the changesObject.
     * This means the 'Werkingsgebieden' value will contain an object with the 'new', 'removed' and 'same' properties
     * We first check 'new', if the array is empty we check 'same'. If that is also empty we know that the rightSelect state value has no werkingsgebied
     * If that is the case, we return a unique string to indicate that, else we set the title
     * @returns {string} Contains a string that indicates the changes to the GEO properties
     */
    const getSentenceIndicatingChange = () => {
        if (
            changesObject.Werkingsgebieden.new.length > 0 &&
            changesObject.Werkingsgebieden.removed.length > 0
        ) {
            return `Beleidskeuze '${originalObject.Titel}' is gewijzigd van gebied '${changesObject?.Werkingsgebieden?.removed[0]?.Object?.Werkingsgebied}' naar gebied '${changesObject?.Werkingsgebieden?.new[0]?.Object?.Werkingsgebied}'.`
        } else if (changesObject.Werkingsgebieden.new.length > 0) {
            return `Beleidskeuze '${originalObject.Titel}' heeft '${changesObject?.Werkingsgebieden?.new[0]?.Object?.Werkingsgebied}' als werkingsgebied gekregen.`
        } else if (changesObject.Werkingsgebieden.same.length > 0) {
            return `Beleidskeuze '${originalObject.Titel}' is niet gewijzigd, en is gekoppeld aan '${changesObject?.Werkingsgebieden?.same[0]?.Object?.Werkingsgebied}'.`
        } else if (changesObject.Werkingsgebieden.removed.length > 0) {
            return `Beleidskeuze '${originalObject.Titel}' was gekoppeld aan gebied '${changesObject?.Werkingsgebieden?.removed[0]?.Object?.Werkingsgebied}', maar deze koppeling is verwijderd.`
        } else {
            // The leftSelect value and the rightSelect value both didn't have a werkingsgebied
            return `Beleidskeuze '${originalObject.Titel}' heeft voor beide geselecteerde objecten geen werkingsgebied`
        }
    }

    /**
     * @returns {array} containing an Array and an Object. The array contains the GEO UUIDS. The Object contains the changes of the object.
     */
    const getGEO = () => {
        const gebiedenChanges = {
            new: [],
            removed: [],
            same: [],
        }

        const gebiedenUUIDS = []

        Object.keys(gebiedenChanges).forEach((changeProperty) => {
            changesObject.Werkingsgebieden[changeProperty].forEach(
                (werkingsgebied) => {
                    gebiedenChanges[changeProperty] = werkingsgebied.Object.UUID
                    gebiedenUUIDS.push(werkingsgebied.Object.UUID)
                }
            )
        })

        return [gebiedenUUIDS, gebiedenChanges]
    }

    const sentenceIndicatingChange = getSentenceIndicatingChange()
    const [gebiedenUUIDS, gebiedenChanges] = getGEO()

    return (
        <div className="w-full">
            <p
                className={`text-gray-800 mt-4 leading-7 break-words w-full whitespace-pre-line`}
            >
                {sentenceIndicatingChange}
            </p>
            <div
                className="mt-4 overflow-hidden border border-gray-300 rounded-lg"
                id={`revision-overview-leaflet`}
            >
                <LeafletRevisionOverview
                    gebiedenUUIDS={gebiedenUUIDS}
                    gebiedenChanges={gebiedenChanges}
                />
            </div>
            <ul className="mt-4">
                <LegendaItem
                    color="#E74C3C"
                    label="Verwijderd werkingsgebied"
                />
                <LegendaItem
                    color="#2ECC71"
                    label="Toegevoegd werkingsgebied"
                />
                <LegendaItem
                    color="#2980B9"
                    label="Ongewijzigd werkingsgebied"
                />
            </ul>
        </div>
    )
}

/**
 * @param {object} props
 * @param {string} props.color - Background color
 * @param {object} props.label - Legenda label
 * @returns A component for a legenda item containing a color indicator and a label
 */
const LegendaItem = ({ color, label }) => {
    return (
        <li className="flex items-center mt-1">
            <span
                style={{ backgroundColor: color }}
                className="inline-block w-3 h-3 mr-2 rounded-full"
            />
            <span>{label}</span>
        </li>
    )
}

/**
 * Displays a title component with a divider.
 *
 * @param {string} title - Title displayed within a top and bottom divider.
 * @param {boolean} singleTitle - Used to check if there is only one title.
 */
const DividerWithTitle = ({ title, singleTitle }) => {
    if (singleTitle) {
        return (
            <div className="w-full px-10 pt-5 pb-4 bg-gray-100 border-t border-b border-gray-200">
                <h3 className="block mb-1 text-lg font-semibold tracking-wide text-gray-800">
                    {title}
                </h3>
            </div>
        )
    } else {
        return (
            <div className="flex flex-wrap justify-between w-full px-10 pt-5 pb-4 bg-gray-100 border-t border-b border-gray-200">
                <ContainerLeft>
                    <h3 className="block mb-1 text-lg font-semibold tracking-wide text-gray-800">
                        {title}
                    </h3>
                </ContainerLeft>
                <ContainerRight>
                    <h3 className="block mb-1 text-lg font-semibold tracking-wide text-gray-800">
                        {title}
                    </h3>
                </ContainerRight>
            </div>
        )
    }
}

/**
 * Displays a title containing html markup.
 *
 * @param {string} title - Parameter containing a title with html markup.
 */
const Title = ({ title }) => {
    return (
        <h2
            className="mt-2 text-2xl font-semibold text-primary-super-dark"
            dangerouslySetInnerHTML={{ __html: title }}
        />
    )
}

/**
 * Displays a label and text containing html markup.
 *
 * @param {string} textContent - Contains the text content in HTML markup form.
 * @param {string} label - Contains the text label.
 */
const Text = ({ textContent, label }) => {
    return (
        <div className="mb-8">
            {label ? (
                <h3 className="block mb-1 text-lg font-semibold tracking-wide text-gray-800">
                    {label}
                </h3>
            ) : null}
            <p
                className={`text-gray-800 leading-7 break-words w-full whitespace-pre-line`}
                dangerouslySetInnerHTML={{
                    __html: textContent ? textContent : "Er is geen inhoud",
                }}
            />
        </div>
    )
}

/**
 * The text indicating the period of validity of the object.
 *
 * @param {object} object - Contains the Begin_Geldigheid date.
 * @param {array} revisionObjects - Contains a collection of revisions in object form.
 */
const ValidText = ({ object, revisionObjects }) => {
    if (!revisionObjects) return null

    revisionObjects = revisionObjects.sort(
        (a, b) => new Date(b.Begin_Geldigheid) - new Date(a.Begin_Geldigheid)
    )

    const uiStatus = revisionObjects.find((e) => e.UUID === object.UUID)
        .uiStatus

    const getTextValidFromSince = (object) => {
        // Toevoegen van de datum in de revisie: "Vigerend van <datum inwerkingtreding> tot <datum uitwerkingtreding>" voor gearchiveerde beleidskeuzes.
        // Voor vigerende beleidskeuzes: "Vigerend van <datum inwerkingtreding> tot heden"
        if (!object["Begin_Geldigheid"])
            return "Er is nog geen begin geldigheid"

        const formatDate = (date) =>
            format(new Date(date), "d MMMM yyyy", {
                locale: nlLocale,
            })

        const dateStart = formatDate(object["Begin_Geldigheid"])
        const isCurrentlyVigerend = uiStatus && uiStatus === "Vigerend"

        if (isCurrentlyVigerend) {
            return `Vigerend vanaf ${dateStart} tot heden`
        } else if (object.Begin_Geldigheid === "1753-01-01T00:00:00Z") {
            return `Er is geen begin geldigheid`
        } else {
            return `Vigerend vanaf ${dateStart}`
        }
    }

    const validText = getTextValidFromSince(object)

    return (
        <span className="inline-block my-3 text-base text-gray-600 ">
            {validText}
        </span>
    )
}

/**
 * Displays the label, titel and omschrijving of a belang.
 *
 * @param {string} label - Label of a belang
 * @param {object} object - Contains the Belang information in object form.
 * @param {string} type - String indicating the type of Belang
 * @param {boolean} containsChanges - Used to check if a belang contains changes.
 * @param {string} placeholder - Contains the placeholder used within the component.
 */
const Belangen = ({ label, object, type, containsChanges, placeholder }) => {
    /**
     * Function to get and filter through the belangen.
     *
     * @param {boolean} containsChanges - Used to check if the belangen contain changes.
     * @param {object} object - Contains the belangen in object form.
     * @param {string} type - Contains the type value.
     */
    const getBelangen = (containsChanges, object, type) => {
        if (!containsChanges) {
            return object.Belangen.filter((e) => e.Object.Type === type).map(
                (e) => e.Object
            )
        } else {
            const belangen = []
            Object.keys(object.Belangen).forEach((key) =>
                object.Belangen[key].forEach((belang) => {
                    belangen.push({ ...belang.Object, changeType: key })
                })
            )
            return belangen.filter((e) => e.Type === type)
        }
    }

    /**
     * Function that changes the style of the container based on the object parameter.
     *
     * @param {object} object - Contains the type of container.
     */
    const getContainerStyle = (object) =>
        object.changeType === "removed"
            ? { backgroundColor: "#f4c9c6", textDecoration: "line-through" } // Removed - Red
            : object.changeType === "new"
            ? { backgroundColor: "#e5f0ef" } // New     - Green
            : { backgroundColor: "#f2f2f7" } // Default - Purple

    const objects = getBelangen(containsChanges, object, type)

    return (
        <div className="mb-8">
            {label ? (
                <h3 className="block mb-3 text-lg font-semibold tracking-wide text-gray-800">
                    {label}
                </h3>
            ) : null}
            {objects && objects.length > 0 ? (
                objects.map((object) => {
                    const containerStyle = getContainerStyle(object)
                    return (
                        <div
                            className={`p-5 mb-4 rounded-md`}
                            style={containerStyle}
                        >
                            <span className="block mb-1 font-bold m-color-puple">
                                {object.Titel}
                            </span>
                            <p className="w-full leading-7 text-gray-800 break-words whitespace-pre-line">
                                {object.Omschrijving}
                            </p>
                        </div>
                    )
                })
            ) : (
                <span className="italic text-gray-600">{placeholder}</span>
            )}
        </div>
    )
}

/**
 * Displays two containers containing the connected relations between objects.
 *
 * @param {object} originalObject - Contains the original object
 * @param {object} objectChanges - Contains the object that has changes
 * @returns A section that indicates the changes in connections
 */
function RelationsConnectionsText({ originalObject, objectChanges }) {
    if (!originalObject || !objectChanges) return

    /**
     * The changeObject connection properties contain objects with three potential properties:
     * { new: {}, same: {}, removed: {} }
     * We loop through these properties and push them into an array
     * The key (e.g. 'new') is pushed onto the object under the property 'changeType'
     * This changeType property determines the styling
     * @param {string} property - Property that contains the values
     * @param {object} obj - Object to get the values from
     * @returns {array} containing the changed objects
     */
    const getValuesOfChangeObject = (property, obj) => {
        const values = []

        if (!obj[property]) return values

        // Else we need to get the values from the changes properties ('removed', 'same', etc.)
        Object.keys(obj[property]).forEach((key) =>
            obj[property][key].forEach((value) => {
                values.push({ ...value, changeType: key })
            })
        )

        return values
    }

    return (
        <div>
            {connectionProperties.map((property) => {
                const valuesOld = originalObject[property]
                    ? originalObject[property]
                    : []
                const valuesChanges = getValuesOfChangeObject(
                    property,
                    objectChanges
                )

                return (
                    <ContainerMain>
                        <ContainerLeft>
                            <div className="mt-4">
                                <h3 className="text-sm font-bold text-gray-800">
                                    {property}
                                </h3>
                                <ul className="mt-2">
                                    {valuesOld && valuesOld.length > 0 ? (
                                        valuesOld.map((connection) => (
                                            <ConnectionListItem
                                                connection={connection}
                                                property={property}
                                            />
                                        ))
                                    ) : (
                                        <span className="mt-2 italic text-gray-600">
                                            Er zijn geen{" "}
                                            {property.toLowerCase()} gekoppeld
                                        </span>
                                    )}
                                </ul>
                            </div>
                        </ContainerLeft>
                        <ContainerRight>
                            <div className="mt-4">
                                <h3 className="text-sm font-bold text-gray-800">
                                    {property}
                                </h3>
                                <ul className="mt-2">
                                    {valuesChanges &&
                                    valuesChanges.length > 0 ? (
                                        valuesChanges.map((connection) => (
                                            <ConnectionListItem
                                                changeType={
                                                    connection.changeType
                                                }
                                                connection={connection}
                                                property={property}
                                            />
                                        ))
                                    ) : (
                                        <span className="mt-2 italic text-gray-600">
                                            Er zijn geen{" "}
                                            {property.toLowerCase()} gekoppeld
                                        </span>
                                    )}
                                </ul>
                            </div>
                        </ContainerRight>
                    </ContainerMain>
                )
            })}
        </div>
    )
}

/**
 * Displays the main container of the PopUpRevisionOverview component.
 *
 * @param {object} children - contains the child components
 * @returns A wrapper container element
 */
const ContainerMain = ({ children }) => {
    return (
        <div className="flex flex-wrap justify-between px-10 mt-2">
            {children}
        </div>
    )
}

/**
 * Displays list of connected list items.
 *
 * @param {string} property - Name of the property used to define the color
 * @param {object} connection - Contains the connection information of a revision
 * @returns A list item that displays the connecting (and potentially the changes to it)
 */
const ConnectionListItem = ({ property, connection }) => {
    /**
     * Gets style to indicate changes to the object
     */
    const textStyle =
        connection.changeType === "removed"
            ? { backgroundColor: "#f4c9c6", textDecoration: "line-through" } // Removed - Red
            : connection.changeType === "new"
            ? { backgroundColor: "#e5f0ef" } // New - Green
            : {} // Default

    return (
        <li className="relative block mt-2 text-sm text-gray-800">
            <div className="inline-flex items-center group">
                <div className="flex">
                    <span
                        className={`inline-block w-3 h-3 flex-shrink-0 mr-2 rounded-full`}
                        style={{
                            backgroundColor:
                                networkGraphConnectionProperties[
                                    property.toLowerCase()
                                ].hex,
                        }}
                    />
                    <div>
                        <span className="block px-1" style={textStyle}>
                            {connection.Object?.Titel}
                        </span>
                        {connection.Koppeling_Omschrijving ? (
                            <span
                                className="block px-1 mt-1 text-xs"
                                style={textStyle}
                            >
                                {connection.Koppeling_Omschrijving}
                            </span>
                        ) : null}
                    </div>
                </div>
            </div>
        </li>
    )
}

const connectionProperties = [
    "Ambities",
    "Beleidsregels",
    "Beleidsprestaties",
    "Maatregelen",
    "Beleidsdoelen",
    "Themas",
    "Verordeningen",
]

export default PopupRevisionOverview
