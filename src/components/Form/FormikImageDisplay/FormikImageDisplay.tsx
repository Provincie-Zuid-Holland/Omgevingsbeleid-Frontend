import { FieldLabel } from '@pzh-ui/components'
import { Xmark } from '@pzh-ui/icons'
import { useFormikContext } from 'formik'

export interface FormikImageDisplayProps {
    name: string
    label?: string
    description?: string
    required?: boolean
}

function FormikImageDisplay({
    name,
    label,
    description,
    required,
}: FormikImageDisplayProps) {
    const { values, setFieldValue } = useFormikContext<any>()

    return (
        <div>
            {(label || description) && (
                <FieldLabel
                    name={name}
                    label={label || ''}
                    description={description || ''}
                    required={required}
                />
            )}
            <div className="flex items-center justify-center overflow-hidden rounded-md shadow">
                <div className="relative">
                    <span
                        onClick={() => {
                            setFieldValue(name, null)
                        }}
                        className="absolute top-0 right-0 p-2 mt-4 mr-4 transition-colors duration-150 ease-in bg-black rounded-full cursor-pointer bg-opacity-40 hover:bg-opacity-50">
                        <Xmark className="text-white" size={24} />
                    </span>

                    <img src={`${values[name]}`} alt="Afbeelding" />
                </div>
            </div>
        </div>
    )
}

export default FormikImageDisplay
