import formatGeldigheidDatesForUI from './formatGeldigheidDatesForUI'

// Function to make an object containing the fields that the user can edit
function makeCrudObject({ crudProperties, dimensieConstants, responseObject }) {
    // Het initiele object wat gereturned zal worden
    // Hierop plaatsen we alle properties die gewijzigd moeten worden
    let crudObject = {}

    if (responseObject) {
        // Als er een response object populaten we het crudObject op basis van de crudProperties met de waarden van het responseObject
        // Het response object is het gekregen object van de API
        crudProperties.forEach((crudProperty) => {
            if (
                // Als het een beleidsbeslissing met een Vigerende Status wijzigen we automatisch het Status property naar die van 'Ontwerp GS Concept'.
                crudProperty === 'Status' &&
                dimensieConstants.TITEL_ENKELVOUD === 'Beleidsbeslissing' &&
                (responseObject[crudProperty] === 'Gepubliceerd' ||
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
