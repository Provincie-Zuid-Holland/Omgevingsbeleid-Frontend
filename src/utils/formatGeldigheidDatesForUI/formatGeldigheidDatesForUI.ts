import { isValid } from 'date-fns'

/**
 * Format Begin_Geldigheid and Eind_Geldigheid in order to display them in the UI
 * @param {object} crudObject - Object containing the dates
 * @returns {object} Returns the crudObject with formatted dates
 */
const formatGeldigheidDatesForUI = (crudObject: any) => {
    /** Format Begin_Geldigheid */
    const beginGeldigheidIsValid =
        crudObject.Begin_Geldigheid !== undefined &&
        crudObject.Begin_Geldigheid !== null &&
        isValid(new Date(crudObject.Begin_Geldigheid))

    if (beginGeldigheidIsValid && crudObject.Begin_Geldigheid) {
        crudObject.Begin_Geldigheid = new Date(crudObject.Begin_Geldigheid)
    } else if (crudObject.Begin_Geldigheid === 'Invalid Date') {
        crudObject.Begin_Geldigheid = null as any
    }

    /** Format Eind_Geldigheid */
    const eindGeldigheidIsValid =
        crudObject.Eind_Geldigheid !== undefined &&
        crudObject.Eind_Geldigheid !== null &&
        isValid(new Date(crudObject.Eind_Geldigheid))

    const eindGeldigheidNullValue = '9999-12-31T23:00:00Z'

    if (
        eindGeldigheidIsValid &&
        crudObject.Eind_Geldigheid &&
        crudObject.Eind_Geldigheid !== eindGeldigheidNullValue
    ) {
        crudObject.Eind_Geldigheid = new Date(crudObject.Eind_Geldigheid)
    } else if (
        crudObject.Eind_Geldigheid === 'Invalid Date' ||
        crudObject.Eind_Geldigheid === eindGeldigheidNullValue
    ) {
        crudObject.Eind_Geldigheid = null as any
    }

    /** Format Besluit_Datum */
    const besluitDatumIsValid =
        'Besluit_Datum' in crudObject &&
        crudObject.Besluit_Datum !== undefined &&
        crudObject.Besluit_Datum !== null &&
        isValid(new Date(crudObject.Besluit_Datum))

    if (
        'Besluit_Datum' in crudObject &&
        besluitDatumIsValid &&
        crudObject.Besluit_Datum
    ) {
        crudObject.Besluit_Datum = new Date(crudObject.Besluit_Datum)
    } else if (
        'Besluit_Datum' in crudObject &&
        crudObject.Besluit_Datum === 'Invalid Date'
    ) {
        crudObject.Besluit_Datum = null as any
    }

    return crudObject
}

export default formatGeldigheidDatesForUI
