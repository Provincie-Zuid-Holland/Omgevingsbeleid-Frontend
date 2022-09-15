import { FormikProps, FormikErrors } from 'formik'

import { MutateWriteObjects } from '@/types/dimensions'

const scrollToFormikError = (
    errors: FormikErrors<MutateWriteObjects>,
    formRef: React.RefObject<FormikProps<MutateWriteObjects>>
) => {
    const errorNames = Object.keys(errors)
    if (errorNames.length === 0) return

    const errorName = errorNames[0]

    const formElement = document.getElementsByName(errorName)[0]
    if (!formElement) return
    const container = formElement.closest('.container-form-section')

    if (!container) return

    const navigationElement = document.getElementById('top-navigation')
    const navigationHeight = navigationElement?.offsetHeight || 0
    const yPosition =
        (container?.getBoundingClientRect()?.top || 0) +
        window.pageYOffset -
        navigationHeight -
        25

    // Set touched to display error, focus and scroll to field
    formRef.current?.setFieldTouched(errorName, true)
    formElement?.focus()
    window.scrollTo({
        top: yPosition,
    })
}

export default scrollToFormikError
