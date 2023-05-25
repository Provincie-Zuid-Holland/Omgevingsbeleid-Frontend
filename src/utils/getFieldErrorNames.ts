import { FormikErrors } from 'formik'

const getFieldErrorNames = (formikErrors: FormikErrors<unknown>) => {
    const transformObjectToDotNotation = (
        obj: any,
        prefix = '',
        result: any[] = []
    ) => {
        Object.keys(obj).forEach(key => {
            const value = obj[key]
            if (!value) return

            const nextKey = prefix ? `${prefix}.${key}` : key
            if (typeof value === 'object') {
                transformObjectToDotNotation(value, nextKey, result)
            } else {
                result.push(nextKey)
            }
        })

        return result
    }

    return transformObjectToDotNotation(formikErrors)
}

export default getFieldErrorNames
