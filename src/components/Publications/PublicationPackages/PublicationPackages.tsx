import { Notification, Text, formatDate } from '@pzh-ui/components'
import { useMemo } from 'react'

import {
    usePublicationActPackagesGet,
    usePublicationVersionsVersionUuidGet,
} from '@/api/fetchers'
import {
    PackageType,
    PublicationEnvironment,
    PublicationVersionShort,
} from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'

import { PackageStep, PackageStepActions } from './components'

export interface PublicationPackageProps {
    type: 'create' | 'download' | 'upload'
    eventType: PackageType
}

interface PublicationPackagesProps extends PublicationVersionShort {
    environment?: PublicationEnvironment
}

const PublicationPackages = ({
    environment,
    ...version
}: PublicationPackagesProps) => {
    const { data } = usePublicationVersionsVersionUuidGet(version.UUID)

    const { data: packages, isPending } = usePublicationActPackagesGet({
        version_uuid: version.UUID,
    })

    const { validationPackage, publicationPackage } = useMemo(() => {
        const validationPackage = packages?.results.find(
            pkg => pkg.Package_Type === PackageType['validation']
        )
        const publicationPackage = packages?.results.find(
            pkg => pkg.Package_Type === PackageType['publication']
        )

        return { validationPackage, publicationPackage }
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
                            validationPackage?.Report_Status === 'valid'
                        }
                        isLast
                    />
                )}
            </div>

            {isOfficial &&
                validationPackage?.Report_Status === 'valid' &&
                !!!publicationPackage && (
                    <Notification
                        variant="positive"
                        title="Validatie gelukt."
                        className="my-6"
                    />
                )}

            {isOfficial &&
                validationPackage?.Report_Status === 'failed' &&
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
                    {validationPackage?.Report_Status === 'valid' &&
                        !data?.Is_Valid && (
                            <Notification
                                variant="warning"
                                title="De levering kan niet worden gemaakt omdat nog niet alle verplichte velden van de versie zijn ingevuld."
                            />
                        )}

                    {validationPackage?.Report_Status === 'valid' &&
                        data?.Is_Valid && (
                            <Notification title="Let op! Een versie kan niet worden bewerkt of verwijderd nadat je op ‘Maak levering’ hebt geklikt." />
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
                                validationPackage?.Report_Status === 'valid' &&
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
                                publicationPackage?.Report_Status === 'valid'
                            }
                            isLast
                        />
                    </div>
                </>
            )}

            {isOfficial && publicationPackage?.Report_Status === 'valid' && (
                <Notification
                    variant="positive"
                    title={`Publicatie gelukt. Wordt bekend gemaakt op ${announcementDate}, treedt in werking op ${effectiveDate}.`}
                    className="my-6"
                />
            )}

            {isOfficial && publicationPackage?.Report_Status === 'failed' && (
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
