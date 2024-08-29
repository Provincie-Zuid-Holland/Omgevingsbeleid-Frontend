import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Badge,
    Heading,
} from '@pzh-ui/components'
import { AngleRight, PenNib, PencilLight } from '@pzh-ui/icons'
import { useCallback } from 'react'

import {
    ProcedureType,
    Publication as PubicationType,
    PublicationEnvironment,
} from '@/api/fetchers.schemas'

import Publication from './Publication'

const config = {
    draft: {
        label: 'Ontwerp',
        icon: PencilLight,
    },
    final: {
        label: 'Definitief',
        icon: PenNib,
    },
}

interface ProcedureProps {
    procedureType: ProcedureType
    environments?: PublicationEnvironment[]
    publications?: PubicationType[]
}

const Procedure = ({
    procedureType,
    environments,
    publications,
}: ProcedureProps) => {
    const Icon = config[procedureType].icon

    const getPublicationsByEnvironment = useCallback(
        (enviromentUUID: string) =>
            publications?.find(
                publication => publication.Environment_UUID === enviromentUUID
            ),
        [publications]
    )

    return (
        <AccordionItem
            value={procedureType}
            className="border-pzh-gray-200 first:border-t last:border-b-0">
            <AccordionTrigger
                hideIcon
                className="flex h-16 border-pzh-gray-200 hover:no-underline [&[data-state=open]]:border-b [&[data-state=open]_[data-icon=angle]]:rotate-90">
                <div className="flex h-[inherit] w-5/12 items-center border-r border-pzh-gray-200 pl-8 pr-6">
                    <div className="flex h-[inherit] w-full items-center justify-between border-pzh-gray-200">
                        <div className="flex items-center gap-4">
                            <AngleRight
                                size={20}
                                className="transition-transform duration-200"
                                data-icon="angle"
                            />
                            <Icon size={24} className="text-pzh-blue-100" />
                            <Heading
                                level="3"
                                size="m"
                                className="-mb-1 capitalize">
                                {config[procedureType].label}
                            </Heading>
                        </div>
                        <Badge text="Actief" upperCase={false} />
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
                <Accordion type="multiple">
                    {environments?.map(environment => {
                        const publication = getPublicationsByEnvironment(
                            environment.UUID
                        )

                        if (!!!publication) return null

                        return (
                            <Publication
                                key={environment.UUID}
                                environment={environment}
                                {...publication}
                            />
                        )
                    })}
                </Accordion>
            </AccordionContent>
        </AccordionItem>
    )
}

export default Procedure
