// This function creates new Date objects for the formatted date properties of a crudObject.
// If there is no date value

function formatGeldigheidDatesForAPI(crudObject) {
    if (
        crudObject.Begin_Geldigheid !== null &&
        crudObject.Begin_Geldigheid !== ""
    ) {
        crudObject.Begin_Geldigheid = new Date(crudObject.Begin_Geldigheid)
    } else if (crudObject.Begin_Geldigheid === "") {
        crudObject.Begin_Geldigheid = null
    } else {
        delete crudObject.Begin_Geldigheid
    }

    if (
        crudObject.Eind_Geldigheid !== null &&
        crudObject.Eind_Geldigheid !== ""
    ) {
        crudObject.Eind_Geldigheid = new Date(crudObject.Eind_Geldigheid)
    } else if (crudObject.Eind_Geldigheid === "") {
        crudObject.Eind_Geldigheid = null
    } else {
        delete crudObject.Eind_Geldigheid
    }

    return crudObject
}

export default formatGeldigheidDatesForAPI
