import { Button, cn, Text } from '@pzh-ui/components'
import { Check } from '@pzh-ui/icons'
import { useMemo } from 'react'

import { usePublicationAnnouncementPackagesGet } from '@/api/fetchers'
import {
    PackageType,
    PublicationAnnouncementShort,
    ReportStatusType,
} from '@/api/fetchers.schemas'
import useModalStore from '@/store/modalStore'

import { getIndicatorClass } from './utils'

interface AnnouncementDataProps extends PublicationAnnouncementShort {
    isLocked?: boolean
}

const AnnouncementData = ({ UUID, isLocked }: AnnouncementDataProps) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data: isSucceeded } = usePublicationAnnouncementPackagesGet(
        {
            limit: 3,
            announcement_uuid: UUID,
            package_type: PackageType['publication'],
            sort_column: 'Created_Date',
            sort_order: 'DESC',
        },
        {
            query: {
                select: data =>
                    data.results.some(
                        pkg => pkg.Report_Status === ReportStatusType['valid']
                    ),
            },
        }
    )

    const indicatorClass = useMemo(
        () => getIndicatorClass(isSucceeded),
        [isSucceeded]
    )

    return (
        <div className="grid grid-cols-12 border-b border-pzh-gray-200">
            <div className="col-span-3 p-6 pt-9">
                <Text
                    bold
                    className="heading-s"
                    color={
                        !isSucceeded ? 'text-pzh-blue-500' : 'text-pzh-gray-300'
                    }>
                    Gegevens
                </Text>
            </div>
            <div className="col-span-9 px-6 py-4">
                <div
                    className={cn(
                        'rounded-lg border border-pzh-gray-200 bg-pzh-white',
                        {
                            'bg-pzh-gray-100': isLocked && !isSucceeded,
                        }
                    )}>
                    <div className="flex items-center justify-between px-6 py-3">
                        <div className="flex items-center gap-4">
                            <div className={indicatorClass}>
                                {isSucceeded && (
                                    <Check
                                        className="text-pzh-white"
                                        size={11}
                                    />
                                )}
                            </div>
                            <Text
                                bold
                                className="heading-s -mb-1"
                                color={
                                    isLocked
                                        ? !isSucceeded
                                            ? 'text-pzh-gray-300'
                                            : 'text-pzh-blue-500'
                                        : 'text-pzh-blue-500'
                                }>
                                Vul gegevens in
                            </Text>
                        </div>
                        <Button
                            variant="cta"
                            size="small"
                            onPress={() =>
                                setActiveModal(
                                    'publicationAnnouncementUpdate',
                                    { announcementUuid: UUID, isLocked }
                                )
                            }>
                            Ga naar het formulier
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnnouncementData
