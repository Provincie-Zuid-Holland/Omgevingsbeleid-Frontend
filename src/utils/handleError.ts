import { FormikHelpers } from 'formik'

import { HTTPValidationError } from '@/api/fetchers.schemas'

export interface Error {
    data: HTTPValidationError
}

const ERRORS: { [key: string]: string } = {
    'none is not an allowed value': 'Dit veld is verplicht.',
}

const handleError = <T>(err: Error, helpers: FormikHelpers<T>) => {
    Array.isArray(err.data?.detail) &&
        err.data?.detail?.forEach(item => {
            helpers.setFieldError(
                item.loc.join('.'),
                ERRORS[item.msg] || item.msg
            )
            helpers.setFieldTouched(item.loc.join('.'), true)
        })

    helpers.setSubmitting(false)
}

export default handleError
