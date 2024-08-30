import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Heading,
} from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'
import { useCallback, useMemo } from 'react'

import { usePublicationEnvironmentsGet } from '@/api/fetchers'
import {
    DocumentType,
    ProcedureType,
    Publication,
} from '@/api/fetchers.schemas'
import usePublicationStore from '@/store/publicationStore'

import Procedure from './components/Procedure'

interface PublicationFolderProps {
    documentType: DocumentType
    publications?: Publication[]
}

const PublicationFolder = ({
    documentType,
    publications: providedPublications,
}: PublicationFolderProps) => {
    const activeFolders = usePublicationStore(state => state.activeFolders)
    const setActiveFolders = usePublicationStore(
        state => state.setActiveFolders
    )

    const { data: environments } = usePublicationEnvironmentsGet({ limit: 100 })

    const procedureTypes = Object.keys(ProcedureType) as Array<ProcedureType>

    const publications = useMemo(
        () =>
            providedPublications?.filter(
                publication => publication.Document_Type === documentType
            ),
        [providedPublications, documentType]
    )

    const getPublicationsByProcedureType = useCallback(
        (procedureType: ProcedureType) =>
            publications?.filter(
                publication => publication.Procedure_Type === procedureType
            ),
        [publications]
    )

    return (
        <AccordionItem
            value={documentType}
            disabled={!!!publications?.length}
            className="rounded-lg border border-pzh-gray-200">
            <AccordionTrigger
                hideIcon
                className="flex h-16 items-center justify-between rounded-t-lg bg-pzh-gray-100 px-6 [&[data-disabled]>*]:text-pzh-gray-300 hover:[&[data-disabled]]:no-underline [&[data-state=closed]]:rounded-b-lg [&[data-state=open]>svg]:rotate-90">
                <Heading level="3" size="m" className="capitalize">
                    {documentType}
                </Heading>
                <AngleRight
                    size={20}
                    className="transition-transform duration-200"
                />
            </AccordionTrigger>
            <AccordionContent className="pb-0">
                <Accordion
                    type="multiple"
                    value={activeFolders.procedureTypes}
                    onValueChange={procedureTypes =>
                        setActiveFolders({ procedureTypes })
                    }>
                    {procedureTypes.map(procedureType => {
                        const publications =
                            getPublicationsByProcedureType(procedureType)

                        if (!publications?.length) return null

                        return (
                            <Procedure
                                key={procedureType}
                                documentType={documentType}
                                procedureType={procedureType}
                                environments={environments?.results}
                                publications={publications}
                            />
                        )
                    })}
                </Accordion>
            </AccordionContent>
        </AccordionItem>
    )
}

export default PublicationFolder
