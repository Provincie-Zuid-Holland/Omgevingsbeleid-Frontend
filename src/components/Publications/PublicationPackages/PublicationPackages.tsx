import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Heading,
} from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'
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
    isDisabled?: boolean
}

const PublicationPackages = ({
    environment,
    publicationType,
    version,
    announcement,
    isDisabled,
    ...rest
}: PublicationPackagesProps) => {
    const Packages = config[publicationType].component

    return (
        <AccordionItem
            value={publicationType}
            disabled={isDisabled}
            className={clsx('group rounded-lg border border-pzh-gray-200', {
                'bg-pzh-gray-100': version.Is_Locked,
            })}>
            <AccordionTrigger
                hideIcon
                className="flex h-16 items-center justify-between rounded-t-lg bg-pzh-gray-100 px-6 group-only:hover:cursor-default group-only:hover:no-underline [&[data-disabled]>*]:text-pzh-gray-300 hover:[&[data-disabled]]:no-underline [&[data-state=closed]]:rounded-b-lg [&[data-state=open]>svg]:rotate-90">
                <Heading level="3" size="m" className="capitalize">
                    {config[publicationType].label}
                </Heading>
                <AngleRight
                    size={20}
                    className="transition-transform duration-200 group-only:hidden"
                />
            </AccordionTrigger>
            <AccordionContent className="pb-0">
                {publicationType === 'announcement' && !!announcement && (
                    <AnnouncementData {...announcement} {...rest} />
                )}
                {environment?.Can_Validate && (
                    <Packages
                        version={version}
                        packageType="validation"
                        customLabel={
                            !environment.Can_Publicate
                                ? 'Publicatie'
                                : undefined
                        }
                        canPublicate={environment.Can_Publicate}
                        {...rest}
                    />
                )}
                {environment?.Can_Publicate && (
                    <Packages
                        version={version}
                        packageType="publication"
                        canPublicate={environment.Can_Publicate}
                        {...rest}
                    />
                )}
            </AccordionContent>
        </AccordionItem>
    )
}

export default PublicationPackages
