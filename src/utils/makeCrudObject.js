import clonedeep from 'lodash.clonedeep'

import formatGeldigheidDatesForUI from './formatGeldigheidDatesForUI'

/**
 * Function to initialize an object with the appropriate properties and values
 * @param {object} props
 * @param {string[]} crudProperties - Contains the CRUD properties
 * @param {object} dimensieConstants - Contains the constant object
 * @param {undefined|object} existingObj - Contains the existing object (when the user is editing an existing one)
 * @param {undefined|string} modus - Contains a string of value 'wijzig_vigerend' when the user is editing an object with a Status of 'Vigerend'
 * @returns {object} - Returns the prepared CRUD Object
 */
function makeCrudObject({
    crudProperties,
    dimensieConstants,
    existingObj,
    modus,
}) {
    const crudObject = {}

    if (existingObj) {
        const wijzigVigerend = modus === 'wijzig_vigerend'
        const isMaatregelOrBeleidskeuze =
            dimensieConstants.TITLE_SINGULAR === 'Beleidskeuze' ||
            dimensieConstants.TITLE_SINGULAR === 'Maatregel'

        /**
         * If the user is editing an object that has a Status 'Vigerend' and
         * is in the 'wijzigVigerend' mode we add the previous UUID as the value of 'Aanpassing_Op'
         */
        if (isMaatregelOrBeleidskeuze && wijzigVigerend) {
            crudObject.Aanpassing_Op = existingObj.UUID
        }

        /** Initialize the crudObject with the values from the existing Object */
        crudProperties.forEach(crudProperty => {
            const resetStatus =
                crudProperty === 'Status' &&
                existingObj.Status === 'Vigerend' &&
                isMaatregelOrBeleidskeuze &&
                !wijzigVigerend

            if (resetStatus) {
                crudObject[crudProperty] = 'Ontwerp GS Concept'
            } else {
                crudObject[crudProperty] = existingObj[crudProperty]
            }
        })
    } else {
        /** Initialize values from the crud properties constant */
        crudProperties.forEach(crudProperty => {
            crudObject[crudProperty] = clonedeep(
                dimensieConstants.CRUD_PROPERTIES[crudProperty].initValue
            )
        })
    }

    /** Format dates to 'yyyy-MM-dd' in order to display in UI */
    return formatGeldigheidDatesForUI(crudObject)
}

export default makeCrudObject
