import { FormikHelpers } from 'formik'

import { HTTPValidationError } from '@/api/fetchers.schemas'

export interface Error {
    data: HTTPValidationError
}

const ERRORS: { [key: string]: string } = {
    'none is not an allowed value': 'Het veld is niet (goed) ingevuld.',
    'field required': 'Het veld is niet (goed) ingevuld.',
    'Input should be a valid string': 'Het veld is niet (goed) ingevuld.',
}

const KEYS: { [key: string]: string } = {
    '/Author': 'auteur',
    '/Creator': 'creator',
    '/Producer': 'producent',
    '/Title': 'titel',
    '/Subject': 'onderwerp',
    '/Keywords': 'trefwoorden',
}

/**
 * Falls back to the raw metadata key (without leading slash) for fields
 * the backend can return that aren't in the translation table above.
 */
const getFieldLabel = (key: string) => KEYS[key] || key.replace(/^\//, '')

const handleError = <T>(err: Error, helpers: FormikHelpers<T>) => {
    Array.isArray(err.data?.detail) &&
        err.data?.detail?.forEach(item => {
            // Remove "body" from the location path if it exists as the first element
            const fieldPath =
                item.loc[0] === 'body' ? item.loc.slice(1) : item.loc
            const fieldName = fieldPath.join('.')

            helpers.setFieldError(fieldName, ERRORS[item.msg] || item.msg)
            helpers.setFieldTouched(fieldName, true)
        })

    helpers.setSubmitting(false)
}

export const handleFileError = <T>(err: Error, helpers: FormikHelpers<T>) => {
    if (Array.isArray(err.data?.detail)) {
        err.data.detail.forEach((item: any) => {
            const metadataField = KEYS[item.key] ?? item.key

            helpers.setFieldTouched('File', true, false)
            helpers.setFieldError(
                'File',
                `Het veld '${metadataField}' in de meta-data van het document is gevuld, de waarde hiervan is “${item.value}”`
            )
        })
    }

    helpers.setSubmitting(false)
}

export default handleError
