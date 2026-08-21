import { getStorageFileGetFilesDownloadQueryKey } from '@/api/fetchers'
import { ObjectRelatedFileResponse } from '@/api/fetchers.schemas'
import { downloadFile } from '@/utils/file'
import { Button, Heading, Hyperlink, Text } from '@pzh-ui/components'
import { ArrowUpRightFromSquare, TrashCan } from '@pzh-ui/icons'
import { useQuery } from '@tanstack/react-query'

import { StepProps } from './types'

export const StepOne = ({
    model,
    objectData,
    userCanEdit,
    setStep,
    setSelectedFile,
}: StepProps) => {
    const files = [...(objectData?.Related_Files ?? [])].sort(
        (a, b) =>
            new Date(b.Created_Date).getTime() -
            new Date(a.Created_Date).getTime()
    )

    return (
        <>
            <Heading level="2" size="xl" className="mb-2">
                Gerelateerde bestanden
            </Heading>

            <Text className="mb-4">
                Bestanden koppelen aan {model.defaults.singularReadable}:{' '}
                <b>{objectData?.Title}</b>
            </Text>

            <div className="flex items-center justify-between">
                <span className="font-bold">
                    {files.length} gekoppelde{' '}
                    {files.length === 1 ? 'bestand' : 'bestanden'}
                </span>
                {userCanEdit && (
                    <Button
                        variant="cta"
                        type="button"
                        data-testid="object-related-file-add-new"
                        onPress={() => setStep(2)}>
                        Nieuwe koppeling maken
                    </Button>
                )}
            </div>

            {files.length > 0 && (
                <div className="mt-4 flex flex-col gap-2">
                    {files.map(file => (
                        <RelatedFileRow
                            key={file.UUID}
                            file={file}
                            userCanEdit={userCanEdit}
                            onDelete={() => {
                                setSelectedFile(file)
                                setStep(3)
                            }}
                        />
                    ))}
                </div>
            )}
        </>
    )
}

interface RelatedFileRowProps {
    file: ObjectRelatedFileResponse
    userCanEdit: boolean
    onDelete: () => void
}

const RelatedFileRow = ({
    file,
    userCanEdit,
    onDelete,
}: RelatedFileRowProps) => {
    const download = useQuery({
        queryKey: ['downloadStorageFile', file.File_UUID],
        queryFn: () =>
            downloadFile(
                getStorageFileGetFilesDownloadQueryKey(file.File_UUID)[0],
                undefined,
                true
            ),
        enabled: false,
    })

    return (
        <div className="border-pzh-gray-300 bg-pzh-gray-100 flex items-center justify-between gap-4 rounded border p-4">
            <Hyperlink
                asChild
                icon={ArrowUpRightFromSquare}
                className="text-pzh-blue-500 hover:text-pzh-green-500 inline-flex items-center underline">
                <button
                    type="button"
                    onClick={() => download.refetch()}
                    className="text-left">
                    <span className="font-bold">{file.Title}</span>
                </button>
            </Hyperlink>

            {userCanEdit && (
                <button type="button" onClick={onDelete} className="shrink-0">
                    <span className="sr-only">
                        Gerelateerd bestand ontkoppelen
                    </span>
                    <TrashCan className="text-pzh-red-500" size={16} />
                </button>
            )}
        </div>
    )
}
