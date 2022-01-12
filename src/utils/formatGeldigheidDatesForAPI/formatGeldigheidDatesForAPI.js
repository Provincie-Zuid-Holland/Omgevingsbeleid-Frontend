/**
 * This function formats the dates from the UI format (yyyy/mm/dd) to a valid datetime for the API
 * @param {object} crudObject - Contains the object we want to POST/PATCH to the API
 */
function formatGeldigheidDatesForAPI(crudObject) {
    /** Format Begin_Geldigheid */
    if (crudObject.hasOwnProperty('Begin_Geldigheid')) {
        if (
            crudObject.Begin_Geldigheid !== null &&
            crudObject.Begin_Geldigheid !== ''
        ) {
            crudObject.Begin_Geldigheid = new Date(crudObject.Begin_Geldigheid)
        } else if (crudObject.Begin_Geldigheid === '') {
            crudObject.Begin_Geldigheid = null
        } else {
            delete crudObject.Begin_Geldigheid
        }
    }

    /** Format Eind_Geldigheid */
    if (crudObject.hasOwnProperty('Eind_Geldigheid')) {
        if (
            crudObject.Eind_Geldigheid !== null &&
            crudObject.Eind_Geldigheid !== ''
        ) {
            crudObject.Eind_Geldigheid = new Date(crudObject.Eind_Geldigheid)
        } else if (crudObject.Eind_Geldigheid === '') {
            crudObject.Eind_Geldigheid = null
        } else {
            delete crudObject.Eind_Geldigheid
        }
    }

    /** Format Besluit_Datum */
    if (crudObject.hasOwnProperty('Besluit_Datum')) {
        if (
            crudObject.Besluit_Datum !== null &&
            crudObject.Besluit_Datum !== ''
        ) {
            crudObject.Besluit_Datum = new Date(crudObject.Besluit_Datum)
        } else if (crudObject.Besluit_Datum === '') {
            crudObject.Besluit_Datum = null
        } else {
            delete crudObject.Besluit_Datum
        }
    }

    return crudObject
}

export default formatGeldigheidDatesForAPI
