import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Badge,
    Heading,
} from '@pzh-ui/components'
import { AngleRight, ArrowDownToSquare } from '@pzh-ui/icons'

import { usePublicationsPublicationUuidVersionsGet } from '@/api/fetchers'
import {
    PublicationEnvironment,
    Publication as PublicationType,
} from '@/api/fetchers.schemas'

import Version from './Version'
import VersionAdd from './VersionAdd'

interface PublicationProps extends PublicationType {
    environment: PublicationEnvironment
}

const Publication = ({ UUID, environment }: PublicationProps) => {
    const { data: versions } = usePublicationsPublicationUuidVersionsGet(
        UUID || '',
        {
            limit: 100,
        }
    )

    return (
        <AccordionItem value={environment.UUID} className="last:border-b-0">
            <AccordionTrigger
                hideIcon
                className="flex h-16 border-pzh-gray-200 hover:no-underline [&[data-state=open]]:border-b [&[data-state=open]_[data-icon=angle]]:rotate-90">
                <div className="flex h-[inherit] w-5/12 items-center border-r border-pzh-gray-200 pl-10 pr-6">
                    <div className="flex h-[inherit] w-full items-center justify-between border-l border-pzh-gray-200 pl-8">
                        <div className="flex items-center gap-4">
                            <AngleRight
                                size={20}
                                className="transition-transform duration-200"
                                data-icon="angle"
                            />
                            <ArrowDownToSquare
                                size={20}
                                className="text-pzh-blue-100"
                            />
                            <Heading
                                level="3"
                                size="s"
                                className="-mb-1 capitalize">
                                {environment.Title} publicatie
                            </Heading>
                        </div>
                        <Badge text="Actief" upperCase={false} />
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
                {versions?.results.map(version => (
                    <Version key={version.UUID} {...version} />
                ))}
                <VersionAdd />
            </AccordionContent>
        </AccordionItem>
    )
}

export default Publication
