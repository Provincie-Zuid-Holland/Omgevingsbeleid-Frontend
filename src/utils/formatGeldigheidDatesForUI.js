import { format, isValid } from "date-fns"

/**
 * Format Begin_Geldigheid and Eind_Geldigheid in order to display them in the UI
 * @param {object} crudObject - Object containing the dates
 * @returns {object} Returns the crudObject with formatted dates
 */
function formatGeldigheidDatesForUI(crudObject) {
    if (!crudObject) return

    /** Format Begin_Geldigheid */
    const beginGeldigheidIsValid =
        crudObject.Begin_Geldigheid !== undefined &&
        crudObject.Begin_Geldigheid !== null &&
        isValid(new Date(crudObject.Begin_Geldigheid))

    if (beginGeldigheidIsValid) {
        crudObject.Begin_Geldigheid = format(
            new Date(crudObject.Begin_Geldigheid),
            "yyyy-MM-dd"
        )
    } else if (crudObject.Begin_Geldigheid === "Invalid Date") {
        crudObject.Begin_Geldigheid = null
    }

    /** Format Eind_Geldigheid */
    const eindGeldigheidIsValid =
        crudObject.Eind_Geldigheid !== undefined &&
        crudObject.Eind_Geldigheid !== null &&
        isValid(new Date(crudObject.Eind_Geldigheid))

    if (eindGeldigheidIsValid) {
        crudObject.Eind_Geldigheid = format(
            new Date(crudObject.Eind_Geldigheid),
            "yyyy-MM-dd"
        )
    } else if (crudObject.Eind_Geldigheid === "Invalid Date") {
        crudObject.Eind_Geldigheid = null
    }

    /** Format Besluit_Datum */
    const besluitDatumIsValid =
        crudObject.Besluit_Datum !== undefined &&
        crudObject.Besluit_Datum !== null &&
        isValid(new Date(crudObject.Besluit_Datum))

    if (besluitDatumIsValid) {
        crudObject.Besluit_Datum = format(
            new Date(crudObject.Besluit_Datum),
            "yyyy-MM-dd"
        )
    } else if (crudObject.Besluit_Datum === "Invalid Date") {
        crudObject.Besluit_Datum = null
    }

    return crudObject
}

export default formatGeldigheidDatesForUI
