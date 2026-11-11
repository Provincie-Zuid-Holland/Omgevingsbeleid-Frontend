import { useCallback, useMemo } from 'react'

import { Heading } from '@pzh-ui/components'
import { PencilLight, PenNib } from '@pzh-ui/icons'

import {
    DocumentType,
    ProcedureType,
    Publication,
    PublicationEnvironment,
} from '@/api/fetchers.schemas'

import Document from './components/Document'

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
    const documentTypes = Object.keys(DocumentType) as Array<DocumentType>

    const environmentPublications = useMemo(
        () =>
            providedPublications?.filter(
                publication => publication.Environment_UUID === environment.UUID
            ),
        [providedPublications, environment.UUID]
    )

    const getPublication = useCallback(
        (documentType: DocumentType, forProcedureType: ProcedureType) =>
            environmentPublications?.find(
                publication =>
                    publication.Document_Type === documentType &&
                    publication.Procedure_Type === forProcedureType
            ),
        [environmentPublications]
    )

    const { label, icon: Icon } = config[procedureType]

    return (
        <div className="flex flex-col rounded-lg border border-pzh-gray-200">
            <div className="flex h-16 items-center gap-3 rounded-t-lg border-b border-pzh-gray-200 bg-pzh-gray-100 px-6">
                <Icon size={20} className="text-pzh-blue-500" />
                <Heading level="3" size="m">
                    {label}
                </Heading>
            </div>

            {documentTypes.map(documentType => (
                <Document
                    key={documentType}
                    environment={environment}
                    documentType={documentType}
                    procedureType={procedureType}
                    publication={getPublication(documentType, procedureType)}
                    canCreate={
                        procedureType === 'draft' ||
                        !!getPublication(documentType, 'draft')
                    }
                />
            ))}
        </div>
    )
}

export default PublicationFolder
