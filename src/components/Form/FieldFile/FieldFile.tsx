import {
    Button,
    FieldInput,
    FieldLabel,
    FormikError,
    FormikInput,
} from '@pzh-ui/components'
import { useFormikContext } from 'formik'
import { useEffect, useState } from 'react'

import { useStorageFilesFileUuidGet } from '@/api/fetchers'
import { ModelReturnType } from '@/config/objects/types'
import { DynamicField } from '@/config/types'

const FieldFile = ({
    name,
    label,
    required,
    description,
}: Omit<DynamicField, 'type'>) => {
    const { values, setFieldValue } = useFormikContext<ModelReturnType>()
    const [fileName, setFileName] = useState<string | undefined>()

    const { data } = useStorageFilesFileUuidGet(String(values.File_UUID), {
        query: { enabled: !!values.File_UUID },
    })

    useEffect(() => {
        if (data?.Filename) {
            setFileName(data.Filename)
        }
    }, [data])

    return (
        <>
            {label && (
                <FieldLabel
                    name={name}
                    label={label}
                    description={description}
                    required={required}
                />
            )}

            <div className="relative flex gap-2">
                <div className="flex-1">
                    <FieldInput name={name} defaultValue={fileName} />
                </div>
                <Button>Bestand kiezen</Button>
                <div className="absolute top-0 left-0 h-full w-full opacity-0">
                    <FormikInput name="File" type="hidden" />
                    <input
                        name={name}
                        className="h-full w-full cursor-pointer"
                        type="file"
                        accept="application/pdf"
                        onChange={e => {
                            if (e.currentTarget.files) {
                                setFieldValue('File', e.currentTarget.files[0])
                                setFileName(e.currentTarget.files[0].name)
                            }
                        }}
                    />
                </div>
            </div>

            <FormikError name={name} />
        </>
    )
}

export default FieldFile
