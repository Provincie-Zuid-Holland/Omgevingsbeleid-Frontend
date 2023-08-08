import { PillButton, Text } from '@pzh-ui/components'
import { Heading, Plus } from '@pzh-ui/icons'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/Accordion'

const Configurator = () => {
    return (
        <div>
            <Text type="body-bold" color="text-pzh-blue">
                Verordening
            </Text>

            <div>
                <Accordion isDraggable className="mb-3">
                    <AccordionItem>
                        <AccordionTrigger>
                            <div className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] bg-pzh-warm-gray-light">
                                <Heading size={14} className="text-pzh-white" />
                            </div>
                            <Text
                                className="-mb-1 ml-[16px]"
                                color="text-pzh-blue">
                                Hoofdstuk 1: Adequaat aanbod openbaar vervoer
                            </Text>
                        </AccordionTrigger>
                        <AccordionContent className="pl-[72px]">
                            Hallo
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <PillButton icon={Plus}>Hoofdstuk</PillButton>
            </div>
        </div>
    )
}

export default Configurator
