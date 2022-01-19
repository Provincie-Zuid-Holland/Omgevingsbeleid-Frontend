/**
 * @returns A label and description of a FormField component
 */

interface FormFieldTitelEnBeschrijvingProps {
    pValue?: string
    disabled?: boolean
    fieldLabel: string
    anchorText?: string
    anchorLink?: string
}

function FormFieldTitelEnBeschrijving({
    pValue,
    disabled,
    fieldLabel,
    anchorText,
    anchorLink,
}: FormFieldTitelEnBeschrijvingProps) {
    if (disabled) {
        pValue = pValue + ' (Kan niet zonder besluitvorming worden gewijzigd)'
    }
    return (
        <>
            <h3 className="block mb-2 font-bold tracking-wide text-gray-700">
                {fieldLabel}
            </h3>
            <p className="mb-4 text-sm text-gray-700">
                {pValue ? `${pValue} ` : ''}
                {anchorText ? (
                    <a
                        href={anchorLink}
                        className="underline"
                        target="_blank"
                        rel="noopener noreferrer">
                        {anchorText}
                    </a>
                ) : null}
            </p>
        </>
    )
}

export default FormFieldTitelEnBeschrijving
