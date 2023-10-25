import DropArea from '@/components/DropArea'
import * as contents from '@/config/regulations/contents'
import { group } from '@/config/regulations/contents'
import { Structure } from '@/config/regulations/types'
import useDrag from '@/hooks/useDrag'
import useRegulationStore from '@/store/regulationStore'
import equalArrays from '@/utils/equalArrays'
import handleViewTransition from '@/utils/handleViewTransition'
import { PillButton } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import { ArrayHelpers, FieldArray, useFormikContext } from 'formik'
import { v4 as uuidv4 } from 'uuid'
import FieldLabel from './FieldLabel'
import RegulationField from './RegulationField'
import { RegulationFieldProps } from './types'

const FieldGroup = ({ name, label, index, ...props }: RegulationFieldProps) => {
    const { values } = useFormikContext<Structure>()

    const { children } = group
    const groupChildren = values.contents?.[index].children

    const draggingItem = useRegulationStore(state => state.draggingItem)
    const setDraggingItem = useRegulationStore(state => state.setDraggingItem)

    const { dragProps, isDragging } = useDrag({
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
                        {groupChildren?.map((child, index) => {
                            const content = contents[child.type]

                            const currDragged =
                                draggingItem &&
                                draggingItem[draggingItem.length - 1]
                            const isDraggingAndValid =
                                isDragging &&
                                draggingItem &&
                                !equalArrays(draggingItem, [index])

                            const showTopDropArea =
                                isDraggingAndValid && index === 0
                            const showBottomDropArea =
                                isDraggingAndValid && currDragged !== index + 1

                            return (
                                <div
                                    key={name + index}
                                    className="relative bg-pzh-gray-100 p-4">
                                    {showTopDropArea && draggingItem && (
                                        <DropArea
                                            position="top"
                                            onDrop={() =>
                                                handleViewTransition(() =>
                                                    arrayHelpers.move(
                                                        draggingItem[0],
                                                        index
                                                    )
                                                )
                                            }
                                            className="-top-5 py-4 after:-mt-0.5"
                                        />
                                    )}
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
                                        isDraggable={groupChildren.length > 1}
                                        style={{
                                            viewTransitionName: `content-${child.uuid}`,
                                            zIndex:
                                                values.contents &&
                                                values.contents.length - index,
                                        }}
                                        dragOptions={{ ...dragProps([index]) }}
                                    />
                                    {showBottomDropArea && draggingItem && (
                                        <DropArea
                                            position="bottom"
                                            onDrop={() =>
                                                handleViewTransition(() =>
                                                    arrayHelpers.move(
                                                        draggingItem[0],
                                                        (currDragged || 0) >
                                                            index
                                                            ? index + 1
                                                            : index
                                                    )
                                                )
                                            }
                                            className="-bottom-5 py-4 after:-mt-0.5"
                                        />
                                    )}
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
