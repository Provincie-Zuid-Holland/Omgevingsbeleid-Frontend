import { Notification, Text, formatDate } from '@pzh-ui/components'
import { useMemo } from 'react'

import {
    usePublicationBillsBillUuidPackagesGet,
    usePublicationsPublicationUuidBillsBillUuidGet,
} from '@/api/fetchers'
import {
    PackageEventType,
    PublicationVersionShort,
} from '@/api/fetchers.schemas'

import { PackageStep } from './components'

export interface PublicationPackageProps {
    type: 'create' | 'download' | 'upload'
    eventType: PackageEventType
}

const PublicationPackages = (version: PublicationVersionShort) => {
    const { data } = usePublicationsPublicationUuidBillsBillUuidGet(
        version.Publication_UUID,
        version.UUID
    )

    const { data: packages } = usePublicationBillsBillUuidPackagesGet(
        version.UUID
    )

    const { validationPackage, publicationPackage } = useMemo(() => {
        const validationPackage = packages?.results.find(
            pkg => pkg.Package_Event_Type === 'Validatie'
        )
        const publicationPackage = packages?.results.find(
            pkg => pkg.Package_Event_Type === 'Publicatie'
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

    return (
        <>
            {!!!packages?.results.length && (
                <Notification
                    variant="warning"
                    title="Let op! Een versie kan niet worden bewerkt of verwijderd
                    nadat je op ‘Maak levering’ hebt geklikt."
                />
            )}

            <div>
                <Text size="m" bold color="text-pzh-blue-500">
                    {version.Is_Official ? 'Validatie' : 'Publicatie'}
                </Text>
                <PackageStep
                    version={version}
                    type="create"
                    eventType="Validatie"
                    isActive={!!!validationPackage}
                    isSucceeded={!!validationPackage}
                    isFirst
                />
                <PackageStep
                    version={version}
                    type="download"
                    eventType="Validatie"
                    isActive={!!validationPackage}
                    isLast={!version.Is_Official}
                    isSucceeded={!!validationPackage?.Latest_Download_Date}
                />
                {version.Is_Official && (
                    <PackageStep
                        version={version}
                        type="upload"
                        eventType="Validatie"
                        isActive={!!validationPackage?.Latest_Download_Date}
                        isSucceeded={
                            validationPackage?.Validation_Status === 'Valid'
                        }
                        isLast
                        isLoading={
                            validationPackage?.Validation_Status ===
                                'Pending' && !!validationPackage.Reports?.length
                        }
                    />
                )}
            </div>

            {version.Is_Official &&
                validationPackage?.Validation_Status === 'Valid' &&
                !!!publicationPackage && (
                    <Notification
                        variant="positive"
                        title="Validatie gelukt."
                        className="my-6"
                    />
                )}

            {version.Is_Official && (
                <div>
                    <Text size="m" bold color="text-pzh-blue-500">
                        Publicatie
                    </Text>
                    <PackageStep
                        version={version}
                        type="create"
                        eventType="Publicatie"
                        isActive={
                            validationPackage?.Validation_Status === 'Valid'
                        }
                        isSucceeded={!!publicationPackage}
                        isFirst
                    />
                    <PackageStep
                        version={version}
                        type="download"
                        eventType="Publicatie"
                        isActive={!!publicationPackage}
                        isLast={!version.Is_Official}
                        isSucceeded={!!publicationPackage?.Latest_Download_Date}
                    />
                    <PackageStep
                        version={version}
                        type="upload"
                        eventType="Publicatie"
                        isActive={!!publicationPackage?.Latest_Download_Date}
                        isSucceeded={
                            publicationPackage?.Validation_Status === 'Valid'
                        }
                        isLast
                        isLoading={
                            publicationPackage?.Validation_Status ===
                                'Pending' &&
                            !!publicationPackage.Reports?.length
                        }
                    />
                </div>
            )}

            {version.Is_Official &&
                publicationPackage?.Validation_Status === 'Valid' && (
                    <Notification
                        variant="positive"
                        title={`Publicatie gelukt. Wordt bekend gemaakt op ${announcementDate}, treedt in werking op ${effectiveDate}.`}
                        className="my-6"
                    />
                )}
        </>
    )
}

export default PublicationPackages
