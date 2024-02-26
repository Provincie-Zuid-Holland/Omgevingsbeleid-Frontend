import { Button, FileTrigger, Tag, Text, formatDate } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import {
    getPublicationBillsBillUuidPackagesGetQueryKey,
    getPublicationsPublicationUuidBillsGetQueryKey,
    usePublicationBillsBillUuidPackagesPost,
    usePublicationPackagesPackageUuidReportPost,
} from '@/api/fetchers'
import {
    PublicationBillShort,
    PublicationPackage,
} from '@/api/fetchers.schemas'
import downloadFile from '@/utils/downloadFile'

import { PublicationPackageProps } from '../PublicationPackages'

interface PackageStepActionsProps extends PublicationPackageProps {
    bill: PublicationBillShort
    publicationPackage?: PublicationPackage
    isActive?: boolean
    isSucceeded?: boolean
    isLoading?: boolean
}

const PackageStepActions = ({ type, ...props }: PackageStepActionsProps) => {
    switch (type) {
        case 'create':
            return <CreateAction type={type} {...props} />
        case 'download':
            return <DownloadAction type={type} {...props} />
        case 'upload':
            return <UploadAction type={type} {...props} />
    }
}

const CreateAction = ({
    bill,
    publicationPackage,
    eventType,
    isActive,
    isSucceeded,
}: PackageStepActionsProps) => {
    const queryClient = useQueryClient()

    const { mutate: create, isPending } =
        usePublicationBillsBillUuidPackagesPost({
            mutation: {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey:
                            getPublicationBillsBillUuidPackagesGetQueryKey(
                                bill.UUID
                            ),
                    })
                    queryClient.invalidateQueries({
                        queryKey:
                            getPublicationsPublicationUuidBillsGetQueryKey(
                                bill.Publication_UUID
                            ),
                    })
                },
            },
        })

    const handleAction = () =>
        create({
            billUuid: bill.UUID,
            data: { Package_Event_Type: eventType },
        })

    const date = useMemo(() => {
        if (!!publicationPackage && isSucceeded) {
            return formatDate(
                new Date(publicationPackage.Created_Date),
                'dd-MM-yyyy'
            )
        }
    }, [isSucceeded, publicationPackage])

    /**
     * Only show text if step isSucceeded
     */
    if (!!publicationPackage && isSucceeded) {
        return <Text color="text-pzh-gray-600">Levering gemaakt op {date}</Text>
    }

    return (
        <div className="flex items-center gap-2 whitespace-nowrap">
            {isPending && (
                <Text size="s" className="text-pzh-gray-600">
                    Levering wordt gemaakt, dit kan even duren..
                </Text>
            )}
            <Button
                variant="cta"
                isDisabled={!isActive || isPending}
                onPress={handleAction}
                isLoading={isPending}>
                Maak levering
            </Button>
        </div>
    )
}

const DownloadAction = ({
    bill,
    publicationPackage,
    eventType,
    isActive,
}: PackageStepActionsProps) => {
    const queryClient = useQueryClient()

    const { isFetching, refetch: download } = useQuery({
        queryKey: [
            'downloadPackage',
            publicationPackage?.UUID,
            bill.UUID,
            eventType,
        ],
        queryFn: async () =>
            downloadFile(
                `publication-packages/${publicationPackage?.UUID}/download`
            ),
        enabled: false,
    })

    const handleAction = () =>
        download().finally(() =>
            queryClient.invalidateQueries({
                queryKey: getPublicationBillsBillUuidPackagesGetQueryKey(
                    bill.UUID
                ),
            })
        )

    const date = useMemo(() => {
        if (!!publicationPackage?.Latest_Download_Date) {
            return formatDate(
                new Date(publicationPackage.Latest_Download_Date),
                'dd-MM-yyyy'
            )
        }
    }, [publicationPackage])

    return (
        <div className="flex items-center gap-2 whitespace-nowrap">
            {!!publicationPackage?.Latest_Download_Date && (
                <Text color="text-pzh-gray-600">
                    Laatst gedownload op {date}
                </Text>
            )}
            <Button
                variant={
                    !!publicationPackage?.Latest_Download_Date
                        ? 'secondary'
                        : 'cta'
                }
                isDisabled={!isActive || isFetching}
                onPress={handleAction}
                isLoading={isFetching}>
                Download levering
            </Button>
        </div>
    )
}

const UploadAction = ({
    bill,
    publicationPackage,
    isActive,
    isLoading,
}: PackageStepActionsProps) => {
    const queryClient = useQueryClient()

    const [files, setFiles] = useState<File[] | null>(null)

    const { mutate, isPending } = usePublicationPackagesPackageUuidReportPost()

    const handleAction = () => {
        if (!publicationPackage?.UUID || !!!files?.length) return

        Promise.all(
            files.map(file =>
                mutate({
                    packageUuid: publicationPackage.UUID,
                    data: { xml_file: file },
                })
            )
        ).finally(() => {
            queryClient.invalidateQueries({
                queryKey: getPublicationBillsBillUuidPackagesGetQueryKey(
                    bill.UUID
                ),
            })
        })
    }

    const date = useMemo(() => {
        if (!!publicationPackage?.Reports?.[0]) {
            return formatDate(
                new Date(publicationPackage.Reports[0].Created_Date),
                'dd-MM-yyyy'
            )
        }
    }, [publicationPackage])

    return (
        <div className="flex items-center gap-2 whitespace-nowrap">
            {publicationPackage?.Validation_Status !== 'Valid' ? (
                <>
                    {!!files?.length && (
                        <div className="flex flex-wrap justify-end gap-2">
                            {files.map(file => (
                                <Tag
                                    text={file.name}
                                    onClick={() =>
                                        setFiles(
                                            files.filter(
                                                e => e.name !== file.name
                                            )
                                        )
                                    }
                                />
                            ))}
                        </div>
                    )}
                    <FileTrigger
                        allowsMultiple
                        onSelect={e => {
                            if (!e) return

                            const newFiles = Array.from(e)

                            setFiles(
                                !!files?.length
                                    ? [...files, ...newFiles]
                                    : newFiles
                            )
                        }}>
                        <Button
                            variant={!!files?.length ? 'primary' : 'cta'}
                            icon={!!files?.length && Plus}
                            isDisabled={!isActive || isPending || isLoading}>
                            {!!!files?.length && 'Selecteer bestand(en)'}
                        </Button>
                    </FileTrigger>
                    {!!files?.length && (
                        <Button
                            variant="cta"
                            onPress={handleAction}
                            isLoading={isPending || isLoading}
                            isDisabled={!isActive || isPending || isLoading}>
                            Uploaden
                        </Button>
                    )}
                </>
            ) : (
                <Text color="text-pzh-gray-600">Geupload op {date}</Text>
            )}
        </div>
    )
}

export default PackageStepActions
