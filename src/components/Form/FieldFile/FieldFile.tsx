import {
    Button,
    FieldCheckbox,
    FieldInput,
    FieldLabel,
    Hyperlink,
} from '@pzh-ui/components'
import { useFormikContext } from 'formik'
import { useEffect, useState } from 'react'

import { useStorageFileGetFilesDetail } from '@/api/fetchers'
import { DynamicField } from '@/config/types'
import useDownloadStorageFile from '@/hooks/useDownloadStorageFile'
import { ArrowUpRightFromSquareLight } from '@pzh-ui/icons'

interface FieldFileProps extends Omit<DynamicField, 'type'> {
    /** Formik field that holds the selected File and receives upload errors. Defaults to 'File'. */
    fileFieldName?: string
    /** Formik field for the "ignore warning" checkbox. Defaults to 'File_Ignore'. */
    ignoreFieldName?: string
    /** Formik field holding the UUID of an already-uploaded file to preview/download. Defaults to 'File_UUID'. */
    existingFileUuidField?: string
    /**
     * Controls whether the ignore-warning checkbox is shown. When omitted it
     * falls back to whether `fileFieldName` currently has a (touched) error.
     * Pass this explicitly when the warning must survive Formik revalidating
     * other fields.
     */
    showIgnoreCheckbox?: boolean
    onFileSelect?: (file: File) => void
}

const FieldFile = ({
    name,
    label,
    required,
    description,
    placeholder,
    fileFieldName = 'File',
    ignoreFieldName = 'File_Ignore',
    existingFileUuidField = 'File_UUID',
    showIgnoreCheckbox,
    onFileSelect,
}: FieldFileProps) => {
    const { values, setFieldValue, setFieldTouched, errors, touched } =
        useFormikContext<Record<string, unknown>>()
    const [fileName, setFileName] = useState<string | undefined>()

    const existingFileUuid = values[existingFileUuidField] as string | undefined

    const { data } = useStorageFileGetFilesDetail(String(existingFileUuid), {
        query: { enabled: !!existingFileUuid },
    })

    const download = useDownloadStorageFile(data?.UUID)

    useEffect(() => {
        if (data?.Filename) {
            setFileName(data.Filename)
        }
    }, [data])

    const hasError = !!errors[fileFieldName] && !!touched[fileFieldName]
    const errorMessage = hasError ? String(errors[fileFieldName]) : undefined

    const [persistedErrorMessage, setPersistedErrorMessage] = useState<
        string | undefined
    >()

    useEffect(() => {
        if (errorMessage) setPersistedErrorMessage(errorMessage)
    }, [errorMessage])

    /**
     * Checking the ignore-checkbox revalidates the form to clear the
     * server-set error (see below), which would otherwise also hide this
     * message. Keep showing the last message for as long as the warning
     * is still relevant, so the user isn't left wondering what they
     * acknowledged.
     */
    const displayedErrorMessage =
        errorMessage ?? (showIgnoreCheckbox ? persistedErrorMessage : undefined)

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
                        key={fileName}
                        name={name}
                        defaultValue={fileName}
                        placeholder={placeholder}
                        hasError={hasError}
                    />
                </div>
                <Button>Selecteer bestand</Button>
                <div className="absolute top-0 left-0 h-full w-full opacity-0">
                    <input
                        name={name}
                        className="h-full w-full cursor-pointer"
                        type="file"
                        accept="application/pdf"
                        onClick={e => {
                            e.currentTarget.value = ''
                        }}
                        onChange={e => {
                            const file = e.currentTarget.files?.[0]
                            if (!file) return

                            setFileName(file.name)
                            setPersistedErrorMessage(undefined)
                            onFileSelect?.(file)

                            setFieldValue(fileFieldName, file).then(() =>
                                setFieldTouched(fileFieldName, true)
                            )
                        }}
                    />
                </div>
            </div>

            {displayedErrorMessage && (
                <div className="mt-1 flex flex-col gap-1">
                    {displayedErrorMessage.split('\n').map((line, index) => (
                        <span
                            key={index}
                            className="text-pzh-red-500 text-s block">
                            {line}
                        </span>
                    ))}
                </div>
            )}

            {data?.UUID && data.UUID === existingFileUuid && (
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

            {(showIgnoreCheckbox ?? hasError) && (
                <div className="mt-2">
                    <FieldCheckbox
                        name={ignoreFieldName}
                        onChange={e => {
                            const shouldValidate =
                                showIgnoreCheckbox !== undefined

                            setFieldValue(
                                ignoreFieldName,
                                e.target.checked,
                                shouldValidate
                            )
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
