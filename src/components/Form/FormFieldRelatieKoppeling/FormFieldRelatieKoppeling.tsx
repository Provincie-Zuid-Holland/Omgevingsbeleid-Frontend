import { faAngleDown, faEye } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useEffect, useRef, useState } from 'react'

import objecten from '@/constants/koppelingen'

import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving'
import PopupBewerkKoppeling from './PopUpBewerkKoppeling'
import PopupNieuweKoppeling from './PopupNieuweKoppeling'

/**
 * Function to get and return the connection properties from the CrudObject.
 *
 * @param {array} connectionProperties - Contains a collection of object properties.
 * @param {object} crudObject - Contains the object information from the API.
 */
function getPropertiesWithConnectionsFromCrudObject(
    connectionProperties: (keyof typeof objecten)[],
    crudObject: any
) {
    const propertiesWithExistingConnections: string[] = []

    connectionProperties.forEach(property => {
        const propertyName = objecten[property].propertyName as any

        if (
            crudObject[propertyName] !== undefined &&
            crudObject[propertyName] !== null &&
            Array.isArray(crudObject[propertyName]) &&
            crudObject[propertyName]?.length > 0 &&
            !propertiesWithExistingConnections.includes(propertyName)
        ) {
            propertiesWithExistingConnections.push(propertyName)
        }
    })

    return propertiesWithExistingConnections
}

/**
 *
 * @param {object} crudObject - Contains the object information from the API
 * @param {array} connectionProperties - Contains the object properties of connections that the component will be able to edit
 * @param {boolean} disabled - Disables the component (e.g. in beleidskeuzes with a 'vigerend' status)
 * @param {string} fieldLabel - Label of the field
 * @param {string} pValue - Paragraph value of the field, containing a description
 * @param {string} dataObjectProperty - Used to create unique ID's
 * @param {string} titleSingular - Title of the object in a singular form
 * @param {string} placeholderTekst - Placeholder
 * @param {string} buttonTekst - Text for the button
 * @param {string} titelMainObject - Title of the crudObject
 * @param {function} voegKoppelingRelatieToe - Function to edit parent state
 * @param {function} wijzigKoppelingRelatie - Function to edit parent state
 * @param {function} verwijderKoppelingRelatie - Function to edit parent state
 */

interface FormFieldRelatieKoppelingProps {
    crudObject: any
    connectionProperties: (keyof typeof objecten)[]
    disabled?: boolean
    fieldLabel: string
    pValue: string
    dataObjectProperty: string
    titleSingular: string
    placeholderTekst: string
    buttonTekst: string
    titelMainObject: string
    voegKoppelingRelatieToe: (
        propertyName: string,
        object: any,
        omschrijving: string,
        callback: () => void
    ) => void
    wijzigKoppelingRelatie: (
        koppelingObject: any,
        nieuweOmschrijving: string,
        callback: () => void
    ) => void
    verwijderKoppelingRelatie: (koppelingObject: any) => void
}

const FormFieldRelatieKoppeling = ({
    crudObject,
    connectionProperties,
    disabled,
    fieldLabel,
    pValue,
    dataObjectProperty,
    titleSingular,
    placeholderTekst,
    buttonTekst,
    titelMainObject,
    voegKoppelingRelatieToe,
    wijzigKoppelingRelatie,
    verwijderKoppelingRelatie,
}: FormFieldRelatieKoppelingProps) => {
    // Contains a boolean
    const [dropdownOpen, setDropdownOpen] = useState(false)

    // Contains a boolean if the popup to add a new connection is open
    const [popupOpenNieuw, setPopupOpenNieuw] = useState(false)

    // Contains a boolean if the popup to edit a connection is open
    const [popupOpenBewerk, setPopupOpenBewerk] = useState(false)

    // Contains the object that we are editing in the Edit Popup
    const [popupOpenBewerkItem, setPopupOpenBewerkItem] = useState({})

    // Contains the connections
    const [koppelingenRelaties, setKoppelingenRelaties] = useState<{
        [key: string]: any
    } | null>(null)

    // Boolean if all the data is loaded
    const [dataLoaded, setDataLoaded] = useState(false)

    // Object containing the connection that is being edited
    const [popupType, setPopupType] = useState<keyof typeof objecten | null>(
        null
    )

    const togglePopupNieuw = (type?: keyof typeof objecten) => {
        setPopupOpenNieuw(!popupOpenNieuw)
        if (!popupOpenNieuw && type) {
            setPopupType(type)
        } else {
            setPopupType(null)
        }
    }

    const togglePopupBewerk = (item?: any, propertyName?: string) => {
        setPopupOpenBewerk(!popupOpenBewerk)
        setPopupOpenBewerkItem({
            item,
            propertyName,
        })
    }

    /**
     * Checks for existing connections
     * If they exist, we add the type and set them in state
     */
    const initializeConnections = useCallback(() => {
        const propertiesWithExistingConnections =
            getPropertiesWithConnectionsFromCrudObject(
                connectionProperties,
                crudObject
            )

        // Contains the properties we have already mapped
        // We need this because 'Belang' en 'Taak' are both different types, but they do have the same propertyName on the crudObject
        const propertyNamesMapped: string[] = []

        // This object will contain the properties with existing connections
        const newStateKoppelingenRelatiesObject: {
            [key: string]: any
        } = {}

        propertiesWithExistingConnections.forEach(propertyName => {
            // Return if we already mapped over this property
            if (propertyNamesMapped.includes(propertyName)) {
                return
            } else {
                propertyNamesMapped.push(propertyName)
            }

            // Create the property on which we will put the objects
            newStateKoppelingenRelatiesObject[propertyName] = []

            crudObject[propertyName].forEach((item: any) => {
                newStateKoppelingenRelatiesObject[propertyName].push(item)
            })
        })

        setKoppelingenRelaties({ ...newStateKoppelingenRelatiesObject })

        setDataLoaded(true)
    }, [connectionProperties, crudObject])

    useEffect(() => {
        initializeConnections()
    }, [initializeConnections])

    // Lege array waar de properties in worden gepushed na er overheen gemap'd te zijn
    // 'Belang' en 'Taak' zijn aparte typen, maar zitten wel beide op dezelfde propertyName op het crudObject
    // Als tijdens het map'en de propertyName al in de propertyNamesMapped array staat, slaat die 'm over
    const propertyNamesMapped: string[] = []

    return (
        <>
            {fieldLabel === 'Koppelingen' ? (
                <>
                    <h3 className="block mb-2 font-bold tracking-wide text-gray-700">
                        Relaties
                    </h3>
                    <p className="mb-8 text-sm text-gray-700">
                        Een relatie ga je, met wederzijds goedkeuren, aan met
                        andere beleidskeuzes. Deze beleidsrelaties kun je op een
                        later moment aangaan vanuit de beheeromgeving onder het
                        kopje &apos;Beleidsrelaties&apos;.
                    </p>
                </>
            ) : null}
            <FormFieldTitelEnBeschrijving
                fieldLabel={fieldLabel}
                pValue={pValue}
                disabled={disabled}
            />
            <div
                className={`p-5 bg-white rounded shadow ${
                    disabled
                        ? 'opacity-75 cursor-not-allowed pointer-events-none'
                        : ''
                }`}
                id={`form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}>
                <div className="flex py-2 text-sm font-bold text-gray-700 border-b border-gray-300">
                    <div className="relative w-40 mr-5">Type</div>
                    <div className="w-full">Titel</div>
                </div>
                <ul className="mb-3">
                    {dataLoaded ? (
                        connectionProperties
                            .sort((a, b) => a.localeCompare(b))
                            .map(koppelingRelatieNaam => {
                                const propertyName =
                                    objecten[koppelingRelatieNaam].propertyName
                                if (
                                    propertyNamesMapped.includes(propertyName)
                                ) {
                                    return null
                                }
                                // De eerste keer dat we deze property mappen, dus pushen we hem in de propertyNamesMapped array
                                propertyNamesMapped.push(propertyName)

                                // Als deze propertyName niet in het koppelingenRelaties object zit; return
                                if (
                                    koppelingenRelaties === null ||
                                    koppelingenRelaties[propertyName] ===
                                        undefined
                                ) {
                                    return null
                                }

                                // Anders returnen we de list items door te loopen over koppelingenRelaties[propertyName]
                                return koppelingenRelaties[propertyName].map(
                                    (item: any, index: number) => {
                                        let type =
                                            objecten[koppelingRelatieNaam].type
                                        if (type === 'Nationaal Belang') {
                                            type = item.Object.Type
                                        }

                                        return (
                                            <li
                                                key={index}
                                                id={`form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}-item-${index}`}
                                                className="flex py-2 text-sm text-gray-700 border-b border-gray-300 cursor-pointer hover:text-gray-900"
                                                onClick={() => {
                                                    togglePopupBewerk(
                                                        item,
                                                        propertyName
                                                    )
                                                }}>
                                                <div className="relative w-40 mr-5">
                                                    {type}
                                                </div>
                                                <div className="relative w-full pr-8">
                                                    {item.Object.Titel}
                                                    <FontAwesomeIcon
                                                        className="absolute top-0 right-0 mt-1 mr-2"
                                                        icon={faEye}
                                                    />
                                                </div>
                                            </li>
                                        )
                                    }
                                )
                            })
                    ) : (
                        <span className="block py-4 text-sm text-gray-700">
                            {placeholderTekst}
                        </span>
                    )}
                </ul>
                <Dropdown
                    dropdownOpen={dropdownOpen}
                    buttonTekst={buttonTekst}
                    setDropdownOpen={setDropdownOpen}
                    titleSingular={titleSingular}
                    dataObjectProperty={dataObjectProperty}
                    connectionProperties={connectionProperties}
                    togglePopupNieuw={togglePopupNieuw}
                />
            </div>
            {popupOpenNieuw && popupType ? (
                <PopupNieuweKoppeling
                    titelMainObject={titelMainObject}
                    type={popupType}
                    togglePopup={togglePopupNieuw}
                    voegKoppelingRelatieToe={(
                        propertyName,
                        object,
                        omschrijving
                    ) => {
                        voegKoppelingRelatieToe(
                            propertyName,
                            object,
                            omschrijving,
                            initializeConnections
                        )
                    }}
                    crudObject={crudObject}
                />
            ) : null}
            {popupOpenBewerk ? (
                <PopupBewerkKoppeling
                    titelMainObject={titelMainObject}
                    togglePopup={togglePopupBewerk}
                    bewerkItem={popupOpenBewerkItem}
                    wijzigKoppelingRelatie={(
                        koppelingObject,
                        nieuweOmschrijving
                    ) => {
                        wijzigKoppelingRelatie(
                            koppelingObject,
                            nieuweOmschrijving,
                            initializeConnections
                        )
                    }}
                    verwijderKoppelingRelatie={verwijderKoppelingRelatie}
                />
            ) : null}
        </>
    )
}

interface DropdownProps {
    dropdownOpen?: boolean
    setDropdownOpen: (state: boolean) => void
    titleSingular: string
    dataObjectProperty: string
    connectionProperties: (keyof typeof objecten)[]
    togglePopupNieuw: (type: keyof typeof objecten) => void
    buttonTekst: string
}

const Dropdown = ({
    dropdownOpen,
    setDropdownOpen,
    titleSingular,
    dataObjectProperty,
    connectionProperties,
    togglePopupNieuw,
    buttonTekst,
}: DropdownProps) => {
    const buttonRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                buttonRef.current?.contains(e.target as Node | null)
            ) {
                return
            } else if (dropdownRef.current && e.target !== buttonRef.current) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside, false)

        return () =>
            document.removeEventListener('mousedown', handleClickOutside, false)
    }, [setDropdownOpen])

    return (
        <div className="relative">
            <div
                className="relative inline-block py-1 pl-4 mt-2 text-sm text-white transition duration-200 ease-in rounded cursor-pointer bg-pzh-blue text hover:bg-pzh-blue-dark"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                ref={buttonRef}
                id={`nieuw-item-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}>
                <span className="inline-block py-1 select-none">
                    {buttonTekst}
                </span>
                <span className="inline-block px-4 py-1 ml-4 text-center border-l border-white border-opacity-25">
                    <FontAwesomeIcon
                        className="mt-1 text-white"
                        icon={faAngleDown}
                    />
                </span>
                {dropdownOpen ? (
                    <ul
                        className="absolute left-0 w-full text-sm text-gray-700 bg-white rounded shadow top-100"
                        ref={dropdownRef}>
                        {connectionProperties
                            ? connectionProperties
                                  .sort((a, b) => a.localeCompare(b))
                                  .map((item, index) => {
                                      return (
                                          <li
                                              key={index}
                                              onClick={() => {
                                                  togglePopupNieuw(item)
                                              }}
                                              id={`form-field-universele-koppeling-dropdown-button-${index}`}
                                              className="px-3 py-2 border-b border-gray-300 cursor-pointer hover:bg-gray-100">
                                              {objecten[item].buttonTekst}
                                          </li>
                                      )
                                  })
                            : null}
                    </ul>
                ) : null}
            </div>
        </div>
    )
}

export default FormFieldRelatieKoppeling
