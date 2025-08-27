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
    defaultValues,
}: DynamicSectionProps & {
    isLast?: boolean
    isLocked?: boolean
    model: Model
    defaultValues?: {
        [key: string]: any
    }
}) => (
    <>
        <div className="col-span-6 md:col-span-2">
            <Heading
                level="2"
                size="s"
                className="mb-3"
                color="text-pzh-blue-500">
                {title}
            </Heading>

            {description && <Text>{description}</Text>}
        </div>

        <div className="col-span-6 md:col-span-4">
            {fields.map((field, index) => (
                <DynamicField
                    key={`field-${field.type}-${index}`}
                    isFirst={index === 0}
                    isLocked={isLocked}
                    model={model}
                    {...(field.type === 'search' && {
                        defaultValue: defaultValues?.[field.name],
                    })}
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
