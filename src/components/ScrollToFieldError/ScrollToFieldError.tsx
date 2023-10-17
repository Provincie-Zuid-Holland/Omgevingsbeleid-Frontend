import { useUpdateEffect } from '@react-hookz/web'
import { useFormikContext } from 'formik'

import getFieldErrorNames from '@/utils/getFieldErrorNames'

const ScrollToFieldError = () => {
    const { submitCount, isValid, errors } = useFormikContext()

    useUpdateEffect(() => {
        if (isValid) return

        const fieldErrorNames = getFieldErrorNames(errors)
        if (fieldErrorNames.length <= 0) return

        const element =
            document.querySelector(`input[name='${fieldErrorNames[0]}']`) ||
            document.querySelector(`label[for='${fieldErrorNames[0]}']`)
        if (!element) return

        // Scroll to first known error into view
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, [submitCount])

    return null
}

export default ScrollToFieldError
