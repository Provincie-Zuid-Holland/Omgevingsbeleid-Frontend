import { format, isValid } from 'date-fns'

// This function formats the date properties Begin_Geldigheid and Eind_Geldigheid. It needs the whole crudObject as a parameter, formats the dates and returns the whole crudObject.
// The date values are in the timestamp data type. We first convert this to a Date object and then format this using date-fns format() function to a string.
function formatGeldigheidDatesForUI(crudObject) {
    // Format Begin_Geldigheid
    if (
        crudObject.Begin_Geldigheid !== undefined &&
        crudObject.Begin_Geldigheid !== null &&
        isValid(crudObject.Begin_Geldigheid)
    ) {
        crudObject.Begin_Geldigheid = format(
            new Date(crudObject.Begin_Geldigheid),
            'yyyy-MM-dd'
        )
    } else if (crudObject.Begin_Geldigheid === 'Invalid Date') {
        crudObject.Begin_Geldigheid = null
    }

    // Format Eind_Geldigheid
    if (
        crudObject.Eind_Geldigheid !== undefined &&
        crudObject.Eind_Geldigheid !== null &&
        isValid(crudObject.Eind_Geldigheid)
    ) {
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
