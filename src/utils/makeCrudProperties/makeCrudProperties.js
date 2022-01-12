/**
 * @param {object} dimensieConstants - The constant object
 * @returns {array} - Containing the CRUD properties of the object
 */
const makeCrudProperties = dimensieConstants =>
    Object.keys(dimensieConstants.CRUD_PROPERTIES)

export default makeCrudProperties
