import cloneDeep from 'lodash.clonedeep'

import {
    PossibleCrudObjects,
    PossiblePATCHCrudObjects,
} from '@/types/dimensions'
/**
 * This function formats the dates from the UI format (yyyy/mm/dd) to a valid datetime for the API
 * @param {object} crudObject - Contains the object we want to POST/PATCH to the API
 */
function formatGeldigheidDatesForAPI(crudObject: PossibleCrudObjects) {
    const formattedCrudObject = cloneDeep(
        crudObject
    ) as PossiblePATCHCrudObjects

    type Keys<T> = T extends { [key: string]: any } ? keyof T : never
    type PossiblePatchKeys = Keys<PossiblePATCHCrudObjects>

    const formatDate = (
        crudObj: PossiblePATCHCrudObjects,
        property: 'Begin_Geldigheid' | 'Eind_Geldigheid' | 'Besluit_Datum'
    ) => {
        if (crudObj.hasOwnProperty(property)) {
            if (crudObj[property] === '') {
                crudObj[property] = undefined
            } else if (crudObj[property]) {
                crudObj[property] = new Date(crudObj[property]!).toISOString()
            }
        }

        return crudObj
    }

    /** Format Begin_Geldigheid */
    formatDate(formattedCrudObject, 'Begin_Geldigheid')
    formatDate(formattedCrudObject, 'Eind_Geldigheid')
    formatDate(formattedCrudObject, 'Besluit_Datum')

    if (formattedCrudObject.hasOwnProperty('Begin_Geldigheid')) {
        if (formattedCrudObject.Begin_Geldigheid === '') {
            formattedCrudObject.Begin_Geldigheid = undefined
        } else if (formattedCrudObject.Begin_Geldigheid) {
            formattedCrudObject.Begin_Geldigheid = new Date(
                formattedCrudObject.Begin_Geldigheid
            ).toISOString()
        }
    }

    /** Format Eind_Geldigheid */
    if (formattedCrudObject.hasOwnProperty('Eind_Geldigheid')) {
        if (formattedCrudObject.Eind_Geldigheid === '') {
            formattedCrudObject.Eind_Geldigheid = undefined
        } else if (formattedCrudObject.Eind_Geldigheid) {
            formattedCrudObject.Eind_Geldigheid = new Date(
                formattedCrudObject.Eind_Geldigheid
            ).toISOString()
        }
    }

    /** Format Besluit_Datum */

    if (formattedCrudObject.hasOwnProperty('Besluit_Datum')) {
        if (
            formattedCrudObject.Besluit_Datum !== null &&
            formattedCrudObject.Besluit_Datum !== ''
        ) {
            formattedCrudObject.Besluit_Datum = new Date(
                formattedCrudObject.Besluit_Datum
            )
        } else if (formattedCrudObject.Besluit_Datum === '') {
            formattedCrudObject.Besluit_Datum = null
        } else {
            delete formattedCrudObject.Besluit_Datum
        }
    }

    return crudObject
}

export default formatGeldigheidDatesForAPI
