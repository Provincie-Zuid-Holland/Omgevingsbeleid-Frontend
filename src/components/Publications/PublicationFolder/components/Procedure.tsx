import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Heading,
} from '@pzh-ui/components'
import { AngleRight, PenNib, PencilLight } from '@pzh-ui/icons'
import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

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
    const { moduleId } = useParams()

    const { activeFolders, setActiveFolders } = usePublicationStore(
        useShallow(state => ({
            activeFolders: state.activeFolders,
            setActiveFolders: state.setActiveFolders,
        }))
    )

    const Icon = config[procedureType].icon

    const getEnvironmentByUUID = useCallback(
        (enviromentUUID?: string | null) =>
            environments?.find(
                environment => environment.UUID === enviromentUUID
            ),
        [environments]
    )

    return (
        <AccordionItem
            value={`${moduleId}-${documentType}-${procedureType}`}
            className="group/procedure border-pzh-gray-200 first:border-t last:border-b-0"
            disabled={!!!publications?.length}>
            <AccordionTrigger
                hideIcon
                className="flex h-16 border-pzh-gray-200 hover:no-underline [&[data-state=open]]:border-b [&[data-state=open]_[data-icon=angle]]:rotate-90">
                <div className="flex h-[inherit] w-5/12 items-center border-r border-pzh-gray-200 pl-8 pr-6">
                    <div className="flex h-[inherit] w-full items-center gap-4 border-pzh-gray-200">
                        <AngleRight
                            size={20}
                            className="transition-transform duration-200 group-data-[disabled]/procedure:text-pzh-gray-300"
                            data-icon="angle"
                        />
                        <Icon
                            size={20}
                            className="text-pzh-blue-100 group-data-[disabled]/procedure:text-pzh-gray-300"
                        />
                        <Heading
                            level="3"
                            size="s"
                            className="-mb-1 capitalize group-data-[disabled]/procedure:text-pzh-gray-300">
                            {config[procedureType].label}
                        </Heading>
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
