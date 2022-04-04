import cloneDeep from 'lodash.clonedeep'

import { MutateWriteObjects } from '@/types/dimensions'
/**
 * This function formats the dates from the UI format (yyyy/mm/dd) to a valid datetime for the API
 * @param {object} crudObject - Contains the object we want to POST/PATCH to the API
 */
function formatDatesForAPI(crudObject: MutateWriteObjects) {
    const formattedCrudObject = cloneDeep(crudObject) as MutateWriteObjects

    const formatDate = (
        crudObj: MutateWriteObjects,
        property: 'Begin_Geldigheid' | 'Eind_Geldigheid' | 'Besluit_Datum'
    ) => {
        if (property === 'Besluit_Datum') {
            if (property in crudObj) {
                if (crudObj[property] === '') {
                    crudObj[property] = undefined
                } else if (crudObj[property]) {
                    crudObj[property] = new Date(
                        crudObj[property]!
                    ).toISOString()
                }
            }
        } else if (property in crudObj) {
            if (crudObj[property] === '') {
                crudObj[property] = undefined
            } else if (crudObj[property]) {
                crudObj[property] = new Date(crudObj[property]!).toISOString()
            }
        }

        return crudObj
    }

    formatDate(formattedCrudObject, 'Begin_Geldigheid')
    formatDate(formattedCrudObject, 'Eind_Geldigheid')
    formatDate(formattedCrudObject, 'Besluit_Datum')

    return formattedCrudObject
}

export default formatDatesForAPI
