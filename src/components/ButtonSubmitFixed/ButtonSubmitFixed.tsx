import { KeyboardEvent, MouseEvent } from 'react'

/**
 * Displays a fixed placed submit button.
 */
interface ButtonSubmitFixedProps {
    submit?: ((e: MouseEvent | KeyboardEvent) => void) | null
}

function ButtonSubmitFixed({ submit }: ButtonSubmitFixedProps) {
    if (!submit) return null

    return (
        <div className="fixed bottom-0 right-0 z-10 px-6">
            <div className="inline-block px-4 py-4 bg-white rounded-t shadow">
                <button
                    id="form-submit"
                    className="px-4 py-2 text-sm font-bold leading-tight text-white rounded cursor-pointer bg-pzh-blue hover:underline"
                    type="button"
                    onClick={e => submit(e)}
                    onKeyPress={e => {
                        if (e.key === 'Enter') {
                            submit(e)
                        }
                    }}>
                    Opslaan
                </button>
            </div>
        </div>
    )
}

export default ButtonSubmitFixed
