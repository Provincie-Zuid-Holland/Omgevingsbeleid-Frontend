import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Heading,
} from '@pzh-ui/components'
import clsx from 'clsx'
import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import {
    DocumentType,
    ProcedureType,
    Publication,
    PublicationEnvironment,
} from '@/api/fetchers.schemas'
import usePublicationStore from '@/store/publicationStore'

import Document from './components/Document'

const config = {
    draft: {
        label: 'Ontwerp',
    },
    final: {
        label: 'Definitief',
    },
}

interface PublicationFolderProps {
    procedureType: ProcedureType
    publications?: Publication[]
    environment: PublicationEnvironment
}

const PublicationFolder = ({
    procedureType,
    publications: providedPublications,
    environment,
}: PublicationFolderProps) => {
    const { moduleId } = useParams()

    const { activeFolders, setActiveFolders } = usePublicationStore(
        useShallow(state => ({
            activeFolders: state.activeFolders,
            setActiveFolders: state.setActiveFolders,
        }))
    )

    const [hasOverflowClass, setHasOverflowClass] = useState(
        activeFolders.procedureTypes?.includes(
            `${moduleId}-${environment.UUID}-${procedureType}`
        )
    )

    const documentTypes = Object.keys(DocumentType) as Array<DocumentType>

    const publications = useMemo(
        () =>
            providedPublications?.filter(
                publication =>
                    publication.Procedure_Type === procedureType &&
                    publication.Environment_UUID === environment.UUID
            ),
        [providedPublications, procedureType]
    )

    const getPublicationByDocumentType = useCallback(
        (documentType: DocumentType) =>
            publications?.filter(
                publication => publication.Document_Type === documentType
            )?.[0],
        [publications]
    )

    return (
        <AccordionItem
            value={procedureType}
            className="border-pzh-gray-200 rounded-lg border"
            disabled>
            <AccordionTrigger
                hideIcon
                className="bg-pzh-gray-100 flex h-16 items-center justify-between rounded-t-lg px-6 hover:[&[data-disabled]]:no-underline [&[data-state=closed]]:rounded-b-lg [&[data-state=open]>svg]:rotate-90">
                <Heading level="3" size="m" className="capitalize">
                    {config[procedureType].label}
                </Heading>
            </AccordionTrigger>
            <AccordionContent
                className={clsx('pb-0', {
                    '[&[data-state=open]]:overflow-visible': hasOverflowClass,
                })}
                onAnimationEnd={() => setHasOverflowClass(!hasOverflowClass)}>
                <Accordion
                    type="multiple"
                    value={activeFolders.procedureTypes}
                    onValueChange={procedureTypes =>
                        setActiveFolders({ procedureTypes })
                    }>
                    {documentTypes.map(documentType => {
                        const publication =
                            getPublicationByDocumentType(documentType)

                        return (
                            <Document
                                key={documentType}
                                environment={environment}
                                documentType={documentType}
                                procedureType={procedureType}
                                publication={publication}
                            />
                        )
                    })}
                </Accordion>
            </AccordionContent>
        </AccordionItem>
    )
}

export default PublicationFolder
