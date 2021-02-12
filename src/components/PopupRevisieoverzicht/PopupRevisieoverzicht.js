import React from 'react'
import { Transition } from '@headlessui/react'
import { format } from 'date-fns'
import nlLocale from 'date-fns/locale/nl'
import { useParams } from 'react-router-dom'
import { faTimes } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from 'react-select'

import axios from '../../API/axios'

import LoaderSpinner from '../LoaderSpinner'

import useClickOutsideContainer from './../../utils/useClickOutsideContainer'
import useCloseWithEscapeKey from './../../utils/useCloseWithEscapeKey'
import useLockBodyScroll from './../../utils/useLockBodyScroll'

const getVigerendText = (dataObject) => {
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
            return rightSelectIndex <= index
        } else if (optionsType === 'right') {
            // Disabled if the leftSelectIndex comes after the current object index
            return leftSelectIndex >= index
        }
    }

    const getObjects = (objects, type) =>
        objects.map((obj, index) => {
            return {
                label: `${obj.Status} (${getVigerendText(obj)})`,
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

    const [changesFromApi, setChangesFromApi] = React.useState(apiResponse)
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

    React.useEffect(() => {
        if (revisieoverzichtOpen) {
            setBodyLock(true)
        } else {
            setTimeout(() => {
                setBodyLock(false)
            }, 110) // duration of the Transition + 1ms margin, this prevents two scrollbars
        }
    }, [revisieoverzichtOpen])

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

        console.log('Do API Request!')

        // axios
        //     .get(`changes/beleidskeuzes/${leftSelect}/${rightSelect}`)
        //     .then((res) => console.log(res))
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
                        <div className="relative z-50 w-full overflow-hidden text-gray-700 bg-white rounded-md shadow-lg">
                            <div className="block w-full p-8 pb-0 bg-gray-100">
                                <div
                                    onClick={() =>
                                        setRevisieoverzichtOpen(false)
                                    }
                                    className="absolute top-0 right-0 px-3 py-2 mt-5 mr-6 text-gray-600 transition-colors duration-100 ease-in cursor-pointer hover:text-gray-800"
                                    id={`close-revisieoverzicht`}
                                >
                                    <FontAwesomeIcon
                                        className="text-lg"
                                        icon={faTimes}
                                    />
                                </div>
                                <h2 className="block mb-1 text-xl font-semibold tracking-wide m-color-puple">
                                    Revisieoverzicht
                                </h2>
                                <p className="w-full leading-7 text-gray-800 break-words whitespace-pre-line">
                                    Vergelijk de versies van de Beleidskeuze “
                                    {dataObject.Titel}”.
                                </p>
                            </div>
                            <div
                                id="revisieoverzicht-select-container"
                                className="block w-full px-8 pt-5 pb-6 bg-gray-100 border-b border-gray-300"
                            >
                                <div className="flex items-center justify-between">
                                    <Select
                                        className="w-1/2 mr-4 shadow"
                                        id={`revisie-from`}
                                        name="revisie-form-from"
                                        onChange={(e) => setLeftSelect(e.value)}
                                        options={optionsLeft}
                                        placeholder={`Selecteer een beleidskeuze...`}
                                    />
                                    <Select
                                        className="w-1/2 ml-4 shadow"
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
                            <div className="w-full p-8 bg-white">
                                {isLoading ? (
                                    <div className="flex items-center justify-center w-full h-64 text-xl text-gray-600">
                                        <LoaderSpinner />
                                    </div>
                                ) : (
                                    <Content changesFromApi={changesFromApi} />
                                )}
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </React.Fragment>
    )
}

const Content = ({ changesFromApi }) => {
    return (
        <div className="flex justify-between h-screen ">
            <div className="w-1/2 h-64 mr-4">
                <span className="block text-lg font-bold opacity-25 text-primary-super-dark">
                    Beleidskeuze
                </span>
                <h3 className="mt-2 text-3xl font-semibold text-primary-super-dark ">
                    Titel van de beleidskeuze
                </h3>
            </div>
            <div className="w-1/2 h-64 ml-4">
                <span className="block text-lg font-bold opacity-25 text-primary-super-dark">
                    Beleidskeuze
                </span>
            </div>
        </div>
    )
}

const apiResponse = {
    changes: {
        Aanleiding: 'string',
        Aanpassing_Op: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        Afweging: 'string',
        Ambities: {
            new: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Omschrijving: 'string',
                    Titel: 'string',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Weblink: 'string',
                },
            ],
            removed: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Omschrijving: 'string',
                    Titel: 'string',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Weblink: 'string',
                },
            ],
            same: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Omschrijving: 'string',
                    Titel: 'string',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Weblink: 'string',
                },
            ],
        },
        Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
        Belangen: {
            new: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Omschrijving: 'string',
                    Titel: 'string',
                    Type: 'Nationaal Belang',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Weblink: 'string',
                },
            ],
            removed: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Omschrijving: 'string',
                    Titel: 'string',
                    Type: 'Nationaal Belang',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Weblink: 'string',
                },
            ],
            same: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Omschrijving: 'string',
                    Titel: 'string',
                    Type: 'Nationaal Belang',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Weblink: 'string',
                },
            ],
        },
        Beleidsdoelen: {
            new: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Omschrijving: 'string',
                    Titel: 'string',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Weblink: 'string',
                },
            ],
            removed: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Omschrijving: 'string',
                    Titel: 'string',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Weblink: 'string',
                },
            ],
            same: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Omschrijving: 'string',
                    Titel: 'string',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Weblink: 'string',
                },
            ],
        },
        Beleidsprestaties: {
            new: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Omschrijving: 'string',
                    Titel: 'string',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Weblink: 'string',
                },
            ],
            removed: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Omschrijving: 'string',
                    Titel: 'string',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Weblink: 'string',
                },
            ],
            same: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Omschrijving: 'string',
                    Titel: 'string',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Weblink: 'string',
                },
            ],
        },
        Beleidsregels: {
            new: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Omschrijving: 'string',
                    Titel: 'string',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Weblink: 'string',
                },
            ],
            removed: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Omschrijving: 'string',
                    Titel: 'string',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Weblink: 'string',
                },
            ],
            same: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Omschrijving: 'string',
                    Titel: 'string',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Weblink: 'string',
                },
            ],
        },
        Besluitnummer: 'string',
        Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        Created_Date: '2021-02-10T12:09:53.638Z',
        Eigenaar_1: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        Eigenaar_2: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
        ID: 0,
        Maatregelen: {
            new: [
                {
                    Aanpassing_Op: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Gebied: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Gebied_Duiding: 'Indicatief',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Omschrijving: 'string',
                    Status: 'Definitief ontwerp GS',
                    Tags: 'string',
                    Titel: 'string',
                    Toelichting: 'string',
                    Toelichting_Raw: 'string',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Weblink: 'string',
                },
            ],
            removed: [
                {
                    Aanpassing_Op: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Gebied: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Gebied_Duiding: 'Indicatief',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Omschrijving: 'string',
                    Status: 'Definitief ontwerp GS',
                    Tags: 'string',
                    Titel: 'string',
                    Toelichting: 'string',
                    Toelichting_Raw: 'string',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Weblink: 'string',
                },
            ],
            same: [
                {
                    Aanpassing_Op: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Gebied: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Gebied_Duiding: 'Indicatief',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Omschrijving: 'string',
                    Status: 'Definitief ontwerp GS',
                    Tags: 'string',
                    Titel: 'string',
                    Toelichting: 'string',
                    Toelichting_Raw: 'string',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Weblink: 'string',
                },
            ],
        },
        Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        Modified_Date: '2021-02-10T12:09:53.638Z',
        Omschrijving_Keuze: 'string',
        Omschrijving_Werking: 'string',
        Opdrachtgever: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        Portefeuillehouder_1: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        Portefeuillehouder_2: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        Provinciaal_Belang: 'string',
        Status: 'Definitief ontwerp GS',
        Tags: 'string',
        Themas: {
            new: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Omschrijving: 'string',
                    Titel: 'string',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Weblink: 'string',
                },
            ],
            removed: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Omschrijving: 'string',
                    Titel: 'string',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Weblink: 'string',
                },
            ],
            same: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Omschrijving: 'string',
                    Titel: 'string',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Weblink: 'string',
                },
            ],
        },
        Titel: 'string',
        UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        Verordeningen: {
            new: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eigenaar_1: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Eigenaar_2: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Gebied: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    ID: 0,
                    Inhoud: 'string',
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Opdrachtgever: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Portefeuillehouder_1:
                        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Portefeuillehouder_2:
                        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Status: 'string',
                    Titel: 'string',
                    Type: 'Hoofdstuk',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Volgnummer: 'string',
                    Weblink: 'string',
                },
            ],
            removed: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eigenaar_1: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Eigenaar_2: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Gebied: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    ID: 0,
                    Inhoud: 'string',
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Opdrachtgever: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Portefeuillehouder_1:
                        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Portefeuillehouder_2:
                        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Status: 'string',
                    Titel: 'string',
                    Type: 'Hoofdstuk',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Volgnummer: 'string',
                    Weblink: 'string',
                },
            ],
            same: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eigenaar_1: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Eigenaar_2: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Gebied: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    ID: 0,
                    Inhoud: 'string',
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    Opdrachtgever: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Portefeuillehouder_1:
                        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Portefeuillehouder_2:
                        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Status: 'string',
                    Titel: 'string',
                    Type: 'Hoofdstuk',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Volgnummer: 'string',
                    Weblink: 'string',
                },
            ],
        },
        Weblink: 'string',
        Werkingsgebieden: {
            new: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Werkingsgebied: 'string',
                    symbol: 'string',
                },
            ],
            removed: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Werkingsgebied: 'string',
                    symbol: 'string',
                },
            ],
            same: [
                {
                    Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                    Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Created_Date: '2021-02-10T12:09:53.638Z',
                    Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                    ID: 0,
                    Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Modified_Date: '2021-02-10T12:09:53.638Z',
                    UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    Werkingsgebied: 'string',
                    symbol: 'string',
                },
            ],
        },
    },
    old: {
        Aanleiding: 'string',
        Aanpassing_Op: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        Afweging: 'string',
        Ambities: [
            {
                Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Created_Date: '2021-02-10T12:09:53.638Z',
                Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                ID: 0,
                Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Modified_Date: '2021-02-10T12:09:53.638Z',
                Omschrijving: 'string',
                Titel: 'string',
                UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Weblink: 'string',
            },
        ],
        Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
        Belangen: [
            {
                Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Created_Date: '2021-02-10T12:09:53.638Z',
                Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                ID: 0,
                Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Modified_Date: '2021-02-10T12:09:53.638Z',
                Omschrijving: 'string',
                Titel: 'string',
                Type: 'Nationaal Belang',
                UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Weblink: 'string',
            },
        ],
        Beleidsdoelen: [
            {
                Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Created_Date: '2021-02-10T12:09:53.638Z',
                Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                ID: 0,
                Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Modified_Date: '2021-02-10T12:09:53.638Z',
                Omschrijving: 'string',
                Titel: 'string',
                UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Weblink: 'string',
            },
        ],
        Beleidsprestaties: [
            {
                Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Created_Date: '2021-02-10T12:09:53.638Z',
                Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                ID: 0,
                Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Modified_Date: '2021-02-10T12:09:53.638Z',
                Omschrijving: 'string',
                Titel: 'string',
                UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Weblink: 'string',
            },
        ],
        Beleidsregels: [
            {
                Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Created_Date: '2021-02-10T12:09:53.638Z',
                Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                ID: 0,
                Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Modified_Date: '2021-02-10T12:09:53.638Z',
                Omschrijving: 'string',
                Titel: 'string',
                UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Weblink: 'string',
            },
        ],
        Besluitnummer: 'string',
        Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        Created_Date: '2021-02-10T12:09:53.638Z',
        Eigenaar_1: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        Eigenaar_2: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
        ID: 0,
        Maatregelen: [
            {
                Aanpassing_Op: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Created_Date: '2021-02-10T12:09:53.638Z',
                Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                Gebied: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Gebied_Duiding: 'Indicatief',
                ID: 0,
                Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Modified_Date: '2021-02-10T12:09:53.638Z',
                Omschrijving: 'string',
                Status: 'Definitief ontwerp GS',
                Tags: 'string',
                Titel: 'string',
                Toelichting: 'string',
                Toelichting_Raw: 'string',
                UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Weblink: 'string',
            },
        ],
        Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        Modified_Date: '2021-02-10T12:09:53.638Z',
        Omschrijving_Keuze: 'string',
        Omschrijving_Werking: 'string',
        Opdrachtgever: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        Portefeuillehouder_1: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        Portefeuillehouder_2: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        Provinciaal_Belang: 'string',
        Status: 'Definitief ontwerp GS',
        Tags: 'string',
        Themas: [
            {
                Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Created_Date: '2021-02-10T12:09:53.638Z',
                Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                ID: 0,
                Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Modified_Date: '2021-02-10T12:09:53.638Z',
                Omschrijving: 'string',
                Titel: 'string',
                UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Weblink: 'string',
            },
        ],
        Titel: 'string',
        UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        Verordeningen: [
            {
                Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Created_Date: '2021-02-10T12:09:53.638Z',
                Eigenaar_1: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Eigenaar_2: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                Gebied: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                ID: 0,
                Inhoud: 'string',
                Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Modified_Date: '2021-02-10T12:09:53.638Z',
                Opdrachtgever: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Portefeuillehouder_1: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Portefeuillehouder_2: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Status: 'string',
                Titel: 'string',
                Type: 'Hoofdstuk',
                UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Volgnummer: 'string',
                Weblink: 'string',
            },
        ],
        Weblink: 'string',
        Werkingsgebieden: [
            {
                Begin_Geldigheid: '2021-02-10T12:09:53.638Z',
                Created_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Created_Date: '2021-02-10T12:09:53.638Z',
                Eind_Geldigheid: '2021-02-10T12:09:53.638Z',
                ID: 0,
                Modified_By: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Modified_Date: '2021-02-10T12:09:53.638Z',
                UUID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                Werkingsgebied: 'string',
                symbol: 'string',
            },
        ],
    },
}

export default PopupRevisieoverzicht
