import { format, isValid } from 'date-fns'

/**
 * Format Begin_Geldigheid and Eind_Geldigheid in order to display them in the UI
 * @param {object} crudObject - Object containing the dates
 * @returns {object} Returns the crudObject with formatted dates
 */
function formatGeldigheidDatesForUI(crudObject) {
    if (!crudObject) return

    const beginGeldigheidIsValid =
        crudObject.Begin_Geldigheid !== undefined &&
        crudObject.Begin_Geldigheid !== null &&
        isValid(new Date(crudObject.Begin_Geldigheid))

    const eindGeldigheidIsValid =
        crudObject.Eind_Geldigheid !== undefined &&
        crudObject.Eind_Geldigheid !== null &&
        isValid(new Date(crudObject.Eind_Geldigheid))

    /** Format Begin_Geldigheid */
    if (beginGeldigheidIsValid) {
        crudObject.Begin_Geldigheid = format(
            new Date(crudObject.Begin_Geldigheid),
            'yyyy-MM-dd'
        )
    } else if (crudObject.Begin_Geldigheid === 'Invalid Date') {
        crudObject.Begin_Geldigheid = null
    }

    /** Format Eind_Geldigheid */
    if (eindGeldigheidIsValid) {
        crudObject.Eind_Geldigheid = format(
            new Date(crudObject.Eind_Geldigheid),
            'yyyy-MM-dd'
        )
    } else if (crudObject.Eind_Geldigheid === 'Invalid Date') {
        crudObject.Eind_Geldigheid = null
    }

    return crudObject
}

export default formatGeldigheidDatesForUI
