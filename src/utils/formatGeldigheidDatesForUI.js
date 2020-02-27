import { format } from 'date-fns'

// De data worden opgeslagen in Timestamp objecten. Om deze in de UI weer te geven moeten we deze omzetten naar het formaat 'YYYY-MM-DD'
function formatGeldigheidDatesForUI(crudObject) {
    // Format Begin_Geldigheid
    if (
        crudObject.Begin_Geldigheid !== undefined &&
        crudObject.Begin_Geldigheid !== null
    ) {
        crudObject.Begin_Geldigheid = format(
            crudObject.Begin_Geldigheid,
            'YYYY-MM-DD'
        )
    } else if (crudObject.Begin_Geldigheid === 'Invalid Date') {
        crudObject.Begin_Geldigheid = null
    }

    // Format Eind_Geldigheid
    if (
        crudObject.Eind_Geldigheid !== undefined &&
        crudObject.Eind_Geldigheid !== null
    ) {
        crudObject.Eind_Geldigheid = format(
            crudObject.Eind_Geldigheid,
            'YYYY-MM-DD'
        )
    } else if (crudObject.Eind_Geldigheid === 'Invalid Date') {
        crudObject.Eind_Geldigheid = null
    }

    return crudObject
}

export default formatGeldigheidDatesForUI
