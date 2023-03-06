import { Button } from '@pzh-ui/components'
import classNames from 'classnames'

/**
 * Displays a fixed placed submit button.
 */
interface ButtonSubmitFixedProps {
    submit?: (() => void) | null
    disabled?: boolean
    scrollToError?: () => void
}

function ButtonSubmitFixed({
    submit,
    disabled,
    scrollToError,
}: ButtonSubmitFixedProps) {
    if (!submit) return null

    return (
        <div className="fixed bottom-0 right-0 z-10 px-6">
            <div className="relative z-10 inline-block px-4 py-4 bg-white rounded-t shadow">
                <div
                    className={classNames(
                        'absolute top-0 left-0 z-10 w-full h-full',
                        disabled ? '' : 'pointer-events-none'
                    )}
                    onClick={() => {
                        if (disabled && scrollToError) {
                            scrollToError()
                        }
                    }}
                />
                <Button
                    id="form-submit"
                    type="button"
                    onPress={submit}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            submit()
                        }
                    }}
                    isDisabled={disabled}>
                    Opslaan
                </Button>
            </div>
        </div>
    )
}

export default ButtonSubmitFixed
