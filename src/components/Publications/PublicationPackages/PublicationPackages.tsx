import { ReactNode } from 'react'

import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Heading,
} from '@pzh-ui/components'

import clsx from 'clsx'

import {
    PublicationAnnouncementShort,
    PublicationEnvironment,
    PublicationPackage,
    PublicationShort,
    PublicationVersion,
} from '@/api/fetchers.schemas'

import { PublicationType } from '../types'
import AnnouncementData from './components/AnnouncementData'
import { ActPackages, AnnouncementPackages } from './components/Packages'

const config = {
    act: {
        label: 'Regeling',
        component: ActPackages,
    },
    announcement: {
        label: 'Kennisgeving',
        component: AnnouncementPackages,
    },
}

interface PublicationPackagesProps {
    environment?: PublicationEnvironment
    version: PublicationVersion
    publication?: PublicationShort
    publicationType: PublicationType
    validPublicationPackage?: PublicationPackage
    announcement?: PublicationAnnouncementShort
    isLocked?: boolean
    isClosed?: boolean
    isDisabled?: boolean
    /** Rendered on the right-hand side of the section header (e.g. Bewerk besluit / Export PDF). */
    actions?: ReactNode
}

const PublicationPackages = ({
    environment,
    publicationType,
    version,
    announcement,
    isDisabled,
    isClosed,
    actions,
    ...rest
}: PublicationPackagesProps) => {
    const Packages = config[publicationType].component

    return (
        <AccordionItem
            value={publicationType}
            disabled
            className={clsx(
                'group relative rounded-lg border border-pzh-gray-200',
                {
                    'bg-pzh-gray-100': version.Is_Locked,
                }
            )}>
            <AccordionTrigger
                hideIcon
                className={clsx(
                    'flex h-16 items-center justify-between rounded-t-lg bg-pzh-gray-100 px-6 group-only:hover:cursor-default group-only:hover:no-underline hover:[&[data-disabled]]:no-underline [&[data-state=closed]]:rounded-b-lg [&[data-state=open]>svg]:rotate-90',
                    {
                        '[&[data-disabled]>*]:text-pzh-gray-300': isDisabled,
                    }
                )}>
                <Heading level="3" size="m" className="capitalize">
                    {config[publicationType].label}
                </Heading>
            </AccordionTrigger>

            {!!actions && (
                <div className="absolute top-0 right-6 flex h-16 items-center gap-2">
                    {actions}
                </div>
            )}
            <AccordionContent className="pb-0">
                {publicationType === 'announcement' && !!announcement && (
                    <AnnouncementData
                        isLocked={isDisabled}
                        isClosed={isClosed}
                        {...announcement}
                        {...rest}
                    />
                )}
                {environment?.Can_Validate && (
                    <Packages
                        version={version}
                        publicationType={publicationType}
                        packageType="validation"
                        customLabel={
                            !environment.Can_Publicate
                                ? 'Publicatie'
                                : undefined
                        }
                        environment={environment}
                        isLocked={isDisabled}
                        isClosed={isClosed}
                        {...rest}
                    />
                )}
                {environment?.Can_Publicate && (
                    <Packages
                        version={version}
                        publicationType={publicationType}
                        packageType="publication"
                        environment={environment}
                        isLocked={isDisabled}
                        isClosed={isClosed}
                        {...rest}
                    />
                )}
            </AccordionContent>
        </AccordionItem>
    )
}

export default PublicationPackages
