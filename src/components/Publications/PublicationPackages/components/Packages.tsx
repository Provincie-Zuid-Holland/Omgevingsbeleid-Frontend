import { Button, cn, Notification, Text } from '@pzh-ui/components'

import {
    usePublicationActPackagesGet,
    usePublicationAnnouncementPackagesGet,
    usePublicationAnnouncementsGet,
} from '@/api/fetchers'
import {
    PackageType,
    PublicationPackage,
    PublicationShort,
    PublicationVersion,
} from '@/api/fetchers.schemas'
import { LoaderCard } from '@/components/Loader'
import useModalStore from '@/store/modalStore'

import { useActions } from './actions'
import Package from './Package'
import PackageCreate from './PackageCreate'

const config = {
    validation: {
        label: 'Validatie',
    },
    publication: {
        label: 'Publicatie',
    },
}

interface PackagesProps {
    data?: PublicationPackage[]
    isFetching?: boolean
    version: PublicationVersion
    publication?: PublicationShort
    packageType: PackageType
    validPublicationPackage?: PublicationPackage
    customLabel?: string
    isLocked?: boolean
    canPublicate?: boolean
}

const Packages = ({
    data,
    isFetching,
    version,
    publication,
    packageType,
    customLabel,
    isLocked,
    canPublicate,
}: PackagesProps) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { createPackage } = useActions({
        versionUUID: version.UUID,
        publicationUUID: String(publication?.UUID),
    })

    return (
        <div className="grid grid-cols-12 border-pzh-gray-200 first:border-b">
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
                        'rounded-lg border border-pzh-gray-200 bg-pzh-white',
                        {
                            'bg-pzh-gray-100': isLocked && !!!data?.length,
                        }
                    )}>
                    {isFetching ? (
                        <LoaderCard mb="0" height="64" />
                    ) : !!!data?.length ? (
                        <PackageCreate
                            createPackage={createPackage}
                            packageType={packageType}
                            isLocked={isLocked}
                        />
                    ) : (
                        <>
                            {data.map(item => (
                                <Package
                                    key={item.UUID}
                                    isLocked={isLocked}
                                    publicationUUID={String(publication?.UUID)}
                                    versionUUID={version.UUID}
                                    canPublicate={canPublicate}
                                    {...item}
                                />
                            ))}
                            {!version.Is_Locked && (
                                <PackageCreate
                                    createPackage={createPackage}
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
}: PackagesProps) => {
    const { data, isFetching } = usePublicationActPackagesGet(
        {
            limit: 100,
            version_uuid: version.UUID,
        },
        {
            query: {
                enabled: !!version.UUID,
                select: data =>
                    data.results
                        .filter(item => item.Package_Type === packageType)
                        .sort(
                            (a, b) =>
                                new Date(a.Created_Date + 'Z').getTime() -
                                new Date(b.Created_Date + 'Z').getTime()
                        ),
            },
        }
    )

    return (
        <Packages
            data={data}
            isFetching={isFetching}
            version={version}
            packageType={packageType}
            {...rest}
        />
    )
}

export const AnnouncementPackages = ({
    version,
    packageType,
    validPublicationPackage,
    ...rest
}: PackagesProps) => {
    const { data: announcement } = usePublicationAnnouncementsGet(
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

    const { data, isFetching } = usePublicationAnnouncementPackagesGet(
        {
            limit: 100,
            announcement_uuid: announcement?.UUID,
        },
        {
            query: {
                enabled: !!announcement?.UUID,
                select: data =>
                    data.results
                        .filter(item => item.Package_Type === packageType)
                        .sort(
                            (a, b) =>
                                new Date(a.Created_Date + 'Z').getTime() -
                                new Date(b.Created_Date + 'Z').getTime()
                        ),
            },
        }
    )

    const { data: validAnnouncementPackage } =
        usePublicationAnnouncementPackagesGet(
            {
                limit: 100,
                announcement_uuid: announcement?.UUID,
            },
            {
                query: {
                    enabled: !!announcement?.UUID,
                    select: data =>
                        data.results.find(
                            pkg =>
                                pkg.Report_Status === 'valid' &&
                                pkg.Package_Type === 'publication'
                        ),
                },
            }
        )

    return (
        <Packages
            data={data}
            isFetching={isFetching}
            version={version}
            packageType={packageType}
            isLocked={!!validPublicationPackage && !!validAnnouncementPackage}
            {...rest}
        />
    )
}

export default Packages
