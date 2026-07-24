import { getStorageFileGetFilesDownloadQueryKey } from '@/api/fetchers'
import { ObjectRelatedFileResponse } from '@/api/fetchers.schemas'
import ObjectRelatedFileAddModal from '@/components/Modals/ObjectModals/ObjectRelatedFileAddModal'
import ObjectRelatedFileDeleteModal from '@/components/Modals/ObjectModals/ObjectRelatedFileDeleteModal'
import useObject from '@/hooks/useObject'
import usePermissions from '@/hooks/usePermissions'
import useModalStore from '@/store/modalStore'
import { downloadFile } from '@/utils/file'
import { parseUtc } from '@/utils/parseUtc'
import { formatDate, Heading, Text } from '@pzh-ui/components'
import { Plus, TrashCan } from '@pzh-ui/icons'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

const ObjectRelatedFiles = () => {
    const { canCreateModule, canPatchObjectInModule } = usePermissions()
    const { isOwner, data: objectData } = useObject()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const userCanEdit = useMemo(
        () => (canPatchObjectInModule && isOwner) || canCreateModule,
        [canPatchObjectInModule, isOwner, canCreateModule]
    )

    const files = useMemo(
        () =>
            [...(objectData?.Related_Files ?? [])].sort(
                (a, b) =>
                    new Date(b.Created_Date).getTime() -
                    new Date(a.Created_Date).getTime()
            ),
        [objectData?.Related_Files]
    )

    return (
        <>
            <div className="mt-8 mb-5 flex items-center justify-between">
                <Heading level="3" size="m">
                    Gerelateerde bestanden
                </Heading>
                {userCanEdit && (
                    <button
                        data-testid="object-related-file-add"
                        onClick={() => setActiveModal('objectRelatedFileAdd')}
                        className="bg-pzh-green-500 flex h-[18px] w-[18px] items-center justify-center rounded-full">
                        <span className="sr-only">
                            Gerelateerd bestand koppelen
                        </span>
                        <Plus size={14} className="text-pzh-white" />
                    </button>
                )}
            </div>

            {!files.length ? (
                <Text className="text-pzh-gray-600 italic">
                    Er zijn nog geen bestanden gekoppeld
                </Text>
            ) : (
                <div className="flex flex-col gap-3">
                    {files.map(file => (
                        <RelatedFile
                            key={file.UUID}
                            file={file}
                            userCanEdit={userCanEdit}
                            onDelete={() =>
                                setActiveModal('objectRelatedFileDelete', {
                                    file,
                                })
                            }
                        />
                    ))}
                </div>
            )}

            <ObjectRelatedFileAddModal />
            <ObjectRelatedFileDeleteModal />
        </>
    )
}

interface RelatedFileProps {
    file: ObjectRelatedFileResponse
    userCanEdit: boolean
    onDelete: () => void
}

const RelatedFile = ({ file, userCanEdit, onDelete }: RelatedFileProps) => {
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
        <div className="border-pzh-gray-200 flex items-center justify-between gap-4 border-b pb-2">
            <button
                type="button"
                onClick={() => download.refetch()}
                className="text-left">
                <Text as="span" bold className="hover:underline">
                    {file.Title}
                </Text>
                <Text size="s" color="text-pzh-gray-500">
                    Geüpload op{' '}
                    {formatDate(parseUtc(file.Created_Date), 'dd-MM-yyyy')}
                </Text>
            </button>

            {userCanEdit && (
                <button
                    type="button"
                    onClick={onDelete}
                    className="shrink-0">
                    <span className="sr-only">
                        Gerelateerd bestand ontkoppelen
                    </span>
                    <TrashCan className="text-pzh-red-500" size={16} />
                </button>
            )}
        </div>
    )
}

export default ObjectRelatedFiles
