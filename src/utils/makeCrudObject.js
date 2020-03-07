import formatGeldigheidDatesForUI from './formatGeldigheidDatesForUI'

// Function to make an object containing the fields that the user can edit
function makeCrudObject({ crudProperties, dimensieConstants, responseObject }) {
    // Key waarden van de properties die gebruikt worden voor het maken van koppelingen
    const koppelingenKeysArray = [
        'Ambities',
        'Belangen',
        'BeleidsRegels',
        'Doelen',
        'Maatregelen',
        'Opgaven',
        'Themas',
        'Verordening',
        'WerkingsGebieden',
    ]

    // Het initiele object wat gereturned zal worden
    // Hierop plaatsen we alle properties die gewijzigd moeten worden
    let crudObject = {}

    if (responseObject) {
        // Als er een response object populaten we het crudObject op basis van de crudProperties met de waarden van het responseObject
        crudProperties.forEach(crudProperty => {
            crudObject[[crudProperty][0]] = responseObject[crudProperty]
        })
    } else {
        // Als er geen responseObject is initializen we de waarde voor elke crudProperty
        crudProperties.forEach(crudProperty => {
            crudObject[crudProperty] =
                dimensieConstants.CRUD_PROPERTIES[crudProperty].initValue
        })
    }

    crudObject = formatGeldigheidDatesForUI(crudObject)

    return crudObject
}

export default makeCrudObject
