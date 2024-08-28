import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Heading,
} from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'
import { useParams } from 'react-router-dom'

import { usePublicationsGet } from '@/api/fetchers'
import { DocumentType, ProcedureType } from '@/api/fetchers.schemas'

import Procedure from './components/Procedure'

interface PublicationFolderProps {
    documentType: DocumentType
}

const PublicationFolder = ({ documentType }: PublicationFolderProps) => {
    const { moduleId } = useParams()

    const { data } = usePublicationsGet({
        document_type: documentType,
        module_id: parseInt(moduleId!),
    })

    const procedureTypes = Object.keys(ProcedureType) as Array<ProcedureType>

    return (
        <AccordionItem
            value={documentType}
            className="rounded-lg border border-pzh-gray-200">
            <AccordionTrigger
                hideIcon
                className="flex items-center justify-between rounded-t-lg bg-pzh-gray-100 px-6 py-4 [&[data-state=closed]]:rounded-b-lg [&[data-state=open]>svg]:rotate-90">
                <Heading level="3" size="m" className="capitalize">
                    {documentType}
                </Heading>
                <AngleRight
                    size={20}
                    className="transition-transform duration-200"
                />
            </AccordionTrigger>
            <AccordionContent className="pb-0">
                <Accordion type="multiple">
                    {procedureTypes.map(procedureType => (
                        <Procedure
                            key={procedureType}
                            procedureType={procedureType}
                        />
                    ))}
                </Accordion>
            </AccordionContent>
        </AccordionItem>
    )
}

export default PublicationFolder
