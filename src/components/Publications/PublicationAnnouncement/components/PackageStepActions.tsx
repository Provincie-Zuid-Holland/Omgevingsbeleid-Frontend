import { Button, FileTrigger, Tag, Text, formatDate } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { useMemo, useState } from 'react'

import {
    getPublicationAnnouncementPackagesAnnouncementPackageUuidDownloadGetQueryKey,
    getPublicationAnnouncementPackagesGetQueryKey,
    usePublicationAnnouncementPackagesAnnouncementPackageUuidReportPost,
    usePublicationAnnouncementReportsGet,
    usePublicationAnnouncementsAnnouncementUuidPackagesPost,
} from '@/api/fetchers'
import {
    PublicationAnnouncementShort,
    PublicationPackage,
} from '@/api/fetchers.schemas'
import { downloadFile } from '@/utils/file'

import { PublicationAnnouncementPackageProps } from '../PublicationAnnouncement'

interface PackageStepActionsProps extends PublicationAnnouncementPackageProps {
    handleAction?: () => void
    announcement: PublicationAnnouncementShort
    publicationPackage?: PublicationPackage
    isActive?: boolean
    isSucceeded?: boolean
    isLoading?: boolean
    buttonLabel?: string
    hideDescription?: boolean
}

const PackageStepActions = ({ type, ...props }: PackageStepActionsProps) => {
    switch (type) {
        case 'create':
            return <CreateAction type={type} {...props} />
        case 'download':
            return <DownloadAction type={type} {...props} />
        case 'upload':
            return <UploadAction type={type} {...props} />
        case 'update':
            return <UpdateAction type={type} {...props} />
    }
}

const CreateAction = ({
    announcement,
    publicationPackage,
    eventType,
    isActive,
    isSucceeded,
    buttonLabel = 'Maak levering',
    hideDescription = false,
}: PackageStepActionsProps) => {
    const queryClient = useQueryClient()

    const { mutate: create, isPending } =
        usePublicationAnnouncementsAnnouncementUuidPackagesPost({
            mutation: {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: getPublicationAnnouncementPackagesGetQueryKey(
                            {
                                announcement_uuid: announcement.UUID,
                            }
                        ),
                    })
                },
            },
        })

    const handleAction = () =>
        create({
            announcementUuid: announcement.UUID,
            data: { Package_Type: eventType },
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
            {isPending && !hideDescription && (
                <Text size="s" className="text-pzh-gray-600">
                    Levering wordt gemaakt, dit kan even duren..
                </Text>
            )}
            <Button
                variant="cta"
                isDisabled={!isActive || isPending}
                onPress={handleAction}
                isLoading={isPending}>
                {buttonLabel}
            </Button>
        </div>
    )
}

const DownloadAction = ({
    announcement,
    publicationPackage,
    eventType,
    isActive,
}: PackageStepActionsProps) => {
    const queryClient = useQueryClient()

    const { isFetching, refetch: download } = useQuery({
        queryKey: [
            'downloadPackage',
            publicationPackage?.UUID,
            announcement.UUID,
            eventType,
        ],
        queryFn: async () =>
            downloadFile(
                getPublicationAnnouncementPackagesAnnouncementPackageUuidDownloadGetQueryKey(
                    publicationPackage?.UUID || ''
                )[0]
            ),
        enabled: false,
    })

    const handleAction = () =>
        download().finally(() =>
            queryClient.invalidateQueries({
                queryKey: getPublicationAnnouncementPackagesGetQueryKey({
                    announcement_uuid: announcement.UUID,
                }),
            })
        )

    const date = useMemo(() => {
        if (!!publicationPackage?.Zip.Latest_Download_Date) {
            return formatDate(
                new Date(publicationPackage.Zip.Latest_Download_Date),
                'dd-MM-yyyy'
            )
        }
    }, [publicationPackage])

    return (
        <div className="flex items-center gap-2 whitespace-nowrap">
            {!!publicationPackage?.Zip.Latest_Download_Date && (
                <Text color="text-pzh-gray-600">
                    Laatst gedownload op {date}
                </Text>
            )}
            <Button
                variant={
                    !!publicationPackage?.Zip.Latest_Download_Date
                        ? 'secondary'
                        : 'cta'
                }
                isDisabled={!isActive || isFetching}
                onPress={handleAction}
                isLoading={isFetching}>
                Download kennisgeving
            </Button>
        </div>
    )
}

const UploadAction = ({
    announcement,
    publicationPackage,
    isActive,
    isLoading,
}: PackageStepActionsProps) => {
    const queryClient = useQueryClient()

    const [files, setFiles] = useState<File[] | null>(null)

    const { data: reports, queryKey } = usePublicationAnnouncementReportsGet(
        {
            announcement_package_uuid: publicationPackage?.UUID,
            limit: 100,
        },
        {
            query: {
                enabled: !!publicationPackage?.UUID,
            },
        }
    )

    const { mutate, isPending } =
        usePublicationAnnouncementPackagesAnnouncementPackageUuidReportPost({
            mutation: {
                onSuccess: () => {
                    setFiles(null)

                    queryClient.invalidateQueries({
                        queryKey: getPublicationAnnouncementPackagesGetQueryKey(
                            {
                                announcement_uuid: announcement.UUID,
                            }
                        ),
                    })
                    queryClient.invalidateQueries({
                        queryKey,
                    })
                },
            },
        })

    const handleAction = () => {
        if (!publicationPackage?.UUID || !!!files?.length) return

        mutate({
            announcementPackageUuid: publicationPackage.UUID,
            data: { uploaded_files: files },
        })
    }

    const date = useMemo(() => {
        if (
            publicationPackage?.Modified_Date &&
            !!publicationPackage.Report_Status &&
            publicationPackage.Report_Status !== 'pending'
        ) {
            return formatDate(
                new Date(publicationPackage.Modified_Date),
                'dd-MM-yyyy'
            )
        }
    }, [publicationPackage])

    const allFiles = useMemo(
        () =>
            ((!!files?.length || !!reports?.results.length) && [
                ...(reports?.results || []),
                ...(files || []),
            ]) ||
            undefined,
        [files, reports?.results]
    )

    return (
        <div>
            <div className="flex items-center gap-4 whitespace-nowrap">
                {!!allFiles?.length && (
                    <div className="flex flex-wrap justify-end gap-2">
                        {allFiles.map(file => (
                            <Tag
                                key={'name' in file ? file.name : file.UUID}
                                text={
                                    'name' in file
                                        ? file.name
                                        : file.Filename || ''
                                }
                                onClick={
                                    'name' in file && !!files?.length
                                        ? () =>
                                              setFiles(
                                                  files.filter(
                                                      e => e.name !== file.name
                                                  )
                                              )
                                        : undefined
                                }
                                className={clsx({
                                    'border-pzh-red-900 bg-pzh-red-10 text-pzh-red-900':
                                        'Report_Status' in file &&
                                        file.Report_Status === 'failed',
                                    'border-pzh-gray-200 bg-pzh-gray-200 text-pzh-gray-600':
                                        'Filename' in file && !!files?.length,
                                })}
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
                            !!files?.length ? [...files, ...newFiles] : newFiles
                        )
                    }}>
                    <Button
                        variant={
                            !!files?.length || !!reports?.results.length
                                ? 'primary'
                                : 'cta'
                        }
                        icon={
                            (!!files?.length || !!reports?.results.length) &&
                            Plus
                        }
                        isDisabled={!isActive || isPending || isLoading}
                        aria-label="Bestanden toevoegen">
                        {!!!files?.length &&
                            !!!reports?.results.length &&
                            'Selecteer bestand(en)'}
                    </Button>
                </FileTrigger>
                {!!files?.length && (
                    <Button
                        variant={
                            !!reports?.results.length ? 'secondary' : 'cta'
                        }
                        onPress={handleAction}
                        isLoading={isPending || isLoading}
                        isDisabled={!isActive || isPending || isLoading}>
                        Uploaden
                    </Button>
                )}
            </div>
            {date && (
                <Text color="text-pzh-gray-600" className="mt-2 text-right">
                    Gevalideerd op {date}
                </Text>
            )}
        </div>
    )
}

const UpdateAction = ({
    handleAction,
    isActive,
    isSucceeded,
    buttonLabel = 'Ga naar het formulier',
}: PackageStepActionsProps) => (
    <Button
        variant={isSucceeded ? 'secondary' : 'cta'}
        isDisabled={!isActive}
        onPress={handleAction}>
        {buttonLabel}
    </Button>
)

export default PackageStepActions
