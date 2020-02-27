import { toast } from 'react-toastify'

import scrollToElement from './scrollToElement'
import eindDateIsBeforeBeginDate from './eindDateIsBeforeBeginDate'

function checkRequiredFields(crudObject, dimensieConstants, titelEnkelvoud) {
    const status = crudObject.Status
    const crudObjectProperties = Object.keys(crudObject)

    let pageScrolledToElement = false
    let alleVeldenIngevuld = true

    if (titelEnkelvoud === 'Beleidsbeslissing') {
        crudObjectProperties.forEach(property => {
            if (
                dimensieConstants.CRUD_PROPERTIES[property].required.includes(
                    status
                )
            ) {
                checkIfPropertyHasValue(property)
            }
        })
    } else {
        crudObjectProperties.forEach(property => {
            if (dimensieConstants.CRUD_PROPERTIES[property].required) {
                checkIfPropertyHasValue(property)
            }
        })
        if (
            alleVeldenIngevuld &&
            dimensieConstants.CRUD_PROPERTIES.Eind_Geldigheid.required &&
            dimensieConstants.CRUD_PROPERTIES.Begin_Geldigheid.required
        ) {
            const isEindDateBeforeBegin = eindDateIsBeforeBeginDate(
                titelEnkelvoud,
                crudObject
            )
            if (isEindDateBeforeBegin) {
                alleVeldenIngevuld = false
            }
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
