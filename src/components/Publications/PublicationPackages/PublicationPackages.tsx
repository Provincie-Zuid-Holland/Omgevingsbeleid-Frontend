import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Heading,
} from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'

import { PublicationShort, PublicationVersion } from '@/api/fetchers.schemas'

import { PublicationType } from '../types'
import Packages from './components/Packages'

const config = {
    act: {
        label: 'Regeling',
    },
    announcement: {
        label: 'Kennisgeving',
    },
}

interface PublicationPackagesProps {
    version: PublicationVersion
    publication?: PublicationShort
    publicationType: PublicationType
}

const PublicationPackages = ({
    publicationType,
    ...rest
}: PublicationPackagesProps) => {
    return (
        <AccordionItem
            value={publicationType}
            className="group rounded-lg border border-pzh-gray-200">
            <AccordionTrigger
                hideIcon
                className="flex h-16 items-center justify-between rounded-t-lg bg-pzh-gray-100 px-6 group-only:hover:no-underline [&[data-disabled]>*]:text-pzh-gray-300 hover:[&[data-disabled]]:no-underline [&[data-state=closed]]:rounded-b-lg [&[data-state=open]>svg]:rotate-90">
                <Heading level="3" size="m" className="capitalize">
                    {config[publicationType].label}
                </Heading>
                <AngleRight
                    size={20}
                    className="transition-transform duration-200 group-only:hidden"
                />
            </AccordionTrigger>
            <AccordionContent className="pb-0">
                <Packages
                    packageType="validation"
                    publicationType={publicationType}
                    {...rest}
                />
                <Packages
                    packageType="publication"
                    publicationType={publicationType}
                    {...rest}
                />
            </AccordionContent>
        </AccordionItem>
    )
}

export default PublicationPackages
