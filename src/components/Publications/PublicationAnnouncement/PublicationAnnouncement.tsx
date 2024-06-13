import { Text } from '@pzh-ui/components'
import { useMemo } from 'react'

import { usePublicationAnnouncementPackagesGet } from '@/api/fetchers'
import {
    PackageType,
    PublicationAnnouncementShort,
} from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'

import { PackageStep } from './components'

export interface PublicationAnnouncementPackageProps {
    type: 'update' | 'create' | 'download' | 'upload'
    eventType: PackageType
}

interface PublicationAnnouncementProps extends PublicationAnnouncementShort {
    handleUpdateAction: () => void
}

const PublicationAnnouncement = ({
    handleUpdateAction,
    ...announcement
}: PublicationAnnouncementProps) => {
    const { data: packages, isPending } = usePublicationAnnouncementPackagesGet(
        {
            announcement_uuid: announcement.UUID,
        }
    )

    const { validationPackage, publicationPackage } = useMemo(() => {
        const validationPackage = packages?.results.find(
            pkg => pkg.Package_Type === PackageType['validation']
        )
        const publicationPackage = packages?.results.find(
            pkg => pkg.Package_Type === PackageType['publication']
        )

        return { validationPackage, publicationPackage }
    }, [packages?.results])

    if (isPending) {
        return (
            <div className="my-10 flex justify-center">
                <LoaderSpinner />
            </div>
        )
    }

    return (
        <>
            <div>
                <Text size="m" bold color="text-pzh-blue-500">
                    Kennisgeving
                </Text>

                <PackageStep
                    handleAction={handleUpdateAction}
                    announcement={announcement}
                    type="update"
                    eventType="publication"
                    isSucceeded={!!publicationPackage}
                    isActive
                    isFirst
                />
                <PackageStep
                    announcement={announcement}
                    type="create"
                    eventType="publication"
                    isActive={validationPackage?.Report_Status === 'valid'}
                    isSucceeded={!!publicationPackage}
                />
                <PackageStep
                    announcement={announcement}
                    type="download"
                    eventType="publication"
                    isActive={!!publicationPackage}
                    isSucceeded={!!publicationPackage?.Zip.Latest_Download_Date}
                />
                <PackageStep
                    announcement={announcement}
                    type="upload"
                    eventType="publication"
                    isActive={!!publicationPackage?.Zip.Latest_Download_Date}
                    isSucceeded={publicationPackage?.Report_Status === 'valid'}
                    isLast
                />
            </div>

            {/* {isOfficial && publicationPackage?.Report_Status === 'valid' && (
                <div className="my-6 flex w-full justify-between gap-4">
                    <Notification
                        variant="positive"
                        title="Kennisgeving publiceren gelukt."
                        className="my-6"
                    />
                </div>
            )}

            {isOfficial && publicationPackage?.Report_Status === 'failed' && (
                <div className="my-6 flex w-full justify-between gap-4">
                    <Notification
                        variant="negative"
                        title="Kennisgeving publiceren niet gelukt. Bewerk de versie en probeer het opnieuw."
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
            )} */}
        </>
    )
}

export default PublicationAnnouncement
