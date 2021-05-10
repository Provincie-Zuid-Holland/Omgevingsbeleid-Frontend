import React from 'react'
import { Transition } from '@headlessui/react'
import { format, isDate } from 'date-fns'
import nlLocale from 'date-fns/locale/nl'
import { faTimes } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from 'react-select'

import axios from '../../API/axios'

import LoaderSpinner from '../LoaderSpinner'
import LeafletRevisionOverview from './../LeafletRevisionOverview'
import ViewFieldIngelogdExtraInfo from './../ViewFieldIngelogdExtraInfo'

import useClickOutsideContainer from './../../utils/useClickOutsideContainer'
import useCloseWithEscapeKey from './../../utils/useCloseWithEscapeKey'
import useLockBodyScroll from './../../utils/useLockBodyScroll'

import UserContext from './../../App/UserContext'

/**
 *
 * @param {object} object - Object we want the validity text of
 * @returns {string} - Text indicating the validity of the object
 */
const getValidText = (object) => {
    if (!object['Begin_Geldigheid']) return 'Er is nog geen begin geldigheid'

    const textDate = format(
        new Date(object['Begin_Geldigheid']),
        'd MMMM yyyy',
        {
            locale: nlLocale,
        }
    )
    const isActive =
        object.Status && object.Status === 'Vigerend' ? 'Sinds' : 'Vanaf'

    return isActive + ' ' + textDate
}

/**
 *
 * @param {array} revisionObjects - Array containing the revisions
 * @param {null|string} leftSelect - Contains null if none is selected, else it contains the UUID that is selected
 * @param {null|string} rightSelect - Contains null if none is selected, else it contains the UUID that is selected
 * @returns
 */
function getSelectOptions(revisionObjects, leftSelect, rightSelect) {
    /**
     * Checks if an options is disabled.
     * When we select an option, we disable the previous or following options, based on the optionsType
     * @param {number} index - Index in of the item in the revisionObjects array
     * @param {string} optionsType - Indicicating if
     * @returns {boolean} indicating if the option is disabled or not
     */
    const checkIsDisabled = (index, optionsType) => {
        if (optionsType === 'left' && !rightSelect) return false
        if (optionsType === 'right' && !leftSelect) return false

        const leftSelectIndex = revisionObjects.findIndex(
            (e) => e.UUID === leftSelect
        )
        const rightSelectIndex = revisionObjects.findIndex(
            (e) => e.UUID === rightSelect
        )

        if (optionsType === 'left') {
            // Disabled if the rightSelectIndex comes after the current object index
            return index <= rightSelectIndex
        } else if (optionsType === 'right') {
            // Disabled if the leftSelectIndex comes after the current object index
            return index >= leftSelectIndex
        }
    }

    /**
     *
     * @param {array} revisionObjects - Contains the revision objects
     * @param {string} type - Indicator if this is the 'left' or 'right' element
     * @returns {array} Returns the options that we pass to the Select element
     */
    const getOptions = (revisionObjects, type) =>
        revisionObjects.map((obj, index) => {
            return {
                label: `${getValidText(obj)} (${obj.uiStatus})`,
                value: obj.UUID,
                isDisabled: checkIsDisabled(index, type),
            }
        })

    const optionsLeft = getOptions(revisionObjects, 'left')
    const optionsRight = getOptions(revisionObjects, 'right')

    return [optionsLeft, optionsRight]
}

/**
 *
 * @param {object} props
 * @param {boolean} revisionOverviewOpen - Indicating if the revision overview is open
 * @param {function} setRevisionOverviewOpen -
 * @param {object} dataObject - Contains the object of the detail page we are viewing
 * @param {array} revisionObjects - Array containing revisions of the object
 * @returns
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
            'revisionOverview-container-fixed'
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
            'revisionOverview-select-container'
        )
        const selectHeader = document.getElementById('revisionOverview-header')

        if (!selectContainer) return
        if (!selectHeader) return

        const selectWidth = selectContainer.offsetWidth
        const extraMargin = 32
        const selectHeight = selectContainer.offsetHeight + extraMargin
        const selectTop = selectContainer.getBoundingClientRect().top
        const headerBottom = selectHeader.getBoundingClientRect().bottom

        if (selectTop < 0) {
            selectContainer.classList.add('fixed', 'top-0', 'z-10', 'shadow-md')
            selectContainer.style.width = selectWidth + 'px'
            selectHeader.style.marginBottom = selectHeight + 'px'
        } else if (headerBottom > 0) {
            selectContainer.style.width = '100%'
            selectHeader.style.marginBottom = 0 + 'px'
            selectContainer.classList.remove(
                'fixed',
                'top-0',
                'z-10',
                'shadow-md'
            )
        }
    }

    React.useEffect(() => {
        revisionObjects = revisionObjects.sort(
            (a, b) =>
                new Date(b.Begin_Geldigheid) - new Date(a.Begin_Geldigheid)
        )

        const [
            optionsFromRevisionsLeft,
            optionsFromRevisionsRight,
        ] = getSelectOptions(revisionObjects, leftSelect, rightSelect)

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
    }, [leftSelect, rightSelect])

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
                    class="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                >
                    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
            </Transition>
            <div
                id="revisionOverview-container-fixed"
                onScroll={selectOnScroll}
                className={`fixed inset-0 z-10 w-full overflow-y-auto ${
                    revisionOverviewOpen ? '' : 'pointer-events-none'
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
 *
 * @param {object} children - Children component(s)
 * @returns Wrapper element
 */
const ContainerLeft = ({ children }) => (
    <div className={`w-1/2 pr-5`}>{children}</div>
)

/**
 *
 * @param {object} children - Children component(s)
 * @returns Wrapper element
 */
const ContainerRight = ({ children }) => (
    <div className={`w-1/2 pl-5`}>{children}</div>
)

/**
 *
 * @param {object} props
 * @param {object} oldObject
 * @param {object} changesObject
 * @param {object} originalObject
 * @param {object} revisionObjects
 * @returns
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
 * @param {Object} props
 * @param {Object} props.originalObject - Contains the object in its original form
 * @param {Object} props.changesObject - Contains the object with changes on the properties (e.g. Propertie: {"new": [...], "removed": [...], "same": [...]})
 * @returns Component that displays the changes of the GEO property on a Leaflet map
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
            return `Beleidskeuze '${originalObject.Titel}' is gewijzigd van gebied '${changesObject.Werkingsgebieden.removed[0].Werkingsgebied}' naar gebied '${changesObject.Werkingsgebieden.new[0].Werkingsgebied}'.`
        } else if (changesObject.Werkingsgebieden.new.length > 0) {
            return `Beleidskeuze '${originalObject.Titel}' heeft '${changesObject.Werkingsgebieden.new[0].Werkingsgebied}' als werkingsgebied gekregen.`
        } else if (changesObject.Werkingsgebieden.same.length > 0) {
            return `Beleidskeuze '${originalObject.Titel}' is niet gewijzigd, en is gekoppeld aan '${changesObject.Werkingsgebieden.same[0].Werkingsgebied}'.`
        } else if (changesObject.Werkingsgebieden.removed.length > 0) {
            return `Beleidskeuze '${originalObject.Titel}' was gekoppeld aan gebied '${changesObject.Werkingsgebieden.removed[0].Werkingsgebied}', maar deze koppeling is verwijderd.`
        } else {
            // The leftSelect value and the rightSelect value both didn't have a werkingsgebied
            return `Beleidskeuze '${originalObject.Titel}' heeft voor beidde geselecteerde objecten geen werkingsgebied`
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
 *
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
 *
 * @param {object} props
 * @param {string} props.title - Title that is displayed with the horizontal rule
 * @param {boolean} props.singleTitle - boolean indicating if the component only needs to render one title
 * @returns A component that displays a divider block containing one or two titles
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
 *
 * @param {object} props
 * @param {string} props.title - Title of the object containing HTML in order to display the changes.
 * @returns An Header 2 Title with inner HTML
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
 *
 * @param {object} props
 * @param {object} props.textContent - Contains the text that is set with innerHTML. The HTML contains the changes.
 * @param {object} props.label - Contains the label
 * @returns A paragraph with an optional label above it
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
                    __html: textContent ? textContent : 'Er is geen inhoud',
                }}
            />
        </div>
    )
}

/**
 *
 * @param {object} props
 * @param {object} props.object - Contains the object we want the valid text from
 * @param {array} props.revisionObjects - Contains the previous valid objects. We need this because these objects contain the uiStatus property. This property indicates if an object is archived or not.
 * @returns The text indicating the period of validity of the object
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
        if (!object['Begin_Geldigheid'])
            return 'Er is nog geen begin geldigheid'

        const formatDate = (date) =>
            format(new Date(date), 'd MMMM yyyy', {
                locale: nlLocale,
            })

        const dateStart = formatDate(object['Begin_Geldigheid'])
        const isCurrentlyVigerend = uiStatus && uiStatus === 'Vigerend'

        if (isCurrentlyVigerend) {
            return `Vigerend vanaf ${dateStart} tot heden`
        } else if (object.Begin_Geldigheid === '1753-01-01T00:00:00Z') {
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
 *
 * @param {object} props
 * @param {string} props.label - Label to display above the section
 * @param {object} props.object - The object to display belangen of
 * @param {string} props.type - String indicating the type of Belang
 * @param {boolean} props.containsChanges - Inidicating if the object contains changes
 * @param {string} props.placeholder - Placeholder when there are no connections
 * @returns A section to display the 'Belangen' of an object
 */
const Belangen = ({ label, object, type, containsChanges, placeholder }) => {
    /**
     *
     * @param {boolean} containsChanges
     * @param {object} object
     * @param {string} type
     * @returns
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
     *
     * @param {object} object - Contains the object we want get the style for
     * @returns
     */
    const getContainerStyle = (object) =>
        object.changeType === 'removed'
            ? { backgroundColor: '#f4c9c6', textDecoration: 'line-through' } // Removed - Red
            : object.changeType === 'new'
            ? { backgroundColor: '#e5f0ef' } // New     - Green
            : { backgroundColor: '#f2f2f7' } // Default - Purple

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
 *
 * @param {object} props
 * @param {object} props.originalObject - Contains the original object
 * @param {object} props.objectChanges - Contains the object that has changes
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
                                            Er zijn nog geen koppelingen vanuit{' '}
                                            {property.toLowerCase()}
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
                                            {property.toLowerCase()} heeft nog
                                            geen koppelingen
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
 *
 * @param {object} props
 * @param {string} props.property - Name of the property
 * @param {object} props.connection - Object containing the connection
 * @returns A list item that displays the connecting (and potentially the changes to it)
 */
const ConnectionListItem = ({ property, connection }) => {
    /**
     * Gets style to indicate changes to the object
     */
    const textStyle =
        connection.changeType === 'removed'
            ? { backgroundColor: '#f4c9c6', textDecoration: 'line-through' } // Removed - Red
            : connection.changeType === 'new'
            ? { backgroundColor: '#e5f0ef' } // New - Green
            : {} // Default

    return (
        <li className="relative block mt-1 text-sm text-gray-800">
            <div className="inline-flex items-center group">
                <span>
                    <span
                        className={`inline-block w-3 h-3 mr-2 rounded-full`}
                        style={{
                            backgroundColor:
                                connectionPropertiesColors[property].hex,
                        }}
                    />
                    <span className="px-1" style={textStyle}>
                        {connection.Object?.Titel}
                    </span>
                </span>
                {connection.Koppeling_Omschrijving &&
                connection.Koppeling_Omschrijving !== '' ? (
                    <div
                        class="absolute hidden group-hover:block top-0 pt-3 mt-5 z-20 cursor-default tooltip-content pb-6 px-4"
                        style={{
                            left: '5px',
                        }}
                    >
                        <div
                            id={connection.Object?.UUID}
                            class="px-5 py-3 rounded bg-gray-900 text-white shadow leading-7 break-words whitespace-pre-line"
                        >
                            {connection.Koppeling_Omschrijving}
                        </div>
                    </div>
                ) : null}
            </div>
        </li>
    )
}

const connectionProperties = [
    'Ambities',
    'Beleidsregels',
    'Beleidsprestaties',
    'Maatregelen',
    'Beleidsdoelen',
    'Themas',
    'Verordeningen',
]

// https://tailwindcss.com/docs/customizing-colors#default-color-palette
const connectionPropertiesColors = {
    Ambities: {
        hex: '#ED8936',
        class: 'orange-500',
    },
    Beleidsregels: {
        hex: '#718096',
        class: 'gray-600',
    },
    Beleidsprestaties: {
        hex: '#ECC94B',
        class: 'yellow-500',
    },
    Maatregelen: {
        hex: '#48BB78',
        class: 'green-500',
    },
    Beleidsdoelen: {
        hex: '#3182CE',
        class: 'blue-600',
    },
    Themas: {
        hex: '#38B2AC',
        class: 'teal-500',
    },
    Verordeningen: {
        hex: '#E53E3E',
        class: 'red-600',
    },
    Beleidskeuzes: {
        hex: '#805AD5',
        class: 'purple-600',
    },
}

export default PopupRevisionOverview
