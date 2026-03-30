import { Button, ButtonProps, FieldLabel, Text, cn } from '@pzh-ui/components'
import { Plus, Xmark } from '@pzh-ui/icons'
import {
    ArrayHelpers,
    FieldArray as FormikFieldArray,
    FormikValues,
    useFormikContext,
} from 'formik'

import DynamicObjectField from '@/components/DynamicObject/DynamicObjectForm/DynamicField'
import { Model } from '@/config/objects/types'
import { DynamicField } from '@/config/types'

const FieldArray = ({
    name,
    label,
    arrayLabel,
    description,
    required,
    fields,
    model,
    buttonLabel = 'Toevoegen',
    buttonOptions = { variant: 'primary', size: 'large' },
    itemClassName,
    startIndex = 0,
    disabled,
}: Omit<Extract<DynamicField, { type: 'array' }>, 'type'> & {
    model?: Model
    buttonLabel?: string
    buttonOptions?: ButtonProps
    itemClassName?: string
    startIndex?: number
    disabled?: boolean
}) => {
    const { values } = useFormikContext<FormikValues>()
    const nestedProperties = name.split('.')
    let nestedValue = values as any
    for (const prop of nestedProperties) nestedValue = nestedValue?.[prop]

    const list = Array.isArray(nestedValue) ? nestedValue : []
    const visibleItems = list.slice(startIndex)

    return (
        <>
            {label && (
                <FieldLabel
                    name={name}
                    label={label}
                    description={description}
                    required={required}
                />
            )}

            <FormikFieldArray
                name={name}
                render={(arrayHelpers: ArrayHelpers) => (
                    <div className="flex flex-col gap-2">
                        {visibleItems.map((child, idx) => {
                            const actualIndex = idx + startIndex
                            return (
                                <div
                                    key={`${name}-${actualIndex}`}
                                    className={cn(
                                        'bg-pzh-gray-100 flex flex-col gap-2 p-4',
                                        itemClassName
                                    )}>
                                    <div className="flex justify-between">
                                        {!!arrayLabel && (
                                            <Text bold>{arrayLabel}</Text>
                                        )}
                                        {!disabled && (
                                            <Button
                                                variant="default"
                                                onPress={() =>
                                                    arrayHelpers.remove(
                                                        actualIndex
                                                    )
                                                }>
                                                <Xmark
                                                    className="text-pzh-blue-900"
                                                    size={16}
                                                />
                                            </Button>
                                        )}
                                    </div>

                                    {fields.map(field => (
                                        <DynamicObjectField
                                            key={`${field.name}-${actualIndex}`}
                                            model={model}
                                            isFirst
                                            {...field}
                                            name={`${name}.${actualIndex}.${field.name}`}
                                        />
                                    ))}
                                </div>
                            )
                        })}

                        {!disabled && (
                            <div className="mt-2">
                                <Button
                                    icon={Plus}
                                    {...buttonOptions}
                                    onPress={() => arrayHelpers.push({})}>
                                    {buttonLabel}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            />
        </>
    )
}

export default FieldArray
