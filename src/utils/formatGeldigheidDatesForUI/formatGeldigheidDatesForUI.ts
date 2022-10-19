import { isValid } from 'date-fns'

import formatDate from '../formatDate'

/**
 * Format Begin_Geldigheid and Eind_Geldigheid in order to display them in the UI
 * @param {object} crudObject - Object containing the dates
 * @returns {object} Returns the crudObject with formatted dates
 */
function formatGeldigheidDatesForUI(crudObject: any) {
    if (!crudObject) return

    /** Currently the API fills in posted dates with a null value for a Datetime */
    const nullDateValuesFromAPI = [
        '1753-01-01T00:00:00Z',
        '9999-12-31T23:59:59Z',
        '9999-12-31T23:00:00Z',
    ]

    /** Format Begin_Geldigheid */
    const beginGeldigheidIsValid =
        crudObject.Begin_Geldigheid !== undefined &&
        crudObject.Begin_Geldigheid !== null &&
        !nullDateValuesFromAPI.includes(crudObject.Begin_Geldigheid) &&
        isValid(new Date(crudObject.Begin_Geldigheid))

    if (beginGeldigheidIsValid) {
        crudObject.Begin_Geldigheid = formatDate(
            new Date(crudObject.Begin_Geldigheid),
            'yyyy-MM-dd'
        )
    } else {
        crudObject.Begin_Geldigheid = null
    }

    /** Format Eind_Geldigheid */
    const eindGeldigheidIsValid =
        crudObject.Eind_Geldigheid !== undefined &&
        crudObject.Eind_Geldigheid !== null &&
        !nullDateValuesFromAPI.includes(crudObject.Eind_Geldigheid) &&
        isValid(new Date(crudObject.Eind_Geldigheid))

    if (eindGeldigheidIsValid) {
        crudObject.Eind_Geldigheid = formatDate(
            new Date(crudObject.Eind_Geldigheid),
            'yyyy-MM-dd'
        )
    } else {
        crudObject.Eind_Geldigheid = null
    }

    /** Format Besluit_Datum */
    const besluitDatumIsValid =
        crudObject.Besluit_Datum !== undefined &&
        crudObject.Besluit_Datum !== null &&
        isValid(new Date(crudObject.Besluit_Datum))

    if (besluitDatumIsValid) {
        crudObject.Besluit_Datum = formatDate(
            new Date(crudObject.Besluit_Datum),
            'yyyy-MM-dd'
        )
    } else if (crudObject.Besluit_Datum === 'Invalid Date') {
        crudObject.Besluit_Datum = null
    }

    return crudObject
}

export default formatGeldigheidDatesForUI
