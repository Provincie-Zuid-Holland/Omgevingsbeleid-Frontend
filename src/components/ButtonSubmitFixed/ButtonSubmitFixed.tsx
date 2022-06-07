import { Button } from '@pzh-ui/components'
import React from 'react'

/**
 * Displays a fixed placed submit button.
 */
interface ButtonSubmitFixedProps {
    disabled?: boolean
    submit?: any
}

function ButtonSubmitFixed({ disabled, submit }: ButtonSubmitFixedProps) {
    if (!submit) return null

    return (
        <div className="fixed bottom-0 right-0 z-10 px-6">
            <div className="inline-block px-4 py-4 bg-white rounded-t shadow">
                <Button
                    disabled={disabled}
                    id="form-submit"
                    variant="primary"
                    onClick={submit}
                    onKeyPress={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                        if (e.key === 'Enter') {
                            submit()
                        }
                    }}>
                    Opslaan
                </Button>
            </div>
        </div>
    )
}

export default ButtonSubmitFixed
