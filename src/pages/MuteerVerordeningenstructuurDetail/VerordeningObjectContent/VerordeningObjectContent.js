import React from 'react'

import {
    faGripLines,
    faSave,
    faTimes,
    faTrash,
} from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Transition from './../../../components/Transition'
import CrudDropdown from './../CrudDropdown'

import VerordeningContext from './../VerordeningContext'
import { toast } from 'react-toastify'

function VerordeningObjectContent({ item, index, pathToIndex }) {
    let {
        userIsEditingOrder,
        userIsAddingSections,
        verordeningsLedenFromGET,
        setVerordeningsLedenFromGET,
        UUIDBeingEdited,
        verordeningsObjectIsLoading,
        verordeningsObjectFromGET,
        setUUIDBeingEdited,
        setVolgnummerBeingEdited,
        setIndexArrayToUUIDBeingEdited,
        patchRegulationObject,
        setVerordeningsObjectFromGET,
        editContentOfArticle,
    } = React.useContext(VerordeningContext)

    const volgnummer = item.Volgnummer

    const getStylesBasedOnType = () => {
        switch (item.Type) {
            case 'Afdeling':
                return 'pl-5 bg-pzh-blue-super-light text-gray-900'
            case 'Paragraaf':
                return 'pl-5 bg-pzh-blue-super-light text-gray-900'
            default:
                return ''
        }
    }

    const getTitlePrepend = () => {
        switch (item.Type) {
            case 'Afdeling':
                return `Afdeling ${volgnummer} - `
            case 'Paragraaf':
                return `§ ${volgnummer} `
            case 'Artikel':
                return `Artikel ${volgnummer} `
            default:
                return null
        }
    }

    const editingthisItem =
        verordeningsObjectFromGET &&
        verordeningsObjectFromGET.UUID === item.UUID

    const editingThisItemAndIsLoaded =
        editingthisItem && !verordeningsObjectIsLoading

    // We place Children in the verordeningsLedenFromGET if the user converts an article with no Leden into one with Leden
    let itemHasLeden = false

    // We mutate the leden of an object in the verordeningsObjectFromGET and verordeningsLedenFromGET
    if (editingThisItemAndIsLoaded) {
        itemHasLeden =
            verordeningsLedenFromGET && verordeningsLedenFromGET.length > 0
    } else {
        itemHasLeden = item && item.Children.length > 0
    }

    const isArtikel = item.Type === 'Artikel'

    return (
        <div
            className={`bg-white mb-2
                ${userIsEditingOrder ? 'cursor-hover hover:bg-gray-50' : ''}
            `}
        >
            <div
                className={`flex items-center relative ${
                    editingThisItemAndIsLoaded ? '' : 'pr-12'
                } font-bold block py-3 ${getStylesBasedOnType()}`}
            >
                <ReorderIcon userIsEditingOrder={userIsEditingOrder} />
                {editingThisItemAndIsLoaded ? (
                    <TitleEditing
                        verordeningsLedenFromGET={verordeningsLedenFromGET}
                        setVerordeningsLedenFromGET={
                            setVerordeningsLedenFromGET
                        }
                        patchRegulationObject={patchRegulationObject}
                        setUUIDBeingEdited={setUUIDBeingEdited}
                        setVerordeningsObjectFromGET={
                            setVerordeningsObjectFromGET
                        }
                        verordeningsObjectFromGET={verordeningsObjectFromGET}
                        itemIndex={index}
                        item={item}
                    />
                ) : (
                    <span
                        className={`transition ease-in-out duration-100 transform ${
                            userIsEditingOrder
                                ? 'translate-x-8'
                                : 'translate-x-0'
                        }
                        ${
                            UUIDBeingEdited && !editingthisItem
                                ? 'opacity-50'
                                : 'opacity-100'
                        }`}
                    >
                        {getTitlePrepend()}

                        {item.Titel ? item.Titel : ''}
                    </span>
                )}
                {!userIsEditingOrder && !userIsAddingSections ? (
                    <CrudDropdown
                        setIndexArrayToUUIDBeingEdited={
                            setIndexArrayToUUIDBeingEdited
                        }
                        UUIDBeingEdited={UUIDBeingEdited}
                        verordeningsObjectIsLoading={
                            verordeningsObjectIsLoading
                        }
                        verordeningsObjectFromGET={verordeningsObjectFromGET}
                        setUUIDBeingEdited={setUUIDBeingEdited}
                        setVolgnummerBeingEdited={setVolgnummerBeingEdited}
                        item={item}
                        pathToIndex={pathToIndex}
                    />
                ) : null}
            </div>

            {editingThisItemAndIsLoaded && !itemHasLeden && isArtikel ? (
                <React.Fragment>
                    <TextArea
                        onChange={(e) => {
                            setVerordeningsObjectFromGET({
                                type: 'changeValue',
                                value: e.target.value,
                                name: 'Inhoud',
                            })
                        }}
                        value={
                            verordeningsObjectFromGET.Inhoud
                                ? verordeningsObjectFromGET.Inhoud
                                : ''
                        }
                    />
                    <span className="mt-2 text-sm text-gray-700">
                        Dit artikel heeft geen leden.{' '}
                        <span
                            className="underline cursor-pointer"
                            onClick={() =>
                                editContentOfArticle({
                                    type: 'convertToLidInhoud',
                                })
                            }
                        >
                            Zet bovenstaand veld om naar lid 1.
                        </span>
                    </span>
                </React.Fragment>
            ) : !itemHasLeden && isArtikel ? (
                <p
                    className={`width-full transition-opacity duration-100 ease-in-out block pr-2 whitespace-pre-line 
                    ${item.Inhoud ? 'pb-4' : ''}
                    ${
                        UUIDBeingEdited && !editingthisItem
                            ? 'opacity-50'
                            : 'opacity-100'
                    }
                    `}
                >
                    {item.Inhoud}
                </p>
            ) : null}

            {editingThisItemAndIsLoaded && itemHasLeden && isArtikel ? (
                <LedenEdit
                    setVerordeningsObjectFromGET={setVerordeningsObjectFromGET}
                    editContentOfArticle={editContentOfArticle}
                    setVerordeningsLedenFromGET={setVerordeningsLedenFromGET}
                    verordeningsLedenFromGET={verordeningsLedenFromGET}
                    item={item}
                />
            ) : itemHasLeden && isArtikel ? (
                <LedenView
                    transparent={UUIDBeingEdited && !editingthisItem}
                    item={item}
                />
            ) : null}
        </div>
    )
}

const DeleteIcon = ({
    index,
    setVerordeningsLedenFromGET,
    setVerordeningsObjectFromGET,
}) => {
    if (index === 0) return null
    return (
        <div className="absolute top-0 right-0 flex items-center h-full pointer-events-none">
            <button
                onClick={() => {
                    setVerordeningsLedenFromGET({
                        type: 'removeSpecificIndex',
                        index: index,
                    })
                    setVerordeningsObjectFromGET({
                        type: 'removeSpecificIndexOfLeden',
                        index: index,
                    })
                }}
                className="w-8 h-8 -mr-6 transition-shadow duration-300 ease-in bg-white rounded shadow pointer-events-auto hover:shadow-md"
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    )
}

const ReorderIcon = ({ userIsEditingOrder }) => {
    return (
        <Transition
            show={userIsEditingOrder}
            enter="transition ease-out duration-100 transform"
            enterFrom="opacity-0 scale-95 -translate-x-2 transform"
            enterTo="opacity-100 scale-100 translate-x-0 transform"
            leave="transition ease-in duration-75 transform"
            leaveFrom="opacity-100 scale-100 translate-x-0 transform"
            leaveTo="opacity-0 scale-95 -translate-x-2 transform"
        >
            <FontAwesomeIcon className="absolute" icon={faGripLines} />
        </Transition>
    )
}

const LedenView = ({ item, transparent }) => {
    const listOfLeden = item.Children.filter((e) => e.Type === 'Lid')
    if (listOfLeden.length === 0) return null

    return (
        <ol className={`pb-4 ${transparent ? 'opacity-50' : 'opacity-100'}`}>
            {listOfLeden.map((lid) => (
                <li className="pb-1 whitespace-pre-line" id={lid.UUID}>
                    {lid.Inhoud}
                </li>
            ))}
        </ol>
    )
}

const LedenEdit = ({
    item,
    verordeningsLedenFromGET,
    setVerordeningsLedenFromGET,
    setVerordeningsObjectFromGET,
    editContentOfArticle,
}) => {
    if (!verordeningsLedenFromGET) return null
    return (
        <div>
            {verordeningsLedenFromGET.map((lid, index) => (
                <div key={lid.UUID} className="relative">
                    <TextArea
                        onChange={(e) =>
                            setVerordeningsLedenFromGET({
                                type: 'changeValue',
                                index: index,
                                value: e.target.value,
                                name: 'Inhoud',
                            })
                        }
                        value={lid.Inhoud ? lid.Inhoud : ''}
                    />
                    <DeleteIcon
                        setVerordeningsLedenFromGET={
                            setVerordeningsLedenFromGET
                        }
                        setVerordeningsObjectFromGET={
                            setVerordeningsObjectFromGET
                        }
                        index={index}
                    />
                </div>
            ))}
            {verordeningsLedenFromGET.length === 1 ? (
                <div className="flex justify-between w-full">
                    <span
                        className="mt-2 mr-2 text-sm text-gray-700 underline cursor-pointer"
                        onClick={() =>
                            editContentOfArticle({
                                type: 'addLidToArticle',
                            })
                        }
                    >
                        + Lid toevoegen
                    </span>
                    <span className="mt-2 text-sm text-gray-700">
                        Dit artikel bestaat uit leden.{' '}
                        <span
                            className="underline cursor-pointer"
                            onClick={() =>
                                editContentOfArticle({
                                    type: 'convertToArtikelInhoud',
                                })
                            }
                        >
                            Zet lid 1 om naar artikelinhoud
                        </span>
                    </span>
                </div>
            ) : (
                <span
                    className="mt-2 mr-2 text-sm text-gray-700 underline cursor-pointer"
                    onClick={() =>
                        editContentOfArticle({
                            type: 'addLidToArticle',
                        })
                    }
                >
                    + Lid toevoegen
                </span>
            )}
        </div>
    )
}

const TextArea = ({ children, onChange, value }) => {
    const [style, setStyle] = React.useState({
        height: null,
    })
    const ref = React.useRef()

    React.useLayoutEffect(() => {
        const textAreaEl = ref.current
        // + 2 for the border, else the scrollbar turns on
        const height = textAreaEl.scrollHeight + 2

        setStyle({ height: `${height}px` })
    }, [children])

    return (
        <textarea
            onChange={onChange}
            ref={ref}
            style={style}
            className="w-full px-4 py-2 text-gray-800 border rounded-md"
            value={value}
        ></textarea>
    )
}

const TitleEditing = ({
    setVerordeningsLedenFromGET,
    verordeningsLedenFromGET,
    patchRegulationObject,
    item,
    verordeningsObjectFromGET,
    setVerordeningsObjectFromGET,
    setUUIDBeingEdited,
}) => {
    const checkForWerkingsgebied = () => {
        const artikelHasGebied = verordeningsObjectFromGET.Gebied
        if (verordeningsLedenFromGET) {
            const allLedenHaveGebied = verordeningsLedenFromGET.every(
                (e) => e.Gebied
            )
            return artikelHasGebied || allLedenHaveGebied
        } else {
            return artikelHasGebied
        }
    }

    return (
        <div className={`w-full font-bold rounded`}>
            <div
                className={`flex items-center ${
                    item.Type === 'Afdeling' ? 'pr-2' : ''
                }`}
            >
                <span>{item.Type}</span>
                <input
                    type="text"
                    value={verordeningsObjectFromGET.Volgnummer}
                    onChange={(e) => {
                        setVerordeningsObjectFromGET({
                            type: 'changeValue',
                            value: e.target.value,
                            name: 'Volgnummer',
                        })
                    }}
                    id="form-inline-volgnummer"
                    className="inline-block w-16 mx-2 font-bold text-center form-input "
                />
                <span>-</span>
                <input
                    placeholder="Titel"
                    type="text"
                    id="form-inline-title"
                    value={verordeningsObjectFromGET.Titel}
                    onChange={(e) => {
                        setVerordeningsObjectFromGET({
                            type: 'changeValue',
                            value: e.target.value,
                            name: 'Titel',
                        })
                    }}
                    className="inline-block w-full ml-2 font-bold form-input "
                />

                <SaveButton
                    save={() => {
                        const werkingsGebiedenHasValue = checkForWerkingsgebied()
                        if (
                            item.Type === 'Artikel' &&
                            !werkingsGebiedenHasValue
                        ) {
                            toast('Selecteer een werkingsgebied')
                            return
                        }
                        patchRegulationObject()
                    }}
                />
                <CancelButton
                    cancel={() => {
                        setUUIDBeingEdited(null)
                        setVerordeningsObjectFromGET({
                            type: 'cancel',
                        })
                        setVerordeningsLedenFromGET({
                            type: 'cancel',
                        })
                    }}
                />
            </div>
        </div>
    )
}

const SaveButton = ({ save }) => {
    return (
        <button
            onClick={save}
            className="flex items-center self-stretch justify-center px-3 ml-1 text-lg text-white bg-green-500 rounded hover:bg-pzh-green"
        >
            <FontAwesomeIcon icon={faSave} />
        </button>
    )
}

const CancelButton = ({ cancel }) => {
    return (
        <button
            className="flex items-center self-stretch justify-center px-3 ml-1 text-lg text-white rounded bg-pzh-blue hover:bg-pzh-blue-dark"
            onClick={cancel}
        >
            <FontAwesomeIcon icon={faTimes} />
        </button>
    )
}

export default VerordeningObjectContent
