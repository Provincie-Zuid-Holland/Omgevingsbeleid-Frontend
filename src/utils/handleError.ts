import { FormikHelpers } from 'formik'

import { HTTPValidationError } from '@/api/fetchers.schemas'

interface Error {
    data: HTTPValidationError
}

const handleError = <T>(err: Error, helpers: FormikHelpers<T>) => {
    err.data?.detail?.forEach(item =>
        helpers.setFieldError(item.loc[1].toString(), item.msg)
    )

    helpers.setSubmitting(false)
}

export default handleError
