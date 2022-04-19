import { faAngleDown, faEye } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FieldLabel } from '@pzh-ui/components'
import { useFormikContext } from 'formik'
import { useCallback, useEffect, useRef, useState } from 'react'

import { BeleidskeuzesWrite, MaatregelenWrite } from '@/api/fetchers.schemas'
import objecten, {
    connectionPropertiesType,
    propertyNamesType,
} from '@/constants/koppelingen'
import { BeleidskeuzeConnections } from '@/types/dimensions'

import PopupBewerkKoppeling from './PopUpBewerkKoppeling'
import PopupNieuweKoppeling from './PopupNieuweKoppeling'

/**
 * Function to get and return the connection properties from the CrudObject.
 *
 * @param {array} connectionProperties - Contains a collection of object properties.
 * @param {object} crudObject - Contains the object information from the API.
 */
function getPropertiesWithConnectionsFromCrudObject(
    connectionProperties: connectionPropertiesType[],
    crudObject: BeleidskeuzesWrite
) {
    const propertiesWithExistingConnections: propertyNamesType[] = []

    connectionProperties.forEach(property => {
        const propertyName = objecten[property].propertyName

        const objectHasConnectionsOnProperty =
            propertyName &&
            crudObject?.[propertyName]?.length &&
            crudObject?.[propertyName]!.length > 0

        if (objectHasConnectionsOnProperty) {
            propertiesWithExistingConnections.push(propertyName)
        }
    })

    return propertiesWithExistingConnections
}

interface FormikRelationConnectionProps {
    crudObject: BeleidskeuzesWrite
    connectionProperties: connectionPropertiesType[]
    disabled?: boolean
    label: string
    description: string
    dataObjectProperty: string
    titleSingular: string
    placeholderTekst: string
    buttonTekst: string
    titelMainObject: string
}

const FormikRelationConnection = ({
    crudObject,
    connectionProperties,
    disabled,
    label,
    description,
    dataObjectProperty,
    titleSingular,
    placeholderTekst,
    buttonTekst,
    titelMainObject,
}: FormikRelationConnectionProps) => {
    const { values, setFieldValue } = useFormikContext<
        BeleidskeuzesWrite | MaatregelenWrite
    >()

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [popupOpenNieuw, setPopupOpenNieuw] = useState(false)
    const [popupOpenBewerk, setPopupOpenBewerk] = useState(false)
    const [popupOpenBewerkItem, setPopupOpenBewerkItem] = useState({})
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

            if (crudObject[propertyName]) {
                crudObject[propertyName]!.forEach(item => {
                    newStateKoppelingenRelatiesObject[propertyName].push(item)
                })
            }
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

    const connectionHandler = (
        state: { [key: string]: any } | null,
        action: {
            type: string
            payload: {
                connectionObject: BeleidskeuzeConnections
                propertyName: string
                description?: string
            }
        }
    ) => {
        const propertyName = action.payload.propertyName
        const connectionObject = action.payload.connectionObject

        switch (action.type) {
            case 'ADD_CONNECTION':
                if (state && connectionObject.Object) {
                    const newState = { ...state }
                    const currentConnections = newState[propertyName]

                    // Belangen contains a Type property, as it can contain multiple types
                    const objectType =
                        propertyName === 'belangen' &&
                        'Type' in connectionObject.Object
                            ? connectionObject.Object.Type
                            : propertyName

                    const newConnection = {
                        Koppeling_Omschrijving: action.payload.description,
                        Object: {
                            UUID: action.payload.connectionObject.Object?.UUID,
                            Titel: action.payload.connectionObject.Object
                                ?.Titel,
                            Type: objectType || propertyName,
                        },
                    }

                    if (Array.isArray(currentConnections)) {
                        setFieldValue(propertyName, [
                            ...currentConnections,
                            newConnection,
                        ])
                    } else {
                        setFieldValue(propertyName, [newConnection])
                    }

                    break
                } else {
                    break
                }
            case 'REMOVE_CONNECTION':
                if (state && connectionObject.Object) {
                    const newState = { ...state }
                    const connectionObjectUUID = connectionObject.Object.UUID
                    const updatedConnections = newState[propertyName].filter(
                        (item: any) => item.Object.UUID !== connectionObjectUUID
                    )
                    setFieldValue(propertyName, updatedConnections)
                    break
                } else {
                    break
                }
            case 'EDIT_CONNECTION':
                if (state && connectionObject.Object) {
                    const newState = { ...state }
                    const connectionObjectUUID = connectionObject.Object.UUID
                    const index = newState[propertyName].findIndex(
                        (item: any) => item.Object.UUID === connectionObjectUUID
                    )
                    const updatedConnections = newState[propertyName].map(
                        (item: any, key: number) => {
                            if (key === index) {
                                return {
                                    ...item,
                                    Koppeling_Omschrijving:
                                        action.payload.description,
                                }
                            } else {
                                return item
                            }
                        }
                    )
                    setFieldValue(propertyName, updatedConnections)
                    break
                } else {
                    break
                }
            default:
                return state
        }
    }

    return (
        <>
            {label === 'Koppelingen' ? (
                <div className="mb-8">
                    <FieldLabel
                        label="Relaties"
                        description="Een relatie ga je, met wederzijds goedkeuren, aan met
                        andere beleidskeuzes. Deze beleidsrelaties kun je op een
                        later moment aangaan vanuit de beheeromgeving onder het
                        kopje 'Beleidsrelaties'."
                        name={dataObjectProperty}
                    />
                </div>
            ) : null}
            <FieldLabel
                label={label}
                description={description}
                name={dataObjectProperty}
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
                        connectionObject,
                        description
                    ) => {
                        connectionHandler(values, {
                            type: 'ADD_CONNECTION',
                            payload: {
                                propertyName,
                                connectionObject: connectionObject,
                                description: description,
                            },
                        })
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
                        connectionObject,
                        newDescription,
                        propertyName
                    ) => {
                        connectionHandler(values, {
                            type: 'EDIT_CONNECTION',
                            payload: {
                                propertyName: propertyName,
                                connectionObject: connectionObject.item,
                                description: newDescription,
                            },
                        })
                    }}
                    verwijderKoppelingRelatie={(
                        connectionObject,
                        propertyName
                    ) => {
                        connectionHandler(values, {
                            type: 'REMOVE_CONNECTION',
                            payload: {
                                propertyName: propertyName,
                                connectionObject: connectionObject.item,
                            },
                        })
                    }}
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
    connectionProperties: connectionPropertiesType[]
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
                        className="absolute left-0 z-10 w-full text-sm text-gray-700 bg-white rounded shadow top-100"
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

export default FormikRelationConnection
