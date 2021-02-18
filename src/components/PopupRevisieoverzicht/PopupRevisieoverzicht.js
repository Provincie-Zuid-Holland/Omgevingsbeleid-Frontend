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

        axios
            .get(`changes/beleidskeuzes/${leftSelect}/${rightSelect}`)
            .then((res) => {
                setChangesFromApi(apiResponse)
                console.log(apiResponse)
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
                            <div className="block w-full p-10 pb-0 bg-gray-100">
                                <div
                                    onClick={() =>
                                        setRevisieoverzichtOpen(false)
                                    }
                                    className="absolute top-0 right-0 px-3 py-2 mt-8 mr-8 text-gray-600 transition-colors duration-100 ease-in cursor-pointer hover:text-gray-800"
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
                            <div className="w-full bg-white">
                                {isLoading ? (
                                    <div className="flex items-center justify-center w-full h-64 text-xl text-gray-600">
                                        <LoaderSpinner />
                                    </div>
                                ) : (
                                    <ChangeContainer
                                        oldObject={changesFromApi.old}
                                        changesObject={changesFromApi.changes}
                                        marginRight={true}
                                    />
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

const ChangeContainer = ({ oldObject, changesObject, marginRight }) => {
    return (
        <div className="min-h-screen">
            <div className="flex flex-wrap justify-between p-10">
                {/* Title */}
                <ContainerLeft>
                    <span className="block text-lg font-bold opacity-25 text-primary-super-dark">
                        Beleidskeuze
                    </span>
                    <Title title={oldObject.Title} />
                </ContainerLeft>

                <ContainerRight>
                    <span className="block text-lg font-bold opacity-25 text-primary-super-dark">
                        Beleidskeuze
                    </span>
                    <Title title={changesObject.Title} />
                </ContainerRight>

                {/* Date */}
                <ContainerLeft>
                    <ValidText dataObject={oldObject} />
                </ContainerLeft>

                <ContainerRight>
                    <ValidText dataObject={changesObject} />
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

                {/* Omschrijving Werking */}
                <ContainerLeft>
                    <Text
                        content={oldObject.Omschrijving_Werking}
                        label="Werking"
                    />
                </ContainerLeft>

                <ContainerRight>
                    <Text
                        content={changesObject.Omschrijving_Werking}
                        label="Werking"
                    />
                </ContainerRight>

                {/* Aanleiding */}
                <ContainerLeft>
                    <Text content={oldObject.Aanleiding} label="Aanleiding" />
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

                {/* Koppelingen & Relaties */}
                <ContainerLeft>
                    <RelatiesKoppelingenTekstueel beleidskeuze={oldObject} />
                </ContainerLeft>

                <ContainerRight>
                    <RelatiesKoppelingenTekstueel
                        beleidskeuze={changesObject}
                        containsChanges={true}
                    />
                </ContainerRight>
            </div>
        </div>
    )
}

const Title = ({ title }) => {
    return (
        <h2 className="mt-2 text-3xl font-semibold text-primary-super-dark ">
            {title}
        </h2>
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
            >
                {!content ? 'Er is nog geen inhoud' : content}
            </p>
        </div>
    )
}

const ValidText = ({ dataObject }) => {
    const getTextValidFromSince = (dataObject) => {
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
                ? 'Vigerend sinds'
                : 'Vigerend vanaf'

        return isActive + ' ' + textDate
    }

    const validText = getTextValidFromSince(dataObject)

    return (
        <span className="inline-block mb-3 text-base text-gray-600 ">
            {validText}
        </span>
    )
}

const Belangen = ({ label, object, type, containsChanges, placeholder }) => {
    const getBelangen = (containsChanges, object, type) => {
        if (!containsChanges) {
            return object.Belangen.filter((e) => e.Type === type)
        } else {
            const belangen = []
            Object.keys(object.Belangen).forEach((key) =>
                object.Belangen[key].forEach((belang) => {
                    belangen.push({ ...belang, changeType: key })
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
    beleidskeuze,
    beleidsRelaties,
    containsChanges,
}) {
    // if (!beleidskeuze || !beleidsRelaties) return null
    if (!beleidskeuze) return null

    const propertyHasNoValue = (property) =>
        !beleidskeuze[property] || beleidskeuze[property].length === 0

    const getValuesOf = (property) => {
        if (!containsChanges) return beleidskeuze[property]

        // Else we need to get the values from the changes properties ('removed', 'same', etc.)
        const values = []
        Object.keys(beleidskeuze[property]).forEach((key) =>
            beleidskeuze[property][key].forEach((value) => {
                values.push({ ...value, changeType: key })
            })
        )
        return values
    }

    return (
        <div>
            {connectionProperties.map((property) => {
                if (propertyHasNoValue(property)) return null

                const values = getValuesOf(property)

                return (
                    <div className="mt-4">
                        <h3 className="text-sm font-bold text-gray-800">
                            {property}
                        </h3>
                        <ul className="mt-2">
                            {values.map((connection) => (
                                <ListItem
                                    connection={connection}
                                    titel={connection.Titel}
                                    omschrijving={connection.Omschrijving}
                                    property={property}
                                    UUID={connection.UUID}
                                />
                            ))}
                        </ul>
                    </div>
                )
            })}
            {/* {beleidsRelaties.length > 0 ? (
                <div className="mt-4">
                    <h3 className="text-sm font-bold text-gray-800">
                        Beleidskeuzes
                    </h3>
                    <ul className="mt-2">
                        {beleidsRelaties.map((beleidsrelatie) => (
                            <ListItem
                                connection={beleidsrelatie}
                                titel={beleidsrelatie.Titel}
                                property="Beleidskeuzes"
                                UUID={beleidsrelatie.UUID}
                            />
                        ))}
                    </ul>
                </div>
            ) : null} */}
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
                        id="d3-tooltip"
                        class="absolute hidden group-hover:block top-0 mt-8 z-20 cursor-default"
                        style={{
                            left: '5px',
                        }}
                    >
                        <div
                            id={UUID}
                            class="px-4 py-2 rounded bg-gray-900 text-white shadow"
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
    'Belangen',
    'BeleidsRegels',
    'Beleidsprestaties',
    'Maatregelen',
    'Beleidsdoelen',
    'Themas',
    'Verordening',
]

// https://tailwindcss.com/docs/customizing-colors#default-color-palette
const connectionPropertiesColors = {
    Ambities: {
        hex: '#ED8936',
        class: 'orange-500',
    },
    Belangen: {
        hex: '#D53F8C',
        class: 'pink-600',
    },
    BeleidsRegels: {
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
    Verordening: {
        hex: '#E53E3E',
        class: 'red-600',
    },
    Beleidskeuzes: {
        hex: '#805AD5',
        class: 'purple-600',
    },
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
