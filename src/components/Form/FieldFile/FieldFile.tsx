import {
    Button,
    FieldCheckbox,
    FieldInput,
    FieldLabel,
    FormikError,
    FormikInput,
} from '@pzh-ui/components'
import { useFormikContext } from 'formik'
import { useEffect, useMemo, useState } from 'react'

import { useStorageFileGetFilesDetail } from '@/api/fetchers'
import { ModelReturnType } from '@/config/objects/types'
import { DynamicField } from '@/config/types'

const FieldFile = ({
    name,
    label,
    required,
    description,
}: Omit<DynamicField, 'type'>) => {
    const { values, setFieldValue, errors } =
        useFormikContext<ModelReturnType>()
    const [fileName, setFileName] = useState<string | undefined>()

    const { data } = useStorageFileGetFilesDetail(String(values.File_UUID), {
        query: { enabled: !!values.File_UUID },
    })

    useEffect(() => {
        if (data?.Filename) {
            setFileName(data.Filename)
        }
    }, [data])

    const hasError = useMemo(() => !!errors['File'], [errors])

    console.log(values)

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
                    <FieldInput
                        name={name}
                        defaultValue={fileName}
                        hasError={hasError}
                    />
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

            <FormikError name="File" />

            <FormikInput name="File_Ignore" type="hidden" />

            {hasError && (
                <div className="mt-2">
                    <FieldCheckbox
                        name="File_Ignore"
                        onChange={e => {
                            if (e.target.checked) {
                                setFieldValue('File_Ignore', 'true', false)
                            } else {
                                setFieldValue('File_Ignore', null, false)
                            }
                        }}>
                        Ik ben mij ervan bewust dat het document een auteur
                        heeft, en ik verspreid hiermee geen naam of namen van
                        mij of mijn collega's.
                    </FieldCheckbox>
                </div>
            )}
        </>
    )
}

export default FieldFile
