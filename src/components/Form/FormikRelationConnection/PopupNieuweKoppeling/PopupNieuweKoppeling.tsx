import { faTimes, faSearch } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cloneDeep from 'lodash.clonedeep'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { AmbitiesRead, VerordeningenRead } from '@/api/fetchers.schemas'
import { PopUpAnimatedContainer } from '@/components/Popup'
import objecten from '@/constants/koppelingen'

const getTypeText = (type: keyof typeof objecten) => {
    switch (type) {
        case 'belangen':
            return 'het belang'
        case 'taken':
            return 'de taak'
        case 'ambities':
            return 'de ambitie'
        case 'beleidsdoelen':
            return 'het beleidsdoel'
        case 'themas':
            return 'het thema'
        case 'beleidsregels':
            return 'de beleidsregel'
        case 'beleidsprestaties':
            return 'de beleidsprestatie'
        case 'maatregelen':
            return 'de maatregel'
        case 'verordening':
            return 'de verordening'
        default:
            return 'het object'
    }
}

/**
 * Displays a popup in which users can create Beleidsrelaties
 */

interface PopupNieuweKoppelingProps {
    togglePopup: () => void
    crudObject: any
    type: keyof typeof objecten
    titelMainObject: string
    voegKoppelingRelatieToe: (
        propertyName: string,
        selected: any,
        description: string
    ) => void
}

const PopupNieuweKoppeling = ({
    togglePopup,
    crudObject,
    type,
    titelMainObject,
    voegKoppelingRelatieToe,
}: PopupNieuweKoppelingProps) => {
    const [objects, setObjects] = useState<
        (AmbitiesRead | VerordeningenRead)[]
    >([])
    const [selected, setSelected] = useState<
        AmbitiesRead | VerordeningenRead | null
    >(null)
    const [description, setDescription] = useState('')
    const [searchFilter, setSearchFilter] = useState('')
    const [activePage, setActivePage] = useState(1)
    const [dataLoaded, setDataLoaded] = useState(false)

    /**
     * Function that adds the EventListener keypress "Enter".
     */
    useEffect(() => {
        window.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                e.preventDefault()
            }
        })

        /**
         * Right now the 'Belangen' and 'Taken' are both the same object, but differentiated with a type
         * The object contains the property 'filterAPI' from the 'ObjectenInformatie.js' file.
         * This means we need to filter this based on the active type in state.
         * @returns {array} containing the (filtered) data from the API
         */
        const getResponseData = (
            data: (AmbitiesRead | VerordeningenRead)[]
        ): (AmbitiesRead | VerordeningenRead)[] => {
            if (objecten[type].filterAPI) {
                return data.filter(
                    item =>
                        'Type' in item &&
                        item.Type === objecten[type].filterType
                )
            }

            return data
        }

        async function fetchObjects() {
            await objecten[type]
                .api()
                .then(res => {
                    const data = getResponseData(res)
                    setObjects(data)
                    setDataLoaded(true)
                })
                .catch(err => {
                    console.log(err)
                    toast(process.env.REACT_APP_ERROR_MSG)
                    setDataLoaded(true)
                })
        }

        fetchObjects()
    }, [type])

    /**
     * Filter objects based on searchQuery and already connected objects
     */
    const getFilteredObjects = () => {
        const propertyName = objecten[type].propertyName
        const clonedCrudObject = cloneDeep(crudObject)

        // Add active connections to an array
        const actieveKoppelingen: string[] = []
        if (clonedCrudObject[propertyName]) {
            clonedCrudObject[propertyName].forEach((item: any) => {
                actieveKoppelingen.push(item.Object.UUID)
            })
        }

        return (
            objects
                // Filter out all the object of Type 'Lid'
                .filter(
                    item =>
                        !('Type' in item) ||
                        ('Type' in item && item.Type !== 'Lid')
                )
                // Filter out based on search Query
                .filter(
                    item =>
                        item.Titel?.toLowerCase().includes(
                            searchFilter.toLowerCase()
                        ) ||
                        ('Volgnummer' in item &&
                            item?.Volgnummer?.toLowerCase()?.includes(
                                searchFilter.toLowerCase()
                            ))
                )
        )
    }

    /**
     * Function to setState of the selected state within the function.
     */
    const selectObject = (object: AmbitiesRead | VerordeningenRead) => {
        if (selected === object) {
            setSelected(null)
        } else {
            setSelected(object)
        }
    }

    /**
     * Function to set the state of the actievePagina variable with a new value.
     */
    const nextScreen = () => setActivePage(activePage + 1)

    const filteredObjects = useMemo(
        () => getFilteredObjects(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [objects, searchFilter]
    )

    return (
        <PopUpAnimatedContainer>
            <div
                onClick={() => togglePopup()}
                className="absolute top-0 right-0 px-6 py-4 text-gray-600 cursor-pointer"
                id={`form-field-koppeling-sluit-popup`}>
                <FontAwesomeIcon icon={faTimes} />
            </div>
            <h3 className="font-bold form-field-label">
                {objecten[type].volledigeTitel} koppelen
            </h3>
            {activePage === 1 ? (
                <>
                    <p className="form-field-description">
                        Zoek en selecteer {getTypeText(type)} welke je wilt
                        koppelen met de beleidskeuze &apos;
                        {titelMainObject}&apos;
                    </p>
                    <div className="relative block w-full mt-4 mb-6">
                        <input
                            onChange={e => setSearchFilter(e.target.value)}
                            value={searchFilter}
                            className="block w-full py-3 pl-4 pr-12 text-sm leading-tight text-gray-700 border border-gray-400 rounded shadow appearance-none focus:outline-none hover:border-gray-500 focus:border-gray-500"
                            id={`form-field-koppeling-zoekbalk`}
                            type="text"
                            name="zoekFilter"
                            placeholder="Zoeken... (typ minimaal 3 karakters)"
                        />
                        <FontAwesomeIcon
                            className="absolute top-0 right-0 mt-4 mr-4 text-sm text-gray-600"
                            icon={faSearch}
                        />
                    </div>
                    <div className="border rounded shadow">
                        <ul className="flex-row overflow-y-auto popup-results-list">
                            {objects && filteredObjects.length > 0 ? (
                                filteredObjects
                                    .sort((a, b) => {
                                        if (!a.Titel || !b.Titel) return 0

                                        if (
                                            a.Titel.toUpperCase() <
                                            b.Titel.toUpperCase()
                                        ) {
                                            return -1
                                        } else if (
                                            a.Titel.toUpperCase() >
                                            b.Titel.toUpperCase()
                                        ) {
                                            return 1
                                        } else {
                                            return 0
                                        }
                                    })
                                    .map((item, index) => (
                                        <li
                                            onClick={() => {
                                                selectObject(item)
                                            }}
                                            className={`px-4 py-2 text-sm text-gray-700 cursor-pointer ${
                                                selected === item
                                                    ? 'bg-gray-100 font-bold'
                                                    : 'hover:bg-gray-100'
                                            }`}
                                            key={item.UUID}
                                            id={`form-field-koppeling-item-${index}`}>
                                            <span
                                                className={`${
                                                    'Volgnummer' in item
                                                        ? 'w-10 inline-block'
                                                        : ''
                                                }`}>
                                                {'Volgnummer' in item
                                                    ? item.Volgnummer
                                                    : null}
                                            </span>
                                            <span>{item.Titel}</span>
                                        </li>
                                    ))
                            ) : (
                                <li
                                    className="px-4 py-2 text-sm text-gray-700 cursor-not-allowed"
                                    key="0">
                                    {dataLoaded ? (
                                        searchFilter.length === 0 ? (
                                            <span className="italic text-gray-700">
                                                Geen resultaten
                                            </span>
                                        ) : (
                                            <span className="italic text-gray-700">
                                                Geen resultaten voor &apos;
                                                {searchFilter}
                                                &apos;
                                            </span>
                                        )
                                    ) : (
                                        <span className="italic text-gray-700 loading">
                                            {
                                                objecten[type]
                                                    .volledigeTitelMeervoud
                                            }{' '}
                                            laden...
                                        </span>
                                    )}
                                </li>
                            )}
                        </ul>
                    </div>
                </>
            ) : null}
            {activePage === 2 ? (
                <>
                    <p className="form-field-description">
                        Beschrijf de koppeling tussen &apos;
                        {selected?.Titel}&apos; en &apos;
                        {titelMainObject}&apos;
                    </p>
                    <div className="px-4 py-4 my-4 text-sm text-gray-700 border-l-4 bg-pzh-blue-super-light border-pzh-blue">
                        Om er voor te zorgen dat de aangebrachte koppeling
                        daadwerkelijk van waarde is, vragen we je om de
                        koppeling te beschrijven.
                    </div>
                    <p className="mt-4 form-field-description">
                        Beschrijf zo concreet mogelijk de relatie
                    </p>
                    <textarea
                        value={description}
                        required
                        onChange={e => setDescription(e.target.value)}
                        id={`form-field-koppeling-beschrijving`}
                        name="beschrijving"
                        aria-label="beschrijving"
                        className="block w-full h-24 px-4 py-3 leading-tight text-gray-700 border border-gray-400 rounded appearance-none focus:outline-none focus:bg-white hover:border-gray-500 focus:border-gray-500"
                    />
                </>
            ) : null}
            <div className="flex items-center justify-between mt-6">
                <span
                    tabIndex={0}
                    className="text-sm text-gray-600 underline cursor-pointer"
                    onClick={() => togglePopup()}
                    id={`form-field-koppeling-annuleren`}>
                    Annuleren
                </span>
                {activePage === 1 ? (
                    <div
                        className={`font-bold py-2 px-4 cursor-pointer leading-tight text-sm rounded bg-pzh-green text-white ${
                            selected === null
                                ? `cursor-not-allowed opacity-50`
                                : `hover:underline`
                        }`}
                        tabIndex={0}
                        onClick={() => {
                            if (selected !== null) {
                                nextScreen()
                            } else {
                                return
                            }
                        }}
                        onKeyPress={e => {
                            if (e.key === 'Enter' && description.length > 0) {
                                voegKoppelingRelatieToe(
                                    objecten[type].propertyName,
                                    { Object: selected },
                                    description
                                )
                                togglePopup()
                            }
                        }}
                        id={`form-field-koppeling-volgende`}>
                        Volgende
                    </div>
                ) : (
                    <div
                        className={`font-bold py-2 px-4 cursor-pointer leading-tight text-sm rounded bg-pzh-green text-white ${
                            description.length === 0
                                ? `cursor-not-allowed opacity-50`
                                : `hover:underline`
                        }`}
                        tabIndex={0}
                        onClick={() => {
                            if (description.length > 0) {
                                voegKoppelingRelatieToe(
                                    objecten[type].propertyName,
                                    { Object: selected },
                                    description
                                )
                                togglePopup()
                            } else {
                                return
                            }
                        }}
                        onKeyPress={e => {
                            if (e.key === 'Enter' && description.length > 0) {
                                voegKoppelingRelatieToe(
                                    objecten[type].propertyName,
                                    { Object: selected },
                                    description
                                )
                                togglePopup()
                            }
                        }}
                        id={`form-field-koppeling-koppelen`}>
                        Koppelen
                    </div>
                )}
            </div>
        </PopUpAnimatedContainer>
    )
}

export default PopupNieuweKoppeling
export { getTypeText }
