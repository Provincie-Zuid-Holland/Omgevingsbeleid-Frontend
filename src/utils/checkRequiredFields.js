import { toast } from 'react-toastify'

import scrollToElement from './scrollToElement'
import eindDateIsBeforeBeginDate from './eindDateIsBeforeBeginDate'

function checkRequiredFields(crudObject, dimensieConstants, titelEnkelvoud) {
    const status = crudObject.Status
    const crudObjectProperties = Object.keys(crudObject)

    // Er kunnen meerdere properties niet ingevuld zijn, maar er kan maar naar 1 element gescrolled worden. Zodra dat is gebeurd zetten we de 'pageScrolledToElement' naar true en zal de scrollToElement functie niet meer aangeroepen worden
    let pageScrolledToElement = false

    // Boolean om te returnen
    let alleVeldenIngevuld = true

    // De beleidsbeslissingen bevatten niet een boolean property met de required waarde, maar een array met de statussen waarin dat property verplicht is
    if (titelEnkelvoud === 'Beleidsbeslissing') {
        crudObjectProperties.forEach(property => {
            if (
                dimensieConstants.CRUD_PROPERTIES[property] &&
                dimensieConstants.CRUD_PROPERTIES[property].required.includes(
                    status
                )
            ) {
                checkIfPropertyHasValue(property)
            }
        })
    } else {
        crudObjectProperties.forEach(property => {
            if (
                dimensieConstants.CRUD_PROPERTIES[property] &&
                dimensieConstants.CRUD_PROPERTIES[property].required
            ) {
                checkIfPropertyHasValue(property)
            }
        })
    }

    // Als beidde velden een waarde hebben wordt er gekeken of de eind datum niet voor de begin datum is. Als dat wel het geval is krijgt de gebruiker in notificatie en krijgt alleVeldenIngevuld de waarde false
    if (
        alleVeldenIngevuld &&
        crudObject.Begin_Geldigheid !== null &&
        crudObject.Begin_Geldigheid !== '' &&
        crudObject.Eind_Geldigheid !== null &&
        crudObject.Eind_Geldigheid !== ''
    ) {
        const isEindDateBeforeBegin = eindDateIsBeforeBeginDate(
            titelEnkelvoud,
            crudObject
        )
        if (isEindDateBeforeBegin) {
            alleVeldenIngevuld = false
        }
    }

    function checkIfPropertyHasValue(property) {
        const propertyHasValue =
            crudObject[property] !== undefined &&
            crudObject[property] !== null &&
            crudObject[property] !== [] &&
            crudObject[property] !== '' &&
            crudObject[property] !== 'Invalid Date'

        if (!propertyHasValue) {
            // Notificeer de gebruiker
            const titelEnkelvoud = dimensieConstants.TITEL_ENKELVOUD
            toast(dimensieConstants.CRUD_PROPERTIES[property].requiredMessage)
            console.warn(
                `Element met id 'form-field-${titelEnkelvoud.toLowerCase()}-${property.toLowerCase()}' heeft geen waarde`
            )

            // !REFACTOR! Scope creep alleVeldenIngevuld
            // Als er nog niet naar een element is gescrolled, scroll naar het element
            if (!pageScrolledToElement) {
                const elSelector = `form-field-${titelEnkelvoud.toLowerCase()}-${property.toLowerCase()}`
                scrollToElement(elSelector)
                pageScrolledToElement = true
                alleVeldenIngevuld = false
            }
        }
    }

    return alleVeldenIngevuld
}

export default checkRequiredFields
