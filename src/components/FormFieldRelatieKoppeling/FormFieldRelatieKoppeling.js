import React from 'react'
import PropTypes from 'prop-types'

import { faAngleDown, faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import PopupNieuweKoppeling from './PopupNieuweKoppeling'
import PopupBewerkKoppeling from './PopUpBewerkKoppeling'
import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving/FormFieldTitelEnBeschrijving'

import objecten from './../../constants/koppelingen'

function getPropertiesWithConnectionsFromCrudObject(
    connectionProperties,
    crudObject
) {
    const propertiesWithExistingConnections = []
    connectionProperties.forEach((property) => {
        const propertyName = objecten[property].propertyName
        if (
            crudObject[propertyName] !== undefined &&
            crudObject[propertyName] !== null &&
            crudObject[propertyName].length > 0 &&
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
}) => {
    // Contains a boolean
    const [dropdownOpen, setDropdownOpen] = React.useState(false)

    // Contains a boolean if the popup to add a new connection is open
    const [popupOpenNieuw, setPopupOpenNieuw] = React.useState(false)

    // Contains a boolean if the popup to edit a connection is open
    const [popupOpenBewerk, setPopupOpenBewerk] = React.useState(false)

    // Contains the object that we are editing in the Edit Popup
    const [popupOpenBewerkItem, setPopupOpenBewerkItem] = React.useState({})

    // Contains the connections
    const [koppelingenRelaties, setKoppelingenRelaties] = React.useState(null)

    // Boolean if all the data is loaded
    const [dataLoaded, setDataLoaded] = React.useState(false)

    // Object containing the connection that is being edited
    const [popupType, setPopupType] = React.useState(null)

    const togglePopupNieuw = (type) => {
        setPopupOpenNieuw(!popupOpenNieuw)
        if (!popupOpenNieuw) {
            setPopupType(type)
        } else {
            setPopupType(null)
        }
    }

    const togglePopupBewerk = (item, propertyName) => {
        setPopupOpenBewerk(!popupOpenBewerk)
        setPopupOpenBewerkItem({
            item: item,
            propertyName: propertyName,
        })
    }

    /**
     * Checks for existing connections
     * If they exist, we add the type and set them in state
     */
    const initializeConnections = React.useCallback(() => {
        const propertiesWithExistingConnections = getPropertiesWithConnectionsFromCrudObject(
            connectionProperties,
            crudObject
        )

        // // If there are no existing connections we return
        // if (propertiesWithExistingConnections.length === 0) {
        //     return
        // }

        // Contains the properties we have already mapped
        // We need this because 'Belang' en 'Taak' are both different types, but they do have the same propertyName on the crudObject
        const propertyNamesMapped = []

        // This object will contain the properties with existing connections
        const newStateKoppelingenRelatiesObject = {}

        propertiesWithExistingConnections.forEach((propertyName) => {
            // Return if we already mapped over this property
            if (propertyNamesMapped.includes(propertyName)) {
                return
            } else {
                propertyNamesMapped.push(propertyName)
            }

            // Create the property on which we will put the objects
            newStateKoppelingenRelatiesObject[propertyName] = []

            crudObject[propertyName].forEach((item) => {
                newStateKoppelingenRelatiesObject[propertyName].push(item)
            })
        })

        setKoppelingenRelaties({ ...newStateKoppelingenRelatiesObject })

        setDataLoaded(true)
    }, [connectionProperties, crudObject])

    React.useEffect(() => {
        initializeConnections()
    }, [initializeConnections])

    // Lege array waar de properties in worden gepushed na er overheen gemap'd te zijn
    // 'Belang' en 'Taak' zijn aparte typen, maar zitten wel beidde op dezelfde propertyName op het crudObject
    // Als tijdens het map'en de propertyName al in de propertyNamesMapped array staat, slaat die 'm over
    let propertyNamesMapped = []

    return (
        <React.Fragment>
            {fieldLabel === 'Koppelingen' ? (
                <React.Fragment>
                    <h3 className="block mb-2 font-bold tracking-wide text-gray-700">
                        Relaties
                    </h3>
                    <p className="mb-8 text-sm text-gray-700">
                        Een relatie ga je, met wederzijds goedkeuren, aan met
                        andere beleidskeuzes. Deze beleidsrelaties kun je op een
                        later moment aangaan vanuit de beheeromgeving onder het
                        kopje 'Beleidsrelaties'.
                    </p>
                </React.Fragment>
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
                id={`form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
            >
                <div className="flex py-2 text-sm font-bold text-gray-700 border-b border-gray-300">
                    <div className="relative w-40 mr-5">Type</div>
                    <div className="w-full">Titel</div>
                </div>
                <ul className="mb-3">
                    {dataLoaded ? (
                        connectionProperties
                            .sort((a, b) => a.localeCompare(b))
                            .map((koppelingRelatieNaam, index) => {
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
                                // TODO: Add types for Verordenings objects. Waiting for the API change
                                return koppelingenRelaties[propertyName].map(
                                    (item, index) => {
                                        let type =
                                            objecten[koppelingRelatieNaam].type
                                        if (type === 'Nationaal Belang') {
                                            console.log(item)
                                            type = item.Type
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
                                                }}
                                            >
                                                <div className="relative w-40 mr-5">
                                                    {type}
                                                </div>
                                                <div className="relative w-full pr-8">
                                                    {item.Titel}
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
            {popupOpenNieuw ? (
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
                    objecten={objecten}
                />
            ) : null}

            {popupOpenBewerk ? (
                <PopupBewerkKoppeling
                    titelMainObject={titelMainObject}
                    type={popupType}
                    togglePopup={togglePopupBewerk}
                    bewerkItem={popupOpenBewerkItem}
                    voegKoppelingRelatieToe={voegKoppelingRelatieToe}
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
                    crudObject={crudObject}
                    objecten={objecten}
                />
            ) : null}
        </React.Fragment>
    )
}

const Dropdown = ({
    dropdownOpen,
    setDropdownOpen,
    titleSingular,
    dataObjectProperty,
    connectionProperties,
    togglePopupNieuw,
    buttonTekst,
}) => {
    const buttonRef = React.useRef()
    const dropdownRef = React.useRef()

    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && buttonRef.current.contains(e.target)) {
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
                className="relative inline-block py-1 pl-4 mt-2 text-sm text-white rounded cursor-pointer mbg-color text mbg-color-darker-hover"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                ref={buttonRef}
                id={`nieuw-item-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
            >
                <span className="inline-block py-1 select-none">
                    {buttonTekst}
                </span>
                <span className="inline-block px-4 py-1 ml-4 text-center border-l m-border-color">
                    <FontAwesomeIcon
                        className="mt-1 text-white"
                        icon={faAngleDown}
                    />
                </span>
                {dropdownOpen ? (
                    <ul
                        className="absolute left-0 w-full text-sm text-gray-700 bg-white rounded shadow top-100"
                        ref={dropdownRef}
                    >
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
                                              className="px-3 py-2 border-b border-gray-300 cursor-pointer hover:bg-gray-100"
                                          >
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

FormFieldRelatieKoppeling.propTypes = {
    buttonTekst: PropTypes.string,
    placeholderTekst: PropTypes.string,
}

export default FormFieldRelatieKoppeling
