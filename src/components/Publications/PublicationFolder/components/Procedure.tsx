import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Heading,
} from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'

import { ProcedureType } from '@/api/fetchers.schemas'

const config = {
    draft: {
        label: 'Ontwerp',
    },
    final: {
        label: 'Definitief',
    },
}

interface ProcedureProps {
    procedureType: ProcedureType
}

const Procedure = ({ procedureType }: ProcedureProps) => {
    return (
        <AccordionItem value={procedureType} className="last:border-b-0">
            <AccordionTrigger
                hideIcon
                className="flex items-center justify-start px-8 py-4 [&[data-state=open]>svg]:rotate-90">
                <div className="flex items-center gap-4">
                    <AngleRight
                        size={20}
                        className="transition-transform duration-200"
                    />
                    <Heading level="3" size="m" className="-mb-1 capitalize">
                        {config[procedureType].label}
                    </Heading>
                </div>
            </AccordionTrigger>
            <AccordionContent>Test</AccordionContent>
        </AccordionItem>
    )
}

export default Procedure
