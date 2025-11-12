import {
    Button,
    FieldCheckbox,
    FieldInput,
    FieldLabel,
    FormikError,
    FormikInput,
    Hyperlink,
} from '@pzh-ui/components'
import { useFormikContext } from 'formik'
import { useEffect, useMemo, useState } from 'react'

import {
    getStorageFileGetFilesDownloadQueryKey,
    useStorageFileGetFilesDetail,
} from '@/api/fetchers'
import { ModelReturnType } from '@/config/objects/types'
import { DynamicField } from '@/config/types'
import { downloadFile } from '@/utils/file'
import { ArrowUpRightFromSquareLight } from '@pzh-ui/icons'
import { useQuery } from '@tanstack/react-query'

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

    const download = useQuery({
        queryKey: ['downloadStorageFile', data?.UUID],
        queryFn: () =>
            downloadFile(
                getStorageFileGetFilesDownloadQueryKey(String(data?.UUID))[0],
                undefined,
                true
            ),
        enabled: false,
    })

    useEffect(() => {
        if (data?.Filename) {
            setFileName(data.Filename)
        }
    }, [data])

    const hasError = useMemo(() => !!errors['File'], [errors])

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

            {data?.UUID && data.UUID === values.File_UUID && (
                <Hyperlink asChild>
                    <button
                        type="button"
                        className="mt-4 flex items-center"
                        onClick={() => download.refetch()}>
                        Bekijk document{' '}
                        <ArrowUpRightFromSquareLight className="ml-1" />
                    </button>
                </Hyperlink>
            )}

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
