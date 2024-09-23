import {
    getPublicationAnnouncementsGetQueryKey,
    usePublicationActPackagesActPackageUuidCreateAnnouncementPost,
} from '@/api/fetchers'
import {
    PublicationAnnouncementShort,
    PublicationPackage,
    PublicationVersion,
} from '@/api/fetchers.schemas'
import { Button, Notification, formatDate } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { PublicationType } from '../types'

interface PublicationNotificationProps {
    type: PublicationType
    version?: PublicationVersion
    announcement?: PublicationAnnouncementShort
    validPublicationPackage: PublicationPackage
}

const PublicationNotification = ({
    type,
    version,
    announcement,
    validPublicationPackage,
}: PublicationNotificationProps) => {
    const queryClient = useQueryClient()

    const { mutate: createAnnouncement } =
        usePublicationActPackagesActPackageUuidCreateAnnouncementPost({
            mutation: {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: getPublicationAnnouncementsGetQueryKey({
                            act_package_uuid: validPublicationPackage.UUID,
                            limit: 100,
                        }),
                    })
                },
            },
        })

    if (type === 'act') {
        const announcementDate = useMemo(() => {
            return (
                version?.Announcement_Date &&
                formatDate(new Date(version.Announcement_Date), 'd LLLL yyyy')
            )
        }, [version])

        return (
            <div className="flex w-full justify-between gap-4">
                <Notification
                    variant="positive"
                    title={`Regeling publicatie wordt bekend gemaakt op ${announcementDate}.${
                        !!!announcement
                            ? ' Maak een kennisgeving om dit ontwerp te publiceren'
                            : ''
                    }`}
                    className="w-full"
                />
                {!!!announcement && (
                    <Button
                        variant="cta"
                        onPress={() =>
                            createAnnouncement({
                                actPackageUuid: validPublicationPackage.UUID,
                            })
                        }
                        className="whitespace-nowrap">
                        Maak kennisgeving
                    </Button>
                )}
            </div>
        )
    }

    const announcementDate = useMemo(() => {
        return (
            announcement?.Announcement_Date &&
            formatDate(new Date(announcement.Announcement_Date), 'd LLLL yyyy')
        )
    }, [announcement])

    return (
        <div className="flex w-full justify-between">
            <Notification
                variant="positive"
                title={`Kennisgeving wordt bekend gemaakt op ${announcementDate}.`}
                className="w-full"
            />
        </div>
    )
}

export default PublicationNotification
