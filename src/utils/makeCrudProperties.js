// Maakt en returned een array met de bewerkbare properties van het dimensie object
function makeCrudProperties(dimensieConstants) {
    const crudProperties = Object.keys(dimensieConstants.CRUD_PROPERTIES)
    return crudProperties
}

export default makeCrudProperties
