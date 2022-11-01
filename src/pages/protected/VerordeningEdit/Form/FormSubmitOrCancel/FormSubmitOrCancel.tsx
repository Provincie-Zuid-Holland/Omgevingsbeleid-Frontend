import { Button } from '@pzh-ui/components'
import { FloppyDisk, Spinner, Xmark } from '@pzh-ui/icons'
import { useFormikContext } from 'formik'
import { Fragment } from 'react'

import { useVerordening } from '../../verordeningEditContext'

interface FormSubmitOrCancelProps {
    reset?: () => void
}

const FormSubmitOrCancel = ({ reset }: FormSubmitOrCancelProps) => {
    const { state, dispatch } = useVerordening()
    const { resetForm } = useFormikContext()
    const { isLoadingOrSaving } = state

    return (
        <Fragment>
            <Button
                variant="cta"
                type="submit"
                onClick={e => {
                    if (isLoadingOrSaving) {
                        e.preventDefault()
                    }
                }}
                disabled={isLoadingOrSaving}
                className="ml-1">
                {isLoadingOrSaving ? (
                    <Spinner className="rotate-icon" />
                ) : (
                    <FloppyDisk size={18} />
                )}
            </Button>
            <Button
                type="button"
                variant="primary"
                onClick={() => {
                    if (reset) reset()
                    resetForm({ values: {} })
                    dispatch({ type: 'resetEditingSection' })
                }}
                disabled={isLoadingOrSaving}
                className="ml-1">
                <Xmark size={18} />
            </Button>
        </Fragment>
    )
}
export default FormSubmitOrCancel
