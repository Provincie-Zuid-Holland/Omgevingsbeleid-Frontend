import formatGeldigheidDatesForUI from './formatGeldigheidDatesForUI'

// Function to make an object containing the fields that the user can edit
// If wijzigVigerend is passed it means the user is editing a beleidskeuze without changing the 'vigerend' status
function makeCrudObject({
    crudProperties,
    dimensieConstants,
    responseObject,
    modus,
}) {
    // Het initiele object wat gereturned zal worden
    // Hierop plaatsen we alle properties die gewijzigd moeten worden
    let crudObject = {}

    if (responseObject) {
        const wijzigVigerend = modus === 'wijzig_vigerend'

        // If we patch a 'Beleidskeuze' or a 'Maatregel' we need to check the status
        // If the .Status property is 'Vigerend' we need to change it to 'Ontwerp GS Concept'
        // But only if the user is not editing a vigerend without going through the process
        const isMaatregelOrBeleidskeuze =
            dimensieConstants.TITLE_SINGULAR === 'Beleidskeuze' ||
            dimensieConstants.TITLE_SINGULAR === 'Maatregel'

        if (isMaatregelOrBeleidskeuze && wijzigVigerend) {
            crudObject.Aanpassing_Op = responseObject.UUID
        }

        // Als er een response object populaten we het crudObject op basis van de crudProperties met de waarden van het responseObject
        // Het response object is het gekregen object van de API
        crudProperties.forEach((crudProperty) => {
            if (
                (crudProperty === 'Status' &&
                    isMaatregelOrBeleidskeuze &&
                    !wijzigVigerend &&
                    responseObject[crudProperty] === 'Gepubliceerd') ||
                (crudProperty === 'Status' &&
                    isMaatregelOrBeleidskeuze &&
                    !wijzigVigerend &&
                    responseObject[crudProperty] === 'Vigerend')
            ) {
                crudObject[crudProperty] = 'Ontwerp GS Concept'
            } else {
                // Wijs de waarde aan van het responseObject die we terugkregen van het responseObject
                crudObject[crudProperty] = responseObject[crudProperty]
            }
        })
    } else {
        // Als er geen responseObject is initializen we de waarde voor elke crudProperty
        crudProperties.forEach((crudProperty) => {
            crudObject[crudProperty] =
                dimensieConstants.CRUD_PROPERTIES[crudProperty].initValue
        })
    }

    crudObject = formatGeldigheidDatesForUI(crudObject)

    return crudObject
}

export default makeCrudObject
