import React from 'react'

/**
 * Component used to display a FormFieldInputContainer, containing children values within a flex box div within a div.
 * This component is used by the page FormFieldContainerMaatregelen.
 *
 * @component
 *
 * @param {object} children - Parameter that is used to show content within a div tag.
 */
function FormFieldInputContainer({ children }) {
    return (
        <div className="flex flex-wrap mb-6 -mx-3">
            <div className="w-full px-3">{children}</div>
        </div>
    )
}

export default FormFieldInputContainer
