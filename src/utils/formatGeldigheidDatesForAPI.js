function formatGeldigheidDatesForAPI(crudObject) {
    // Converteer de 'YYYY-MM-DD' waarden naar Date objecten
    // Als er geen waarde is, verwijder dan de property
    if (
        crudObject.Begin_Geldigheid !== null &&
        crudObject.Begin_Geldigheid !== ''
    ) {
        crudObject.Begin_Geldigheid = new Date(crudObject.Begin_Geldigheid)
    } else {
        delete crudObject.Begin_Geldigheid
    }

    if (
        crudObject.Eind_Geldigheid !== null &&
        crudObject.Eind_Geldigheid !== ''
    ) {
        crudObject.Eind_Geldigheid = new Date(crudObject.Eind_Geldigheid)
    } else {
        delete crudObject.Eind_Geldigheid
    }

    return crudObject
}

export default formatGeldigheidDatesForAPI
