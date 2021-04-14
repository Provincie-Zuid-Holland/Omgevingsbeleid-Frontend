import React from 'react'
import { Transition } from '@headlessui/react'
import { format, isDate } from 'date-fns'
import nlLocale from 'date-fns/locale/nl'
import { useParams } from 'react-router-dom'
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

const getVigerendText = (dataObject) => {
    // Toevoegen van de datum in de revisie: "Vigerend van <datum inwerkingtreding> tot <datum uitwerkingtreding>" voor gearchiveerde beleidskeuzes.
    // Voor vigerende beleidskeuzes: "Vigerend van <datum inwerkingtreding> tot heden"
    if (!dataObject['Begin_Geldigheid'])
        return 'Er is nog geen begin geldigheid'

    const textDate = format(
        new Date(dataObject['Begin_Geldigheid']),
        'd MMMM yyyy',
        {
            locale: nlLocale,
        }
    )
    const isActive =
        dataObject.Status && dataObject.Status === 'Vigerend'
            ? 'Sinds'
            : 'Vanaf'

    return isActive + ' ' + textDate
}

function makeSelection(objects, leftSelect, rightSelect) {
    const leftSelectIndex = objects.findIndex((e) => e.UUID === leftSelect)
    const rightSelectIndex = objects.findIndex((e) => e.UUID === rightSelect)

    // The left select can only contain properties that are
    const checkIsDisabled = (index, optionsType) => {
        if (optionsType === 'left' && !rightSelect) return false
        if (optionsType === 'right' && !leftSelect) return false

        if (optionsType === 'left') {
            // Disabled if the rightSelectIndex comes after the current object index
            return index <= rightSelectIndex
        } else if (optionsType === 'right') {
            // Disabled if the leftSelectIndex comes after the current object index
            return index >= leftSelectIndex
        }
    }

    const getObjects = (objects, type) =>
        objects.map((obj, index) => {
            return {
                label: `${getVigerendText(obj)} (${obj.uiStatus})`,
                value: obj.UUID,
                isDisabled: checkIsDisabled(index, type),
            }
        })

    const objectsLeft = getObjects(objects, 'left')
    const objectsRight = getObjects(objects, 'right')

    return [objectsLeft, objectsRight]
}

const PopupRevisieoverzicht = ({
    revisieoverzichtOpen,
    setRevisieoverzichtOpen,
    revisieObjecten,
    dataObject,
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
            'revisieoverzicht-container-fixed'
        )

        if (fixedContainerEl.scrollWidth <= event.clientX) return

        setRevisieoverzichtOpen(false)
    })

    useCloseWithEscapeKey(innerContainer, () => {
        setRevisieoverzichtOpen(false)
    })

    // Reset when the user opens the window
    React.useLayoutEffect(() => {
        if (revisieoverzichtOpen) {
            setLeftSelect(null)
            setRightSelect(null)
            setChangesFromApi(null)
        }
    }, [revisieoverzichtOpen])

    React.useEffect(() => {
        if (revisieoverzichtOpen) {
            setBodyLock(true)
        } else {
            setTimeout(() => {
                setBodyLock(false)
            }, 110) // duration of the Transition + 1ms margin, this prevents two scrollbars
        }
    }, [revisieoverzichtOpen])

    const selectOnScroll = () => {
        const selectContainer = document.getElementById(
            'revisieoverzicht-select-container'
        )
        const selectHeader = document.getElementById('revisieoverzicht-header')

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
        revisieObjecten = revisieObjecten.sort(
            (a, b) =>
                new Date(b.Begin_Geldigheid) - new Date(a.Begin_Geldigheid)
        )

        const [
            optionsFromRevisionsLeft,
            optionsFromRevisionsRight,
        ] = makeSelection(revisieObjecten, leftSelect, rightSelect)

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
                show={revisieoverzichtOpen}
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
                id="revisieoverzicht-container-fixed"
                onScroll={selectOnScroll}
                className={`fixed inset-0 z-10 w-full overflow-y-auto ${
                    revisieoverzichtOpen ? '' : 'pointer-events-none'
                }`}
            >
                <Transition
                    show={revisieoverzichtOpen}
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
                                id="revisieoverzicht-header"
                            >
                                <div
                                    onClick={() => {
                                        setRevisieoverzichtOpen(false)
                                    }}
                                    className="absolute top-0 right-0 px-3 py-2 mt-8 mr-8 text-gray-600 transition-colors duration-100 ease-in cursor-pointer hover:text-gray-800"
                                    id={`close-revisieoverzicht`}
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
                                id="revisieoverzicht-select-container"
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
                                        revisieObjecten={revisieObjecten}
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
                                                revisieObjecten={
                                                    revisieObjecten
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

const ContainerLeft = ({ children }) => (
    <div className={`w-1/2 pr-5`}>{children}</div>
)

const ContainerRight = ({ children }) => (
    <div className={`w-1/2 pl-5`}>{children}</div>
)

const ChangeContainer = ({
    oldObject,
    changesObject,
    originalObject,
    revisieObjecten,
}) => {
    const { user } = React.useContext(UserContext)
    return (
        <div className="min-h-screen pb-16">
            <div className="mt-8">
                <ContainerMain>
                    {/* Title */}
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

                    {/* Date */}
                    <ContainerLeft>
                        <ValidText
                            revisieObjecten={revisieObjecten}
                            dataObject={oldObject}
                        />
                    </ContainerLeft>

                    <ContainerRight>
                        <ValidText
                            revisieObjecten={revisieObjecten}
                            dataObject={changesObject}
                        />
                    </ContainerRight>

                    {/* Omschrijving Keuze */}
                    <ContainerLeft>
                        <Text
                            content={oldObject.Omschrijving_Keuze}
                            label="Wat wil de provincie bereiken?"
                        />
                    </ContainerLeft>

                    <ContainerRight>
                        <Text
                            content={changesObject.Omschrijving_Keuze}
                            label="Wat wil de provincie bereiken?"
                        />
                    </ContainerRight>

                    {/* Aanleiding */}
                    <ContainerLeft>
                        <Text
                            content={oldObject.Aanleiding}
                            label="Aanleiding"
                        />
                    </ContainerLeft>

                    <ContainerRight>
                        <Text
                            content={changesObject.Aanleiding}
                            label="Aanleiding"
                        />
                    </ContainerRight>

                    {/* Provinciaal Belang */}
                    <ContainerLeft>
                        <Text
                            content={oldObject.Provinciaal_Belang}
                            label="Provinciaal Belang"
                        />
                    </ContainerLeft>

                    <ContainerRight>
                        <Text
                            content={changesObject.Provinciaal_Belang}
                            label="Provinciaal Belang"
                        />
                    </ContainerRight>

                    {/* Omschrijving Toelichting */}
                    <ContainerLeft>
                        <Text
                            content={oldObject.Omschrijving_Werking}
                            label="Toelichting"
                        />
                    </ContainerLeft>

                    <ContainerRight>
                        <Text
                            content={changesObject.Omschrijving_Werking}
                            label="Toelichting"
                        />
                    </ContainerRight>

                    {/* Nationaal Belangen */}
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

                    {/* Wettelijke Taak & Bevoegdheid */}
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

                    {/* </ContainerLeft>

                    <ContainerRight>
                        <RelatiesKoppelingenTekstueel
                            beleidskeuze={changesObject}
                            containsChanges={true}
                        />
                    </ContainerRight> */}
                </ContainerMain>
            </div>
            <div>
                <DividerWithTitle title={`Koppelingen & Relaties`} />
                <RelatiesKoppelingenTekstueel
                    objectOld={oldObject}
                    objectChanges={changesObject}
                />
            </div>
            <div className="mt-10">
                <DividerWithTitle title={`Werkingsgebied`} singleTitle={true} />
                <ContainerMain>
                    <Werkingsgebied
                        originalObject={originalObject}
                        oldObject={oldObject}
                        changesObject={changesObject}
                    />
                </ContainerMain>
            </div>
        </div>
    )
}

const Werkingsgebied = ({ originalObject, oldObject, changesObject }) => {
    const getTitleOfNewWerkingsgebied = () => {
        // We get this werkingsgebied from the changesObject.
        // This means the 'Werkingsgebieden' value will contain an object with the 'new', 'removed' and 'same' properties
        // We first check 'new', if the array is empty we check 'same'. If that is also empty we know that the rightSelect state value has no werkingsgebied
        // If that is the case, we return a unique string to indicate that, else we set the title
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

    const getGebieden = () => {
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

    const title = getTitleOfNewWerkingsgebied()
    const [gebiedenUUIDS, gebiedenChanges] = getGebieden()

    return (
        <div className="w-full">
            <p
                className={`text-gray-800 mt-4 leading-7 break-words w-full whitespace-pre-line`}
            >
                {title}
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
                <LegendaItem color="#E74C3C">
                    Verwijderd werkingsgebied
                </LegendaItem>
                <LegendaItem color="#2ECC71">
                    Toegevoegd werkingsgebied
                </LegendaItem>
                <LegendaItem color="#2980B9">
                    Ongewijzigd werkingsgebied
                </LegendaItem>
            </ul>
        </div>
    )
}

const LegendaItem = ({ color, children }) => {
    return (
        <li className="flex items-center mt-1">
            <span
                style={{ backgroundColor: color }}
                className="inline-block w-3 h-3 mr-2 rounded-full"
            />
            <span>{children}</span>
        </li>
    )
}

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

const Title = ({ title }) => {
    return (
        <h2
            className="mt-2 text-2xl font-semibold text-primary-super-dark"
            dangerouslySetInnerHTML={{ __html: title }}
        />
    )
}

const Text = ({ content, label }) => {
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
                    __html: content ? content : 'Er is geen inhoud',
                }}
            />
        </div>
    )
}

const ValidText = ({ dataObject, revisieObjecten }) => {
    if (!revisieObjecten) return null

    revisieObjecten = revisieObjecten.sort(
        (a, b) => new Date(b.Begin_Geldigheid) - new Date(a.Begin_Geldigheid)
    )

    const uiStatus = revisieObjecten.find((e) => e.UUID === dataObject.UUID)
        .uiStatus

    const getTextValidFromSince = (dataObject) => {
        // Toevoegen van de datum in de revisie: "Vigerend van <datum inwerkingtreding> tot <datum uitwerkingtreding>" voor gearchiveerde beleidskeuzes.
        // Voor vigerende beleidskeuzes: "Vigerend van <datum inwerkingtreding> tot heden"
        if (!dataObject['Begin_Geldigheid'])
            return 'Er is nog geen begin geldigheid'

        const formatDate = (date) =>
            format(new Date(date), 'd MMMM yyyy', {
                locale: nlLocale,
            })

        const dateStart = formatDate(dataObject['Begin_Geldigheid'])

        const getDateFromNextVigerendObject = () => {
            const indexOfCurrentObj = revisieObjecten.findIndex(
                (e) => e.UUID === dataObject.UUID
            )

            const endDateOfNextVigerend =
                indexOfCurrentObj !== 0 &&
                revisieObjecten[indexOfCurrentObj - 1] &&
                revisieObjecten[indexOfCurrentObj - 1].Begin_Geldigheid
                    ? revisieObjecten[indexOfCurrentObj - 1].Begin_Geldigheid
                    : null

            if (endDateOfNextVigerend) {
                return format(endDateOfNextVigerend)
            } else {
                return null
            }
        }

        console.log(dataObject['Eind_Geldigheid'])

        const dateEnd = isDate(new Date(dataObject['Eind_Geldigheid']))
            ? formatDate(dataObject['Eind_Geldigheid'])
            : getDateFromNextVigerendObject()

        const isCurrentlyVigerend = uiStatus && uiStatus === 'Vigerend'
        const isArchived = uiStatus && uiStatus === 'Gearchiveerd'

        if (isCurrentlyVigerend) {
            return `Vigerend vanaf ${dateStart} tot heden`
        } else if (dataObject.Begin_Geldigheid === '1753-01-01T00:00:00Z') {
            return `Vigerend tot ${dateEnd}`
        } else if (dataObject.Eind_Geldigheid !== '9999-12-31T23:59:59Z') {
            return `Vigerend vanaf ${dateStart}`
        } else if (isArchived) {
            const dateEndText = dateEnd ? `tot ${dateEnd}` : ``
            return `Vigerend vanaf ${dateStart} ${dateEndText}`
        } else {
            return `Vigerend vanaf ${dateStart}`
        }
    }

    const validText = getTextValidFromSince(dataObject)

    return (
        <span className="inline-block my-3 text-base text-gray-600 ">
            {validText}
        </span>
    )
}

const Belangen = ({ label, object, type, containsChanges, placeholder }) => {
    const getBelangen = (containsChanges, object, type) => {
        if (!containsChanges) {
            return object.Belangen.filter((e) => e.Type === type).map(
                (e) => e.Object
            )
        } else {
            const belangen = []
            Object.keys(object.Belangen).forEach((key) =>
                object.Belangen[key].forEach((belang) => {
                    belangen.push({ ...belang.Object, changeType: key })
                })
            )

            return belangen
        }
    }

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
                    return <BelangenBlock object={object} />
                })
            ) : (
                <span className="italic text-gray-600">{placeholder}</span>
            )}
        </div>
    )
}

const BelangenBlock = ({ object }) => {
    const containerStyle =
        object.changeType === 'removed'
            ? { backgroundColor: '#f4c9c6', textDecoration: 'line-through' } // Red
            : object.changeType === 'new'
            ? { backgroundColor: '#e5f0ef' } // Green
            : { backgroundColor: '#f2f2f7' } // Purple

    return (
        <div className={`p-5 mb-4 rounded-md`} style={containerStyle}>
            <span className="block mb-1 font-bold m-color-puple">
                {object.Titel}
            </span>
            <p className="w-full leading-7 text-gray-800 break-words whitespace-pre-line">
                {object.Omschrijving}
            </p>
        </div>
    )
}

function RelatiesKoppelingenTekstueel({
    objectOld,
    objectChanges,
    beleidsRelaties,
}) {
    if (!objectOld || !objectChanges) return

    const getValuesOf = (property, obj, containsChanges) => {
        if (!containsChanges && obj[property]) return obj[property]
        if (
            (!containsChanges && !obj[property]) ||
            (containsChanges && !obj[property])
        )
            return []

        // Else we need to get the values from the changes properties ('removed', 'same', etc.)
        const values = []
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
                const valuesOld = getValuesOf(property, objectOld, false)
                const valuesChanges = getValuesOf(property, objectChanges, true)
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
                                            <ListItem
                                                connection={connection.Object}
                                                titel={connection.Object.Titel}
                                                omschrijving={
                                                    connection.Object
                                                        .Omschrijving
                                                }
                                                property={property}
                                                UUID={connection.Object.UUID}
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
                                    {valuesChanges && valuesOld.length > 0 ? (
                                        valuesChanges.map((connection) => (
                                            <ListItem
                                                connection={connection.Object}
                                                titel={connection.Object.Titel}
                                                omschrijving={
                                                    connection.Object
                                                        .Omschrijving
                                                }
                                                property={property}
                                                UUID={connection.Object.UUID}
                                            />
                                        ))
                                    ) : (
                                        <span className="mt-2 italic text-gray-600">
                                            {property} heeft nog geen
                                            koppelingen
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

const ContainerMain = ({ children }) => {
    return (
        <div className="flex flex-wrap justify-between px-10 mt-2">
            {children}
        </div>
    )
}

const ListItem = ({ property, UUID, titel, omschrijving, connection }) => {
    const textStyle =
        connection.changeType === 'removed'
            ? { backgroundColor: '#f4c9c6', textDecoration: 'line-through' } // Red
            : connection.changeType === 'new'
            ? { backgroundColor: '#e5f0ef' } // Green
            : {}

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
                        {connection.Titel}
                    </span>
                </span>
                {connection.Omschrijving && connection.Omschrijving !== '' ? (
                    <div
                        class="absolute hidden group-hover:block top-0 pt-3 mt-5 z-20 cursor-default tooltip-content pb-6 px-4"
                        style={{
                            left: '5px',
                        }}
                    >
                        <div
                            id={UUID}
                            class="px-5 py-3 rounded bg-gray-900 text-white shadow leading-7 break-words whitespace-pre-line"
                        >
                            {connection.Omschrijving}
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

export default PopupRevisieoverzicht
