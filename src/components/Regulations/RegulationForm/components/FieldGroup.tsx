import * as contents from '@/config/regulations/contents'
import { group } from '@/config/regulations/contents'
import { Structure } from '@/config/regulations/types'
import { PillButton } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import { ArrayHelpers, FieldArray, useFormikContext } from 'formik'
import FieldLabel from './FieldLabel'
import RegulationField from './RegulationField'
import { RegulationFieldProps } from './types'

const FieldGroup = ({ name, label, index, ...props }: RegulationFieldProps) => {
    const { values } = useFormikContext<Structure>()

    const { children } = group
    const groupChildren = values.contents?.[index].children

    return (
        <div className="flex flex-col gap-2">
            <FieldLabel name={`${name}.children`} label={label} {...props} />

            <FieldArray
                name={`${name}.children`}
                render={(arrayHelpers: ArrayHelpers) => (
                    <div className="flex flex-col gap-2">
                        {groupChildren?.map((child, index) => {
                            const content = contents[child.type]

                            return (
                                <div className="bg-pzh-gray-100 p-4">
                                    <RegulationField
                                        key={name + child.type + index}
                                        type={child.type}
                                        label={content.name}
                                        index={index}
                                        name={`${name}.children[${index}]`}
                                        handleRemove={() =>
                                            arrayHelpers.remove(index)
                                        }
                                        isGroup
                                    />
                                </div>
                            )
                        })}

                        <div className="mt-2 flex items-center gap-4">
                            <span className="text-s text-pzh-blue">
                                Invoegen in deze groep:
                            </span>
                            {children?.map(child => {
                                const content = contents[child.type]

                                return (
                                    <PillButton
                                        key={content.type}
                                        onPress={() =>
                                            arrayHelpers.push({
                                                type: child.type,
                                            })
                                        }
                                        icon={Plus}>
                                        {content.name}
                                    </PillButton>
                                )
                            })}
                        </div>
                    </div>
                )}
            />
        </div>
    )
}

export default FieldGroup
