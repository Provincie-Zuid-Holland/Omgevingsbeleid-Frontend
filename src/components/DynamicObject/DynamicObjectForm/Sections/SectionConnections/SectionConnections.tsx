import { FieldLabel, Heading, Text } from '@pzh-ui/components'

import { Model, DynamicConnections } from '@/config/objects/types'

interface SectionConnectionsProps {
    model: Model
    section: DynamicConnections
}

const SectionConnections = ({ model, section }: SectionConnectionsProps) => {
    return (
        <>
            <div className="col-span-2">
                <Heading level="3" className="mb-3">
                    Koppelingen
                </Heading>
                <Text type="body">{section.description}</Text>
            </div>

            <div className="col-span-4 pt-[48px]">
                <FieldLabel
                    name="Relations"
                    label="Koppelingen"
                    description={section.fieldDescription}
                />
            </div>
        </>
    )
}

export default SectionConnections
