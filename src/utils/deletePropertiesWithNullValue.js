function deletePropertiesWithNullValue(crudObject) {
    Object.keys(crudObject).forEach((property) => {
        if (crudObject[property] === null) delete crudObject[property]
    })
    return crudObject
}

export default deletePropertiesWithNullValue
