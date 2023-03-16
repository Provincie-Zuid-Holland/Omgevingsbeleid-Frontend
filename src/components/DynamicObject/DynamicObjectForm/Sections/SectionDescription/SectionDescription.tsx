import { FormikRte, Heading, Text } from '@pzh-ui/components'

import { Model, DynamicDescription } from '@/config/objects/types'

interface SectionDescriptionProps {
    model: Model
    section: DynamicDescription
}

const SectionDescription = ({ model, section }: SectionDescriptionProps) => {
    const { prefixSingular, singular } = model.defaults

    return (
        <>
            <div className="col-span-2">
                <Heading level="3" className="mb-3">
                    Omschrijving {singular}
                </Heading>
                <Text type="body">{section.description}</Text>
            </div>

            <div className="col-span-4 pt-[48px]">
                <FormikRte
                    name="Description"
                    label="Omschrijving"
                    placeholder={`Beschrijving van ${prefixSingular} ${singular}`}
                    description={section.fieldDescription}
                    required
                />
            </div>
        </>
    )
}

export default SectionDescription
