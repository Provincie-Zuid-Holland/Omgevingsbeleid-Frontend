import { Text } from '@pzh-ui/components'
import { Check } from '@pzh-ui/icons'
import classNames from 'clsx'

import { usePublicationAnnouncementPackagesGet } from '@/api/fetchers'
import { PublicationAnnouncementShort } from '@/api/fetchers.schemas'

import { PublicationAnnouncementPackageProps } from '../PublicationAnnouncement'
import PackageStepActions from './PackageStepActions'

interface PackageStepProps extends PublicationAnnouncementPackageProps {
    handleAction?: () => void
    announcement: PublicationAnnouncementShort
    isActive?: boolean
    isSucceeded?: boolean
    isFirst?: boolean
    isLast?: boolean
    isLoading?: boolean
}

const STEP_LABEL = {
    update: 'Vul gegevens in',
    create: 'Maak kennisgeving',
    download: 'Download kennisgeving',
    upload: 'Upload rapport(en) (kennisgeving)',
}

const PackageStep = ({
    handleAction,
    announcement,
    type,
    eventType,
    isActive,
    isSucceeded,
    isFirst,
    isLast,
    isLoading,
}: PackageStepProps) => {
    const { data: pkg } = usePublicationAnnouncementPackagesGet(
        { announcement_uuid: announcement.UUID },
        {
            query: {
                select: data =>
                    data.results.find(pkg => pkg.Package_Type === eventType),
            },
        }
    )

    const indicatorClass = classNames(
        'after:content-[` `] -mt-1 flex h-[19px] w-[19px] items-center justify-center rounded-full border',
        {
            'after:block after:h-[13px] after:w-[13px] after:rounded-full after:bg-pzh-green-500':
                isActive && !isSucceeded,
            'border-pzh-gray-600': !isSucceeded,
            'border-pzh-green-500 bg-pzh-green-500': isSucceeded,
        }
    )

    const borderClass = classNames('absolute h-full', {
        'before:content-[` `] before:left-[9px] before:absolute before:top-0 before:block before:h-[calc(50%-13px)] before:w-px before:bg-pzh-gray-300':
            !isFirst,
        'after:content-[` `] after:left-[9px] after:absolute after:bottom-0 after:block after:h-[calc(50%-9px)] after:w-px after:bg-pzh-gray-300':
            !isLast,
    })

    return (
        <div className="relative flex items-center gap-5">
            <div className={borderClass} />
            <div className={indicatorClass}>
                {isSucceeded && <Check className="text-pzh-white" size={11} />}
            </div>
            <div
                className={classNames(
                    'flex flex-1 items-center justify-between py-4',
                    {
                        'border-t border-pzh-gray-300': !isFirst,
                    }
                )}>
                <div>
                    <Text
                        color="text-pzh-blue-500"
                        className="whitespace-nowrap">
                        {STEP_LABEL[type]}
                    </Text>
                    {type === 'upload' && !isSucceeded && (
                        <Text size="s" color="text-pzh-gray-600">
                            Selecteer alle(!) rapporten die zijn teruggekomen
                            van het DSO
                        </Text>
                    )}
                </div>
                <PackageStepActions
                    handleAction={handleAction}
                    announcement={announcement}
                    publicationPackage={pkg}
                    type={type}
                    eventType={eventType}
                    isActive={isActive}
                    isSucceeded={isSucceeded}
                    isLoading={isLoading}
                />
            </div>
        </div>
    )
}

export default PackageStep
