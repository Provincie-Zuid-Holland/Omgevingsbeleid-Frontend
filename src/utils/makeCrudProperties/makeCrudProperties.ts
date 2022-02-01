import allDimensies from '@/constants/dimensies'
/**
 * @param {object} dimensieConstants - The constant object
 * @returns {array} - Containing the CRUD properties of the object
 */
const makeCrudProperties = (
    dimensieConstants: typeof allDimensies[keyof typeof allDimensies]
) => Object.keys(dimensieConstants.CRUD_PROPERTIES || {})

export default makeCrudProperties
