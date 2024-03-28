import { Notification, Text, formatDate } from '@pzh-ui/components'
import { useMemo } from 'react'

import {
    usePublicationEnvironmentsGet,
    usePublicationPackagesGet,
    usePublicationVersionsVersionUuidGet,
} from '@/api/fetchers'
import { PackageType, PublicationVersionShort } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'

import { PackageStep, PackageStepActions } from './components'

export interface PublicationPackageProps {
    type: 'create' | 'download' | 'upload'
    eventType: PackageType
}

interface PublicationPackagesProps extends PublicationVersionShort {
    isAbort?: boolean
}

const PublicationPackages = ({
    isAbort,
    ...version
}: PublicationPackagesProps) => {
    const { data } = usePublicationVersionsVersionUuidGet(version.UUID)

    const { data: packages, isPending } = usePublicationPackagesGet({
        version_uuid: version.UUID,
    })

    const { data: environment } = usePublicationEnvironmentsGet(undefined, {
        query: {
            select: data =>
                data.results.find(
                    environment => environment.UUID === version.Environment_UUID
                ),
        },
    })

    const { validationPackage, publicationPackage, abortPackage } =
        useMemo(() => {
            const validationPackage = packages?.results.find(
                pkg => pkg.Package_Type === PackageType['validation']
            )
            const publicationPackage = packages?.results.find(
                pkg => pkg.Package_Type === PackageType['publication']
            )
            const abortPackage = packages?.results.find(
                pkg => pkg.Package_Type === PackageType['publication_abort']
            )

            return { validationPackage, publicationPackage, abortPackage }
        }, [packages?.results])

    const { announcementDate, effectiveDate } = useMemo(() => {
        const announcementDate =
            data?.Announcement_Date &&
            formatDate(new Date(data.Announcement_Date), 'd LLLL yyyy')

        const effectiveDate =
            data?.Effective_Date &&
            formatDate(new Date(data.Effective_Date), 'd LLLL yyyy')

        return { announcementDate, effectiveDate }
    }, [data])

    const isOfficial = useMemo(
        () => environment?.Can_Publicate,
        [environment?.Can_Publicate]
    )

    if (isPending) {
        return (
            <div className="my-10 flex justify-center">
                <LoaderSpinner />
            </div>
        )
    }

    if (isAbort) {
        return (
            <>
                <div>
                    <Text size="m" bold color="text-pzh-blue-500">
                        Afbreekverzoek
                    </Text>
                    <PackageStep
                        version={version}
                        type="create"
                        eventType="publication_abort"
                        isActive={!!!abortPackage && data?.Is_Valid}
                        isSucceeded={!!abortPackage}
                        isFirst
                    />
                    <PackageStep
                        version={version}
                        type="download"
                        eventType="publication_abort"
                        isActive={!!abortPackage}
                        isLast={!isOfficial}
                        isSucceeded={!!abortPackage?.Zip.Latest_Download_Date}
                    />
                    {isOfficial && (
                        <PackageStep
                            version={version}
                            type="upload"
                            eventType="publication_abort"
                            isActive={!!abortPackage?.Zip.Latest_Download_Date}
                            isSucceeded={
                                abortPackage?.Report_Status === 'Valid'
                            }
                            isLast
                        />
                    )}
                </div>
            </>
        )
    }

    return (
        <>
            {!data?.Is_Valid && !!!validationPackage && (
                <Notification
                    title="De levering kan niet worden gemaakt omdat nog niet alle verplichte velden van de versie zijn ingevuld."
                    variant="warning"
                />
            )}

            <div>
                <Text size="m" bold color="text-pzh-blue-500">
                    {isOfficial ? 'Validatie' : 'Publicatie'}
                </Text>
                <PackageStep
                    version={version}
                    type="create"
                    eventType="validation"
                    isActive={!!!validationPackage && data?.Is_Valid}
                    isSucceeded={!!validationPackage}
                    isFirst
                />
                <PackageStep
                    version={version}
                    type="download"
                    eventType="validation"
                    isActive={!!validationPackage}
                    isLast={!isOfficial}
                    isSucceeded={!!validationPackage?.Zip.Latest_Download_Date}
                />
                {isOfficial && (
                    <PackageStep
                        version={version}
                        type="upload"
                        eventType="validation"
                        isActive={!!validationPackage?.Zip.Latest_Download_Date}
                        isSucceeded={
                            validationPackage?.Report_Status === 'Valid'
                        }
                        isLast
                    />
                )}
            </div>

            {isOfficial && !data?.Is_Valid && !!validationPackage && (
                <Notification
                    title="De levering kan niet worden gemaakt omdat nog niet alle verplichte velden van de versie zijn ingevuld."
                    variant="warning"
                    className="my-6"
                />
            )}

            {isOfficial &&
                validationPackage?.Report_Status === 'Valid' &&
                !!!publicationPackage && (
                    <Notification
                        variant="positive"
                        title="Validatie gelukt."
                        className="my-6"
                    />
                )}

            {isOfficial &&
                validationPackage?.Report_Status === 'Failed' &&
                !!!publicationPackage && (
                    <div className="my-6 flex w-full justify-between gap-4">
                        <Notification
                            variant="negative"
                            title="Validatie niet goedgekeurd. Publicatie is niet mogelijk, bewerk de versie en probeer het opnieuw."
                            className="w-full"
                        />
                        <PackageStepActions
                            version={version}
                            type="create"
                            eventType="validation"
                            buttonLabel="Maak nieuwe levering"
                            hideDescription
                            isActive
                        />
                    </div>
                )}

            {isOfficial && (
                <>
                    {validationPackage?.Report_Status === 'Valid' &&
                        !data?.Is_Valid && (
                            <Notification
                                variant="warning"
                                title="De levering kan niet worden gemaakt omdat nog niet alle verplichte velden van de versie zijn ingevuld."
                            />
                        )}

                    <div>
                        <Text size="m" bold color="text-pzh-blue-500">
                            Publicatie
                        </Text>
                        <PackageStep
                            version={version}
                            type="create"
                            eventType="publication"
                            isActive={
                                validationPackage?.Report_Status === 'Valid' &&
                                data?.Is_Valid
                            }
                            isSucceeded={!!publicationPackage}
                            isFirst
                        />
                        <PackageStep
                            version={version}
                            type="download"
                            eventType="publication"
                            isActive={!!publicationPackage}
                            isLast={!isOfficial}
                            isSucceeded={
                                !!publicationPackage?.Zip.Latest_Download_Date
                            }
                        />
                        <PackageStep
                            version={version}
                            type="upload"
                            eventType="publication"
                            isActive={
                                !!publicationPackage?.Zip.Latest_Download_Date
                            }
                            isSucceeded={
                                publicationPackage?.Report_Status === 'Valid'
                            }
                            isLast
                        />
                    </div>
                </>
            )}

            {isOfficial && publicationPackage?.Report_Status === 'Valid' && (
                <Notification
                    variant="positive"
                    title={`Publicatie gelukt. Wordt bekend gemaakt op ${announcementDate}, treedt in werking op ${effectiveDate}.`}
                    className="my-6"
                />
            )}

            {isOfficial && publicationPackage?.Report_Status === 'Failed' && (
                <div className="my-6 flex w-full justify-between gap-4">
                    <Notification
                        variant="negative"
                        title="Publicatie niet gelukt. Bewerk de versie en probeer het opnieuw."
                        className="w-full"
                    />
                    <PackageStepActions
                        version={version}
                        type="create"
                        eventType="publication"
                        buttonLabel="Maak nieuwe levering"
                        hideDescription
                        isActive
                    />
                </div>
            )}
        </>
    )
}

export default PublicationPackages