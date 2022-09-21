import { Button } from '@pzh-ui/components'
import { FloppyDisk, Spinner, Xmark } from '@pzh-ui/icons'
import { useFormikContext } from 'formik'
import { Fragment } from 'react'

import { useVerordening } from '../../verordeningEditContext'

const FormSubmitOrCancel = () => {
    const { state, dispatch } = useVerordening()
    const { resetForm } = useFormikContext()
    const { isLoadingOrSaving } = state

    return (
        <Fragment>
            <Button
                variant="cta"
                type="submit"
                onClick={e => isLoadingOrSaving && e.preventDefault()}
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
                    resetForm()
                    dispatch({ type: 'resetEditingSection' })
                    dispatch({ type: 'setNewSection', payload: null })
                    dispatch({ type: 'setIsAddingSection', payload: false })
                }}
                disabled={isLoadingOrSaving}
                className="ml-1">
                <Xmark size={18} />
            </Button>
        </Fragment>
    )
}
export default FormSubmitOrCancel
