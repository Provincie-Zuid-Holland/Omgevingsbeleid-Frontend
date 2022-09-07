import { MutateWriteObjects } from '@/types/dimensions'

const checkPropertyForValidValue = (
    obj: MutateWriteObjects,
    property: keyof MutateWriteObjects
) => {
    const isEmptyArray =
        Array.isArray(obj[property]) && obj[property]?.length === 0

    const propertyHasValue =
        obj[property] !== undefined &&
        obj[property] !== null &&
        obj[property] !== '' &&
        obj[property] !== 'Invalid Date' &&
        obj[property] !== '1753-01-01' &&
        obj[property] !== '10000-01-01' &&
        obj[property] !== '<p><br></p>' &&
        !isEmptyArray

    return propertyHasValue
}

export default checkPropertyForValidValue
