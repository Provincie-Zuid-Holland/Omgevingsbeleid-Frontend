/**
 *
 * @param {object} crudObject - Object that you want to properties with null values removed from
 * @returns {object} - Returns the same object where the properties with a null value are removed
 */
function deletePropertiesWithNullValue(crudObject) {
    Object.keys(crudObject).forEach((property) => {
        if (crudObject[property] === null) delete crudObject[property]
    })
    return crudObject
}

export default deletePropertiesWithNullValue
