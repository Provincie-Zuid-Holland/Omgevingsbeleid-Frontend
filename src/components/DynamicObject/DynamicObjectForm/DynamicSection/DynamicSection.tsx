import { Divider, Text } from '@pzh-ui/components'

import { Model } from '@/config/objects/types'
import { DynamicSection as DynamicSectionProps } from '@/config/types'

import { Notification } from '@pzh-ui/react'
import DynamicField from '../DynamicField'

const DynamicSection = ({
    description,
    notification,
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
        <div className="col-span-6">
            {description && <Text className="mb-4">{description}</Text>}

            {notification && (
                <Notification
                    className="prose prose-neutral text-pzh-blue-900 marker:text-pzh-blue-900 prose-li:my-0 prose-ul:mt-0 prose-p:my-0 prose-ul:pl-5 w-full max-w-full whitespace-pre-line marker:text-xs"
                    {...notification}
                />
            )}

            {description && <Divider className="my-8" />}

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
