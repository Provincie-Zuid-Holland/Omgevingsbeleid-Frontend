import { Button } from '@pzh-ui/components'
import { FloppyDisk, Spinner, Xmark } from '@pzh-ui/icons'
import React, { Fragment } from 'react'

import { useVerordening } from '../../verordeningEditContext'

export interface FormSubmitOrCancelProps {}

const FormSubmitOrCancel = () => {
    const { state, dispatch } = useVerordening()
    const { isLoadingOrSaving } = state

    return (
        <Fragment>
            <Button
                variant="cta"
                type="submit"
                onClick={e => {
                    isLoadingOrSaving && e.preventDefault()
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