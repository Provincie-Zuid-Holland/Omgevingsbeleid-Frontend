import { useMemo } from 'react'

import { formatDate, Notification } from '@pzh-ui/components'

import {
    PublicationAnnouncementShort,
    PublicationVersion,
} from '@/api/fetchers.schemas'
import { parseUtc } from '@/utils/parseUtc'

import { PublicationType } from '../types'

interface PublicationNotificationProps {
    publicationType: PublicationType
    version?: PublicationVersion
    announcement?: PublicationAnnouncementShort
}

const PublicationNotification = ({
    publicationType,
    version,
    announcement,
}: PublicationNotificationProps) => {
    const isDraft = version?.Publication.Procedure_Type === 'draft'

    const actAnnouncementDate = useMemo(
        () =>
            version?.Announcement_Date &&
            formatDate(parseUtc(version.Announcement_Date), 'd LLLL yyyy'),
        [version]
    )

    const announcementDate = useMemo(
        () =>
            announcement?.Announcement_Date &&
            formatDate(parseUtc(announcement.Announcement_Date), 'd LLLL yyyy'),
        [announcement]
    )

    if (publicationType === 'act') {
        const label = isDraft ? 'Ontwerp' : 'Regeling'

        return (
            <Notification
                variant="positive"
                title={`${
                    isDraft ? 'Ontwerp' : 'Regeling'
                } publicatie succesvol`}
                className="w-full">
                {actAnnouncementDate
                    ? `${label} wordt bekendgemaakt op ${actAnnouncementDate}.`
                    : `${label} is succesvol gepubliceerd.`}
            </Notification>
        )
    }

    return (
        <Notification
            variant="positive"
            title="Kennisgeving publicatie succesvol"
            className="w-full">
            {announcementDate
                ? `Kennisgeving wordt bekendgemaakt op ${announcementDate}.`
                : 'Kennisgeving is succesvol gepubliceerd.'}
        </Notification>
    )
}

export default PublicationNotification
