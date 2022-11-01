import { FormikFileUpload } from '@pzh-ui/components'
import { useFormikContext } from 'formik'

import FormikImageDisplay from '../Form/FormikImageDisplay'

export interface FormikImageProps {
    name: string
    label?: string
    maxSize?: number // Defaults to 4MB
}

interface FormikValues {
    [name: string]: string | null | undefined
}

function FormikImage({ name, label, maxSize = 4194304 }: FormikImageProps) {
    const { values, setFieldValue } = useFormikContext<FormikValues>()

    return (
        <>
            {values[name] ? (
                <FormikImageDisplay label={label} name={name} />
            ) : (
                <FormikFileUpload
                    maxFiles={1}
                    onChange={files => {
                        const file = files[0]
                        const reader = new FileReader()
                        reader.onload = event => {
                            const result = event?.target?.result
                            setFieldValue(name, result)
                        }
                        reader.readAsDataURL(file)
                    }}
                    name={name}
                    label={label}
                    accept={['image/jpeg', 'image/png']}
                    maxSize={maxSize}
                />
            )}
        </>
    )
}

export default FormikImage
