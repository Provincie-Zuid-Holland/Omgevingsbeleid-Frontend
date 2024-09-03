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
    DocumentType,
    ProcedureType,
    Publication as PubicationType,
    PublicationEnvironment,
} from '@/api/fetchers.schemas'
import usePublicationStore from '@/store/publicationStore'

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
    documentType: DocumentType
    procedureType: ProcedureType
    environments?: PublicationEnvironment[]
    publications?: PubicationType[]
}

const Procedure = ({
    documentType,
    procedureType,
    environments,
    publications,
}: ProcedureProps) => {
    const activeFolders = usePublicationStore(state => state.activeFolders)
    const setActiveFolders = usePublicationStore(
        state => state.setActiveFolders
    )

    const Icon = config[procedureType].icon

    const getEnvironmentByUUID = useCallback(
        (enviromentUUID?: string) =>
            environments?.find(
                environment => environment.UUID === enviromentUUID
            ),
        [environments]
    )

    return (
        <AccordionItem
            value={`${documentType}-${procedureType}`}
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
                            <Icon size={20} className="text-pzh-blue-100" />
                            <Heading
                                level="3"
                                size="s"
                                className="-mb-1 capitalize">
                                {config[procedureType].label}
                            </Heading>
                        </div>
                        <Badge text="Actief" upperCase={false} />
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
                <Accordion
                    type="multiple"
                    value={activeFolders.publications}
                    onValueChange={publications =>
                        setActiveFolders({ publications })
                    }>
                    {publications?.map(publication => {
                        const environment = getEnvironmentByUUID(
                            publication.Environment_UUID
                        )

                        return (
                            <Publication
                                key={publication.UUID}
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
