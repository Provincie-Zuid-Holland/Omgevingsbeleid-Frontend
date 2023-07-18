import { Divider, Heading, Text } from '@pzh-ui/components'

import { Model } from '@/config/objects/types'
import { DynamicSection as DynamicSectionProps } from '@/config/types'

import DynamicField from '../DynamicField'

const DynamicSection = ({
    title,
    description,
    fields,
    isLast,
    isLocked,
    model,
}: DynamicSectionProps & {
    isLast?: boolean
    isLocked?: boolean
    model: Model
}) => (
    <>
        <div className="col-span-2">
            <Heading as="2" level="3" className="mb-3">
                {title}
            </Heading>

            {description && <Text type="body">{description}</Text>}
        </div>

        <div className="col-span-4 pt-[48px]">
            {fields.map((field, index) => (
                <DynamicField
                    key={`field-${field.type}-${index}`}
                    isFirst={index === 0}
                    isLocked={isLocked}
                    model={model}
                    {...field}
                />
            ))}
        </div>

        {!isLast && (
            <div className="col-span-6">
                <Divider className="my-8" />
            </div>
        )}
    </>
)

export default DynamicSection
