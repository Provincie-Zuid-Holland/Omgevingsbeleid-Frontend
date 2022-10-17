import { filteredDimensieConstants } from '@/constants/dimensies'
import { MutateWriteObjects } from '@/types/dimensions'
import checkPropertyForValidValue from '@/utils/checkPropertyForValidValue'

/**
 * Function that checks the values of the formik form for validity
 */
const validateFormikValues = (
    values: MutateWriteObjects,
    dimensieConstants: filteredDimensieConstants
) => {
    const errors: {
        [key: string]: string
    } = {}

    const propertiesToValidate = Object.keys(values) as Array<
        keyof typeof values
    >

    propertiesToValidate.forEach(property => {
        const defaultErrorMessage = 'Dit veld is verplicht'
        const customErrorMessage =
            dimensieConstants.CRUD_PROPERTIES[
                property as keyof typeof dimensieConstants.CRUD_PROPERTIES
            ]?.requiredMessage

        const isFieldRequired =
            dimensieConstants.CRUD_PROPERTIES[
                property as keyof typeof dimensieConstants.CRUD_PROPERTIES
            ]?.required

        const propertyHasValidValue = checkPropertyForValidValue(
            values,
            property
        )

        const policyObjectHasStatus =
            Array.isArray(isFieldRequired) &&
            'Status' in values &&
            values.Status !== undefined

        const policyWithStatusAndIsRequired =
            policyObjectHasStatus &&
            isFieldRequired.includes(values.Status!) &&
            !propertyHasValidValue

        const policyWithoutStatusAndIsRequired =
            isFieldRequired && !propertyHasValidValue

        if (
            policyWithStatusAndIsRequired ||
            (policyWithoutStatusAndIsRequired && !policyObjectHasStatus)
        ) {
            errors[property] = customErrorMessage || defaultErrorMessage
        }
    })

    return errors
}

export default validateFormikValues
