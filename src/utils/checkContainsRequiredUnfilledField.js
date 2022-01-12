import { toast } from 'react-toastify'

import scrollToElement from './scrollToElement'

/**
 * @param {string} property Contains the property that we want to check
 * @param {object} crudObject Contains the object that is being edited
 * @returns {boolean} indicating if object has a value on the property
 */
const checkIfPropertyHasValue = (property, crudObject) => {
    const isEmptyArray =
        Array.isArray(crudObject[property]) && crudObject[property].length === 0

    const propertyHasValue =
        crudObject[property] !== undefined &&
        crudObject[property] !== null &&
        crudObject[property] !== '' &&
        crudObject[property] !== 'Invalid Date' &&
        crudObject[property] !== '1753-01-01' &&
        crudObject[property] !== '10000-01-01' &&
        crudObject[property] !== '<p><br></p>' &&
        !isEmptyArray

    return propertyHasValue
}

/**
 * Some crudObjects have a Status field. For these objects we want to check the required field based on the status
 * @param {object} crudObject
 * @returns {boolean} indicating if this object has a status field
 */
const checkIfObjectHasStatusField = crudObject =>
    crudObject.hasOwnProperty('Status')

/**
 * @param {string} property Contains the property that we want to check
 * @param {object} crudObject Contains the object that is being edited
 * @param {object} dimensieConstants Contains the variables of this object type
 * @returns a Boolean indicating if the property is required
 */
const checkIfPropertyIsRequired = (property, crudObject, dimensieConstants) => {
    const objectHasStatusField = checkIfObjectHasStatusField(crudObject)
    if (dimensieConstants.TITLE_SINGULAR === 'Verordening') {
        return false
    } else if (objectHasStatusField) {
        const status = crudObject.Status
        return dimensieConstants.CRUD_PROPERTIES[property]?.required.includes(
            status
        )
    } else {
        return dimensieConstants.CRUD_PROPERTIES[property].required
    }
}

/**
 * Triggers a toast notification and scrolls to the element
 * @param {object} dimensieConstants Contains the variables of this object type
 * @param {string} property Contains the property that we want to check
 * @param {boolean} scrolledToElement Indicates if the browser is already scrolled to an element
 */
const notifyUser = (dimensieConstants, property, scrolledToElement) => {
    const titleSingular = dimensieConstants.TITLE_SINGULAR

    toast(dimensieConstants.CRUD_PROPERTIES[property].requiredMessage)

    console.warn(
        `Element met id 'form-field-${titleSingular.toLowerCase()}-${property.toLowerCase()}' heeft geen waarde`
    )

    if (scrolledToElement) return

    const elementID = `form-field-${titleSingular.toLowerCase()}-${property.toLowerCase()}`
    scrollToElement(elementID)
}

/**
 * Function that checks if all the required fields are filled in. If not it scrolls to that element and displays a toast notification informing the user.
 * @param {object} crudObject Contains the object that is being edited
 * @param {object} dimensieConstants Contains the variables of this object type
 * @param {string} titleSingular Contains the title of the object type
 * @param {boolean} wijzigVigerend True if the user is editing an object that is vigerend while skipping the decision making process. In that case the user can only edit the persons connected to the object.
 * @returns a boolean indicating if all the required fields have been filled in
 */
function checkContainsRequiredUnfilledField(
    crudObject,
    dimensieConstants,
    titleSingular,
    wijzigVigerend
) {
    const wijzigVigerendFields = [
        'Eigenaar_1',
        'Eigenaar_2',
        'Portefeuillehouder_1',
        'Portefeuillehouder_2',
        'Opdrachtgever',
    ]

    const crudObjectProperties = wijzigVigerend
        ? wijzigVigerendFields
        : Object.keys(crudObject)

    // Indicator to only trigger a page scroll once in notifyUser()
    let scrolledToElement = false

    // Map over the properties and return a 'false' value if
    // the property IS required and IS NOT filled in.
    // Ele we return a 'true' value.
    const filledInValues = crudObjectProperties.map(property => {
        const propertyIsRequired = checkIfPropertyIsRequired(
            property,
            crudObject,
            dimensieConstants
        )

        if (!propertyIsRequired) return true

        const hasValue = checkIfPropertyHasValue(property, crudObject)

        if (hasValue) {
            return true
        } else {
            notifyUser(dimensieConstants, property, scrolledToElement)
            scrolledToElement = true
            return false
        }
    })

    const containsRequiredUnfilledField = filledInValues.includes(false)
    return containsRequiredUnfilledField
}

export default checkContainsRequiredUnfilledField
