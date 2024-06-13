import { PillButton, Text } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import { ArrayHelpers, FieldArray, useFormikContext } from 'formik'
import { v4 as uuidv4 } from 'uuid'

import Draggable from '@/components/Draggable'
import * as contents from '@/config/regulations/contents'
import { group } from '@/config/regulations/contents'
import { Structure } from '@/config/regulations/types'
import useDrag from '@/hooks/useDrag'
import useRegulationStore from '@/store/regulationStore'

import FieldLabel from './FieldLabel'
import RegulationField from './RegulationField'
import { RegulationFieldProps } from './types'

const FieldGroup = ({ name, label, index, ...props }: RegulationFieldProps) => {
    const { values } = useFormikContext<Structure>()

    const { children } = group
    const groupChildren = values.contents?.[index].children

    const setDraggingItem = useRegulationStore(state => state.setDraggingItem)

    const dragResult = useDrag({
        draggable: groupChildren && groupChildren.length > 1,
        onDragStart: setDraggingItem,
        onDragEnd: () => setDraggingItem(null),
    })

    return (
        <div className="flex flex-col gap-2">
            <FieldLabel name={`${name}.children`} label={label} {...props} />

            <FieldArray
                name={`${name}.children`}
                render={(arrayHelpers: ArrayHelpers) => (
                    <div className="flex flex-col gap-2">
                        {groupChildren?.map((child, childIndex) => {
                            const content = contents[child.type]

                            return (
                                <Draggable
                                    key={name + child.type + childIndex}
                                    className="bg-pzh-gray-100 p-4"
                                    index={childIndex}
                                    arrayHelpers={arrayHelpers}
                                    {...dragResult}>
                                    <RegulationField
                                        type={child.type}
                                        label={content.name}
                                        index={childIndex}
                                        parentIndex={index}
                                        name={`${name}.children[${childIndex}]`}
                                        handleRemove={() =>
                                            arrayHelpers.remove(childIndex)
                                        }
                                        isGroup
                                        isDraggable={groupChildren.length > 1}
                                        style={{
                                            viewTransitionName: `content-${child.uuid}`,
                                            zIndex:
                                                values.contents &&
                                                values.contents.length -
                                                    childIndex,
                                        }}
                                    />
                                </Draggable>
                            )
                        })}

                        <div className="mt-2 flex items-center gap-4">
                            <Text as="span" size="s" color="text-pzh-blue-500">
                                Invoegen in deze groep:
                            </Text>
                            {children?.map(child => {
                                const content = contents[child.type]

                                return (
                                    <PillButton
                                        key={content.type}
                                        onPress={() =>
                                            arrayHelpers.push({
                                                uuid: uuidv4(),
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
