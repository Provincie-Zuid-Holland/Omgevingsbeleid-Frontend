import React, { Component } from 'react'

import {
    faGripLines,
    faSave,
    faTimes,
} from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Transition from './../../../components/Transition'
import CrudDropdown from './../CrudDropdown'

import VerordeningContext from './../VerordeningContext'

function VerordeningObjectContent({
    userIsEditingOrder,
    item,
    index,
    pathToIndex,
}) {
    const {
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
    } = React.useContext(VerordeningContext)

    const volgnummer = item.Volgnummer

    const getStylesBasedOnType = () => {
        switch (item.Type) {
            case 'Afdeling':
                return 'bg-primary-super-light text-gray-900'
            case 'Paragraaf':
                return 'bg-primary-super-light text-gray-900'
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

    const editingThisItemAndIsLoaded =
        verordeningsObjectFromGET &&
        verordeningsObjectFromGET.UUID === item.UUID &&
        !verordeningsObjectIsLoading

    const itemHasLeden = item && item.Children.length > 0

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
                } font-semibold block pl-5 py-3 ${getStylesBasedOnType()}`}
            >
                <ReorderIcon userIsEditingOrder={userIsEditingOrder} />
                {editingThisItemAndIsLoaded ? (
                    <TitleEditing
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
                        className={`transition-transform ease-in-out duration-100 transform ${
                            userIsEditingOrder
                                ? 'translate-x-8'
                                : 'translate-x-0'
                        }`}
                    >
                        {getTitlePrepend()}

                        {item.Titel ? item.Titel : ''}
                    </span>
                )}

                <CrudDropdown
                    setIndexArrayToUUIDBeingEdited={
                        setIndexArrayToUUIDBeingEdited
                    }
                    UUIDBeingEdited={UUIDBeingEdited}
                    verordeningsObjectIsLoading={verordeningsObjectIsLoading}
                    verordeningsObjectFromGET={verordeningsObjectFromGET}
                    setUUIDBeingEdited={setUUIDBeingEdited}
                    setVolgnummerBeingEdited={setVolgnummerBeingEdited}
                    setIndexArrayToUUIDBeingEdited={
                        setIndexArrayToUUIDBeingEdited
                    }
                    item={item}
                    pathToIndex={pathToIndex}
                />
            </div>
            {editingThisItemAndIsLoaded && !itemHasLeden && isArtikel ? (
                <TextArea
                    onChange={(e) => {
                        setVerordeningsObjectFromGET({
                            type: 'changeValue',
                            value: e.target.value,
                            name: 'Inhoud',
                        })
                    }}
                >
                    {verordeningsObjectFromGET.Inhoud}
                </TextArea>
            ) : !itemHasLeden && isArtikel ? (
                <p
                    className={`width-full block pl-5 whitespace-pre-line ${
                        item.Inhoud ? 'pb-4' : ''
                    }`}
                >
                    {item.Inhoud}
                </p>
            ) : null}

            {editingThisItemAndIsLoaded && itemHasLeden && isArtikel ? (
                <LedenEdit
                    setVerordeningsLedenFromGET={setVerordeningsLedenFromGET}
                    verordeningsLedenFromGET={verordeningsLedenFromGET}
                    item={item}
                />
            ) : itemHasLeden && isArtikel ? (
                <LedenView item={item} />
            ) : null}
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

const LedenView = ({ item }) => {
    // Returns JSX of leden
    const listOfLeden = item.Children.filter((e) => e.Type === 'Lid')
    if (listOfLeden.length === 0) return null

    return (
        <ol className="pb-4 pl-5">
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
}) => {
    const listOfLeden = item.Children.filter((e) => e.Type === 'Lid')
    if (listOfLeden.length === 0) return null
    return (
        <div>
            {listOfLeden.map((lid, index) => (
                <TextArea
                    onChange={(e) =>
                        setVerordeningsLedenFromGET({
                            type: 'changeValue',
                            index: index,
                            value: e.target.value,
                            name: 'Inhoud',
                        })
                    }
                >
                    {verordeningsLedenFromGET
                        ? verordeningsLedenFromGET[index].Inhoud
                        : null}
                </TextArea>
            ))}
        </div>
    )
}

const TextArea = ({ children, onChange }) => {
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
        >
            {children}
        </textarea>
    )
}

const TitleEditing = ({
    patchRegulationObject,
    item,
    verordeningsObjectFromGET,
    setVerordeningsObjectFromGET,
    setUUIDBeingEdited,
}) => {
    return (
        <div className={`w-full font-semibold rounded`}>
            <div className="flex items-center">
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
                    className="inline-block w-16 mx-2 font-semibold text-center form-input sm:text-sm sm:leading-5"
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
                    className="inline-block w-full ml-2 font-semibold form-input sm:text-sm sm:leading-5"
                />

                <SaveButton save={() => patchRegulationObject()} />
                <CancelButton
                    cancel={() => {
                        setUUIDBeingEdited(null)
                        setVerordeningsObjectFromGET({
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
            className="flex items-center self-stretch justify-center inline-block px-3 ml-1 text-lg text-white bg-green-500 rounded hover:bg-green-600"
        >
            <FontAwesomeIcon icon={faSave} />
        </button>
    )
}

const CancelButton = ({ cancel }) => {
    return (
        <button
            className="flex items-center self-stretch justify-center inline-block px-3 ml-1 text-lg text-white rounded bg-primary hover:bg-red-700"
            onClick={cancel}
        >
            <FontAwesomeIcon icon={faTimes} />
        </button>
    )
}

export default VerordeningObjectContent
