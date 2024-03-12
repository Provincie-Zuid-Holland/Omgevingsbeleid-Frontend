import { Button, FileTrigger, Tag, Text, formatDate } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import {
    getPublicationPackagesGetQueryKey,
    getPublicationsPublicationUuidVersionsGetQueryKey,
    usePublicationVersionsVersionUuidPackagesPost,
} from '@/api/fetchers'
import {
    PublicationPackage,
    PublicationVersionShort,
} from '@/api/fetchers.schemas'
import { downloadFile } from '@/utils/file'

import { PublicationPackageProps } from '../PublicationPackages'

interface PackageStepActionsProps extends PublicationPackageProps {
    version: PublicationVersionShort
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
    version,
    publicationPackage,
    eventType,
    isActive,
    isSucceeded,
}: PackageStepActionsProps) => {
    const queryClient = useQueryClient()

    const { mutate: create, isPending } =
        usePublicationVersionsVersionUuidPackagesPost({
            mutation: {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: getPublicationPackagesGetQueryKey({
                            version_uuid: version.UUID,
                        }),
                    })
                    queryClient.invalidateQueries({
                        queryKey:
                            getPublicationsPublicationUuidVersionsGetQueryKey(
                                version.Publication_UUID
                            ),
                    })
                },
            },
        })

    const handleAction = () =>
        create({
            versionUuid: version.UUID,
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
    version,
    publicationPackage,
    eventType,
    isActive,
}: PackageStepActionsProps) => {
    const queryClient = useQueryClient()

    const { isFetching, refetch: download } = useQuery({
        queryKey: [
            'downloadPackage',
            publicationPackage?.UUID,
            version.UUID,
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
                queryKey: getPublicationPackagesGetQueryKey({
                    version_uuid: version.UUID,
                }),
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
    version,
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
                queryKey: getPublicationPackagesGetQueryKey({
                    version_uuid: version.UUID,
                }),
            })
        })
    }

    const date = useMemo(() => {
        if (!!publicationPackage?.Reports?.length) {
            return formatDate(
                new Date(publicationPackage.Reports?.slice(-1)[0].Created_Date),
                'dd-MM-yyyy'
            )
        }
    }, [publicationPackage])

    const allFiles = useMemo(
        () =>
            ((!!files?.length || !!publicationPackage?.Reports?.length) && [
                ...(publicationPackage?.Reports || []),
                ...(files || []),
            ]) ||
            undefined,
        [files, publicationPackage?.Reports]
    )

    return (
        <div>
            <div className="flex items-center gap-4 whitespace-nowrap">
                {!!allFiles?.length && (
                    <div className="flex flex-wrap justify-end gap-2">
                        {allFiles.map(file => (
                            <Tag
                                text={
                                    'name' in file
                                        ? file.name
                                        : file.Report_Type || ''
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
                            !!files?.length ||
                            !!publicationPackage?.Reports?.length
                                ? 'primary'
                                : 'cta'
                        }
                        icon={
                            (!!files?.length ||
                                !!publicationPackage?.Reports?.length) &&
                            Plus
                        }
                        isDisabled={!isActive || isPending || isLoading}>
                        {!!!files?.length &&
                            !!!publicationPackage?.Reports?.length &&
                            'Selecteer bestand(en)'}
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
            </div>
            {date && (
                <Text color="text-pzh-gray-600" className="mt-2 text-right">
                    Geupload op {date}
                </Text>
            )}
        </div>
    )
}

export default PackageStepActions
