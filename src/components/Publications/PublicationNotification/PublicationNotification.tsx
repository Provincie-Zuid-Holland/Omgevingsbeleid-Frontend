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
    const isDraft = version?.publication.procedure_type === 'draft'

    const actAnnouncementDate = useMemo(
        () =>
            version?.announcement_date &&
            formatDate(parseUtc(version.announcement_date), 'd LLLL yyyy'),
        [version]
    )

    const announcementDate = useMemo(
        () =>
            announcement?.announcement_date &&
            formatDate(parseUtc(announcement.announcement_date), 'd LLLL yyyy'),
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
