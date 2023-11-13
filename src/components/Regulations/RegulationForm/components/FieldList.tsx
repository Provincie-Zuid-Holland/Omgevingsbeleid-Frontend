import Draggable from '@/components/Draggable'
import * as contents from '@/config/regulations/contents'
import { list } from '@/config/regulations/contents'
import { Structure } from '@/config/regulations/types'
import useDrag from '@/hooks/useDrag'
import useRegulationStore from '@/store/regulationStore'
import { FormikInput, FormikSelect, PillButton, Text } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import { ArrayHelpers, FieldArray, useFormikContext } from 'formik'
import { v4 as uuidv4 } from 'uuid'
import FieldLabel from './FieldLabel'
import RegulationField from './RegulationField'
import { RegulationFieldProps } from './types'

const FieldList = ({
    name,
    label,
    index,
    parentIndex,
    ...props
}: RegulationFieldProps) => {
    const { values } = useFormikContext<Structure>()

    const { children } = list
    const { children: listChildren } = parentIndex
        ? values.contents?.[parentIndex].children?.[index] || {}
        : values.contents?.[index] || {}

    const setDraggingItem = useRegulationStore(state => state.setDraggingItem)

    const dragResult = useDrag({
        draggable: listChildren && listChildren.length > 1,
        onDragStart: setDraggingItem,
        onDragEnd: () => setDraggingItem(null),
    })

    const numberingOptions = [
        {
            label: 'Numeriek',
            value: 'numeral',
        },
        {
            label: 'Alfabetisch',
            value: 'alphabetical',
        },
        {
            label: 'Romeins',
            value: 'roman',
        },
    ]

    const content = parentIndex
        ? values.contents?.[parentIndex]?.children?.[index]
        : values.contents?.[index]
    if (!content || content.type !== 'list') return null

    const { numbering = 'numeral' } = content

    return (
        <div className="flex flex-col gap-2">
            <FieldLabel name={`${name}.children`} label={label} {...props} />

            <FieldArray
                name={`${name}.children`}
                render={(arrayHelpers: ArrayHelpers) => (
                    <>
                        <div className="flex gap-10">
                            <div className="flex items-center gap-2">
                                <Text
                                    as="label"
                                    htmlFor={`${name}.numbering`}
                                    bold>
                                    Nummering
                                </Text>
                                <div className="w-40">
                                    <FormikSelect
                                        name={`${name}.numbering`}
                                        options={numberingOptions}
                                        defaultValue={numberingOptions[0]}
                                    />
                                </div>
                            </div>
                            <div className="flex w-full items-center gap-2">
                                <Text
                                    as="label"
                                    htmlFor={`${name}.Lijstaanhef`}
                                    bold>
                                    Lijstaanhef
                                </Text>
                                <div className="w-full">
                                    <FormikInput name={`${name}.Lijstaanhef`} />
                                </div>
                            </div>
                        </div>
                        <ol className="flex flex-col gap-2 [counter-reset:list]">
                            {listChildren?.map((child, index) => (
                                <Draggable
                                    key={name + child.type + index}
                                    as="li"
                                    index={index}
                                    arrayHelpers={arrayHelpers}
                                    {...dragResult}>
                                    <RegulationField
                                        type={child.type}
                                        index={index}
                                        name={`${name}.children[${index}]`}
                                        handleRemove={() =>
                                            arrayHelpers.remove(index)
                                        }
                                        isDraggable={listChildren.length > 1}
                                        // @ts-ignore
                                        numbering={numbering}
                                        style={{
                                            viewTransitionName: `list-item-${child.uuid}`,
                                            zIndex:
                                                values.contents &&
                                                values.contents.length - index,
                                        }}
                                    />
                                </Draggable>
                            ))}
                        </ol>
                        <div className="flex items-center gap-4">
                            <Text as="span" size="s" color="text-pzh-blue">
                                Toevoegen aan deze lijst:
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
                        <div>
                            <Text
                                as="label"
                                bold
                                htmlFor={`${name}.Lijstsluiting`}>
                                Lijstsluiting
                            </Text>
                            <FormikInput name={`${name}.Lijstsluiting`} />
                        </div>
                    </>
                )}
            />
        </div>
    )
}

export default FieldList
