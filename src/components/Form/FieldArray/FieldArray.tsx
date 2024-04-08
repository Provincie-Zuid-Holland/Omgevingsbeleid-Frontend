import { Button, ButtonProps, FieldLabel, Text } from '@pzh-ui/components'
import { Plus, Xmark } from '@pzh-ui/icons'
import {
    ArrayHelpers,
    FieldArray as FormikFieldArray,
    FormikValues,
    useFormikContext,
} from 'formik'
import { twMerge } from 'tailwind-merge'

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
    buttonOptions = {
        variant: 'primary',
        size: 'large',
    },
    itemClassName,
}: Omit<Extract<DynamicField, { type: 'array' }>, 'type'> & {
    model?: Model
    buttonLabel?: string
    buttonOptions?: ButtonProps
    itemClassName?: string
}) => {
    const { values } = useFormikContext<FormikValues>()
    const nestedProperties = name.split('.') // Split the nested property string
    let nestedValue = values // Initialize nestedValue with values object

    // Traverse through the nested properties
    for (const prop of nestedProperties) {
        nestedValue = nestedValue?.[prop] // Access nested property
    }

    const groupChildren = nestedValue as any[]

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
                        {Array.isArray(groupChildren) &&
                            (groupChildren as any[])?.map(
                                (child, childIndex) => (
                                    <div
                                        key={name + child.type + childIndex}
                                        className={twMerge(
                                            'flex flex-col gap-2 bg-pzh-gray-100 p-4',
                                            itemClassName
                                        )}>
                                        <div className="flex justify-between">
                                            {!!arrayLabel && (
                                                <Text bold>{arrayLabel}</Text>
                                            )}
                                            <Button
                                                variant="default"
                                                onPress={() =>
                                                    arrayHelpers.remove(
                                                        childIndex
                                                    )
                                                }>
                                                <Xmark
                                                    className="text-pzh-blue-900"
                                                    size={16}
                                                />
                                            </Button>
                                        </div>
                                        {fields.map(field => (
                                            <DynamicObjectField
                                                key={field.name + childIndex}
                                                model={model}
                                                isFirst
                                                {...field}
                                                name={`${name}.${childIndex}.${field.name}`}
                                            />
                                        ))}
                                    </div>
                                )
                            )}

                        <div className="mt-2">
                            <Button
                                icon={Plus}
                                {...buttonOptions}
                                onPress={() => arrayHelpers.push({})}>
                                {buttonLabel}
                            </Button>
                        </div>
                    </div>
                )}
            />
        </>
    )
}

export default FieldArray
