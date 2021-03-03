import React from 'react'
/**
 * A component that renders a fixed place submit button element with the text "Opslaan", in which a user can submit data in a form.
 *
 * @component
 */
function ButtonSubmitFixed() {
    return (
        <div className="fixed bottom-0 right-0 z-10 px-6">
            <div className="inline-block px-4 py-4 bg-white rounded-t shadow">
                <button
                    id="form-submit"
                    className="px-4 py-2 text-sm font-bold leading-tight text-white rounded cursor-pointer mbg-color hover:underline"
                    type="submit"
                >
                    Opslaan
                </button>
            </div>
        </div>
    )
}

export default ButtonSubmitFixed
