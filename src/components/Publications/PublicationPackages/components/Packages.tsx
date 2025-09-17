import { Button, cn, Notification, Text } from '@pzh-ui/components'
import { keepPreviousData } from '@tanstack/react-query'
import { useCallback, useState } from 'react'

import {
    usePublicationActPackagesGetListActPackages,
    usePublicationAnnouncementPackagesGetListAnnouncementPackages,
    usePublicationAnnouncementsGetListAnnouncements,
} from '@/api/fetchers'
import {
    PackageType,
    PublicationAnnouncementShort,
    PublicationPackage,
    PublicationShort,
    PublicationVersion,
    ReportStatusType,
} from '@/api/fetchers.schemas'
import { LoaderCard } from '@/components/Loader'
import useModalStore from '@/store/modalStore'

import { parseUtc } from '@/utils/parseUtc'
import { PublicationType } from '../../types'
import { useActions } from './actions'
import Package from './Package'
import PackageCreate from './PackageCreate'

const PACKAGE_LIMIT = 3

const config = {
    validation: {
        label: 'Validatie',
    },
    publication: {
        label: 'Publicatie',
    },
}

interface PackagesProps {
    publicationType: PublicationType
    data?: PublicationPackage[]
    total?: number
    isFetching?: boolean
    isLoading?: boolean
    version: PublicationVersion
    announcement?: PublicationAnnouncementShort
    publication?: PublicationShort
    packageType: PackageType
    validPublicationPackage?: PublicationPackage
    customLabel?: string
    isLocked?: boolean
    canPublicate?: boolean
    handleShowAll: () => void
    showAll: boolean
}

const Packages = ({
    publicationType,
    data,
    total,
    isFetching,
    isLoading,
    version,
    announcement,
    publication,
    packageType,
    customLabel,
    isLocked,
    canPublicate,
    handleShowAll,
    showAll,
}: PackagesProps) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { createPackage } = useActions({
        publicationType,
        versionUUID: version.UUID,
        announcementUUID: announcement?.UUID,
        publicationUUID: String(publication?.UUID),
    })

    return (
        <div className="border-pzh-gray-200 grid grid-cols-12 border-b last:border-b-0">
            <div className="col-span-3 p-6 pt-9">
                <Text
                    bold
                    className="heading-s"
                    color={
                        !isLocked ? 'text-pzh-blue-500' : 'text-pzh-gray-300'
                    }>
                    {customLabel || config[packageType].label}
                </Text>
            </div>
            <div className="col-span-9 px-6 py-4">
                <div
                    className={cn(
                        'border-pzh-gray-200 bg-pzh-white rounded-lg border',
                        {
                            'bg-pzh-gray-100': isLocked && !!!data?.length,
                        }
                    )}>
                    {isLoading ? (
                        <LoaderCard mb="0" height="64" />
                    ) : !!!data?.length ? (
                        <PackageCreate
                            createPackage={createPackage}
                            announcementUUID={announcement?.UUID}
                            packageType={packageType}
                            isLocked={isLocked}
                        />
                    ) : (
                        <>
                            {!!total && total > 3 && (
                                <div className="bg-pzh-gray-100 flex px-6 py-4">
                                    <Button
                                        onPress={handleShowAll}
                                        isLoading={isFetching}
                                        isDisabled={isFetching}
                                        variant="default"
                                        iconSize={19}
                                        className="text-pzh-green-500 flex items-center gap-4 font-bold [&>svg]:-mt-1 [&>svg]:mr-0">
                                        {!showAll
                                            ? `Alle ${total} leveringen tonen`
                                            : 'Minder tonen'}
                                    </Button>
                                </div>
                            )}
                            {data.map(item => (
                                <Package
                                    key={item.UUID}
                                    publicationType={publicationType}
                                    isLocked={isLocked}
                                    publicationUUID={String(publication?.UUID)}
                                    versionUUID={version.UUID}
                                    announcementUUID={announcement?.UUID}
                                    canPublicate={canPublicate}
                                    {...item}
                                />
                            ))}
                            {!version.Is_Locked && (
                                <PackageCreate
                                    createPackage={createPackage}
                                    announcementUUID={announcement?.UUID}
                                    inline
                                    packageType={packageType}
                                />
                            )}
                        </>
                    )}
                </div>

                {createPackage.isError && !!createPackage.error && (
                    <Notification
                        variant="negative"
                        title={
                            createPackage.error.response?.status === 409 ? (
                                <>
                                    Er zijn nog onjuiste of ontbrekende gegevens
                                    in deze versie van de publicatie.{' '}
                                    <Button
                                        variant="default"
                                        onPress={() =>
                                            setActiveModal(
                                                'publicationVersionEdit',
                                                {
                                                    publication,
                                                    UUID: version.UUID,
                                                    isRequired: true,
                                                    error: createPackage.error
                                                        .response,
                                                }
                                            )
                                        }
                                        className="text-pzh-blue-500 underline hover:no-underline">
                                        Wijzig / vul de gegevens aan
                                    </Button>{' '}
                                    om de levering te kunnen maken.
                                </>
                            ) : (
                                'Er is iets mis gegaan, bekijk je console voor de technische details.'
                            )
                        }
                        className="mt-6"
                    />
                )}
            </div>
        </div>
    )
}

export const ActPackages = ({
    version,
    packageType,
    ...rest
}: Omit<PackagesProps, 'handleShowAll' | 'showAll'>) => {
    const [limit, setLimit] = useState({
        amount: PACKAGE_LIMIT,
        showAll: false,
    })

    const { data, isLoading, isFetching } =
        usePublicationActPackagesGetListActPackages(
            {
                limit: limit.amount,
                version_uuid: version.UUID,
                package_type: packageType,
                sort_column: 'Created_Date',
                sort_order: 'DESC',
            },
            {
                query: {
                    enabled: !!version.UUID,
                    placeholderData: keepPreviousData,
                    select: data => ({
                        ...data,
                        results: data.results.sort(
                            (a, b) =>
                                parseUtc(a.Created_Date).getTime() -
                                parseUtc(b.Created_Date).getTime()
                        ),
                    }),
                },
            }
        )

    const handleShowAll = useCallback(() => {
        if (!limit.showAll) {
            setLimit({ amount: data?.total || PACKAGE_LIMIT, showAll: true })
        } else {
            setLimit({ amount: PACKAGE_LIMIT, showAll: false })
        }
    }, [data?.total, limit])

    return (
        <Packages
            data={data?.results}
            total={data?.total}
            showAll={limit.showAll}
            isFetching={isFetching}
            isLoading={isLoading}
            version={version}
            packageType={packageType}
            handleShowAll={handleShowAll}
            {...rest}
        />
    )
}

export const AnnouncementPackages = ({
    version,
    packageType,
    validPublicationPackage,
    ...rest
}: Omit<PackagesProps, 'handleShowAll' | 'showAll'>) => {
    const [limit, setLimit] = useState({
        amount: PACKAGE_LIMIT,
        showAll: false,
    })

    const { data: announcement } =
        usePublicationAnnouncementsGetListAnnouncements(
            {
                limit: 100,
                act_package_uuid: validPublicationPackage?.UUID,
            },
            {
                query: {
                    enabled: !!validPublicationPackage?.UUID,
                    select: data => data.results[0],
                },
            }
        )

    const { data, isLoading, isFetching } =
        usePublicationAnnouncementPackagesGetListAnnouncementPackages(
            {
                limit: limit.amount,
                announcement_uuid: announcement?.UUID,
                package_type: packageType,
                sort_column: 'Created_Date',
                sort_order: 'DESC',
            },
            {
                query: {
                    enabled: !!announcement?.UUID,
                    placeholderData: keepPreviousData,
                    select: data => ({
                        ...data,
                        results: data.results.sort(
                            (a, b) =>
                                parseUtc(a.Created_Date).getTime() -
                                parseUtc(b.Created_Date).getTime()
                        ),
                    }),
                },
            }
        )

    const { data: validAnnouncementPackage } =
        usePublicationAnnouncementPackagesGetListAnnouncementPackages(
            {
                limit: 3,
                announcement_uuid: announcement?.UUID,
                package_type: PackageType['publication'],
                sort_column: 'Created_Date',
                sort_order: 'DESC',
            },
            {
                query: {
                    enabled: !!announcement?.UUID,
                    select: data =>
                        data.results.find(
                            pkg =>
                                pkg.Report_Status === ReportStatusType['valid']
                        ),
                },
            }
        )

    const handleShowAll = useCallback(() => {
        if (!limit.showAll) {
            setLimit({ amount: data?.total || PACKAGE_LIMIT, showAll: true })
        } else {
            setLimit({ amount: PACKAGE_LIMIT, showAll: false })
        }
    }, [data?.total, limit])

    return (
        <Packages
            data={data?.results}
            total={data?.total}
            showAll={limit.showAll}
            isFetching={isFetching}
            isLoading={isLoading}
            version={version}
            announcement={announcement}
            packageType={packageType}
            isLocked={!!validPublicationPackage && !!validAnnouncementPackage}
            handleShowAll={handleShowAll}
            {...rest}
        />
    )
}

export default Packages
