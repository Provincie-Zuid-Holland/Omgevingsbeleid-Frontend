import { Button, Heading, Hyperlink, Text } from '@pzh-ui/components'
import { ArrowUpRightFromSquare, TrashCan } from '@pzh-ui/icons'

import { ObjectRelatedFileResponse } from '@/api/fetchers.schemas'
import useDownloadStorageFile from '@/hooks/useDownloadStorageFile'

import { StepProps } from './types'

export const StepOne = ({
    model,
    objectData,
    userCanEdit,
    setStep,
    setSelectedFile,
}: StepProps) => {
    const files = [...(objectData?.related_files ?? [])].sort(
        (a, b) =>
            new Date(b.created_date).getTime() -
            new Date(a.created_date).getTime()
    )

    return (
        <>
            <Heading level="2" size="xl" className="mb-2">
                Gerelateerde bestanden
            </Heading>

            <Text className="mb-4">
                Bestanden koppelen aan {model.defaults.singularReadable}:{' '}
                <b>{objectData?.title}</b>
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
                            key={file.id}
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
    const download = useDownloadStorageFile(file.file_id)

    return (
        <div className="flex items-center justify-between gap-4 rounded border border-pzh-gray-300 bg-pzh-gray-100 p-4">
            <Hyperlink
                asChild
                icon={ArrowUpRightFromSquare}
                className="inline-flex items-center text-pzh-blue-500 underline hover:text-pzh-green-500">
                <button
                    type="button"
                    onClick={() => download.refetch()}
                    className="text-left">
                    <span className="font-bold">{file.title}</span>
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
