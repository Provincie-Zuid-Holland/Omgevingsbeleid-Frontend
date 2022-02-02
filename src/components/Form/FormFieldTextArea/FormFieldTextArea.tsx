import { ChangeEventHandler, useEffect, useRef } from 'react'

import FormFieldTitelEnBeschrijving from '../FormFieldTitelEnBeschrijving'

/**
 * Displays a title, description and a text area in which a user can add a description.
 */

interface FormFieldTextAreaProps {
    fieldLabel: string
    pValue: string
    disabled?: boolean
    anchorText?: string
    anchorLink?: string
    titleSingular: string
    dataObjectProperty: string
    fieldValue: string
    placeholderTekst?: string
    handleChange?: ChangeEventHandler
}

const FormFieldTextArea = ({
    fieldLabel,
    pValue,
    disabled,
    anchorText,
    anchorLink,
    titleSingular,
    dataObjectProperty,
    fieldValue,
    placeholderTekst,
    handleChange,
}: FormFieldTextAreaProps) => {
    const textArea = useRef<HTMLTextAreaElement>(null)

    /**
     * Function to call the function updateElHeight when the content of the textArea components exceeds the set height.
     */
    useEffect(() => {
        // Set height van de textArea componenten op basis van de inhoud
        updateElHeight()
    }, [])

    /**
     * Function to set the height of the textArea and to add the scrollbar based on the content within it.
     */
    const updateElHeight = () => {
        const textAreaNode = textArea.current
        if (!textAreaNode) return

        textAreaNode.style.height = '1px'
        textAreaNode.style.height = textAreaNode.scrollHeight + 10 + 'px'
    }

    return (
        <div className="flex flex-wrap mb-6 -mx-3">
            <div className="w-full px-3">
                <FormFieldTitelEnBeschrijving
                    fieldLabel={fieldLabel}
                    pValue={pValue}
                    disabled={disabled}
                    anchorText={anchorText}
                    anchorLink={anchorLink}
                />
                <textarea
                    disabled={disabled}
                    ref={textArea}
                    id={`form-field-${titleSingular.toLowerCase()}-${dataObjectProperty.toLowerCase()}`}
                    value={fieldValue || ''}
                    // required
                    onChange={e => {
                        updateElHeight()
                        handleChange?.(e)
                    }}
                    name={dataObjectProperty}
                    className="block w-full h-24 px-4 py-3 leading-tight text-gray-700 border border-gray-400 rounded appearance-none resize-none focus:outline-none focus:bg-white hover:border-gray-500 focus:border-gray-500"
                    placeholder={
                        placeholderTekst ||
                        `Typ hier uw ${fieldLabel.toLowerCase()}`
                    }
                />
            </div>
        </div>
    )
}

export default FormFieldTextArea
