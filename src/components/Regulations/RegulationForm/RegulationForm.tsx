import {
    Button,
    Divider,
    FormikInput,
    Heading,
    PillButton,
} from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import {
    ArrayHelpers,
    FieldArray,
    Form,
    Formik,
    useFormikContext,
} from 'formik'
import { v4 as uuidv4 } from 'uuid'
import { useShallow } from 'zustand/react/shallow'

import DropArea from '@/components/DropArea'
import * as contents from '@/config/regulations/contents'
import { Section } from '@/config/regulations/sections/types'
import { Structure } from '@/config/regulations/types'
import useDrag from '@/hooks/useDrag'
import useModalStore from '@/store/modalStore'
import useRegulationStore from '@/store/regulationStore'
import equalArrays from '@/utils/equalArrays'
import handleViewTransition from '@/utils/handleViewTransition'

import { ModalFooter } from '@/components/Modal/Modal'
import RegulationField from './components/RegulationField'

interface RegulationFormProps {
    initialValues: Structure & { label?: string }
    handleFormSubmit: (payload: Structure) => void
    title: string
    section: Section
}

const RegulationForm = ({
    initialValues,
    handleFormSubmit,
    title,
    section,
}: RegulationFormProps) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            enableReinitialize>
            <Form>
                <div className="mb-6">
                    <Heading
                        level="3"
                        size="m"
                        color="text-pzh-blue-900"
                        className="mb-3">
                        {title}
                    </Heading>

                    <div className="flex gap-4">
                        <div className="w-40">
                            <FormikInput name="label" label="Label" disabled />
                        </div>
                        <div className="w-20">
                            <FormikInput name="index" label="Nummer" disabled />
                        </div>
                        <div className="flex-1">
                            <FormikInput name="title" label="Opschrift" />
                        </div>
                    </div>
                </div>

                {section.contents?.length && (
                    <>
                        <Divider className="bg-pzh-gray-600 my-6" />
                        <Heading level="3" size="m" color="text-pzh-blue-900">
                            Inhoud
                        </Heading>

                        <FormContents section={section} />
                    </>
                )}

                <ModalFooter className="mt-4">
                    <Button variant="link" onPress={() => setActiveModal(null)}>
                        Annuleren
                    </Button>
                    <Button variant="cta" type="submit">
                        Opslaan
                    </Button>
                </ModalFooter>
            </Form>
        </Formik>
    )
}

const FormContents = ({ section }: Pick<RegulationFormProps, 'section'>) => {
    const { values } = useFormikContext<Structure>()

    const { draggingItem, setDraggingItem } = useRegulationStore(
        useShallow(state => ({
            draggingItem: state.draggingItem,
            setDraggingItem: state.setDraggingItem,
        }))
    )

    const { dragProps, isDragging } = useDrag({
        draggable: values.contents && values.contents.length > 1,
        onDragStart: setDraggingItem,
        onDragEnd: () => setDraggingItem(null),
    })

    return (
        <FieldArray
            name="contents"
            render={(arrayHelpers: ArrayHelpers) => (
                <>
                    {values.contents?.map(({ type, uuid }, index) => {
                        const content = contents[type]

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
                                key={type + index}
                                className="border-pzh-gray-300 relative border-b py-6">
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
                                        className="-top-4 py-4 after:-mt-0.5"
                                    />
                                )}
                                <RegulationField
                                    type={type}
                                    index={index}
                                    name={`contents[${index}]`}
                                    label={content.name}
                                    handleRemove={() =>
                                        arrayHelpers.remove(index)
                                    }
                                    isDraggable={
                                        values.contents &&
                                        values.contents.length > 1
                                    }
                                    style={{
                                        viewTransitionName: `content-${uuid}`,
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
                                                    (currDragged || 0) > index
                                                        ? index + 1
                                                        : index
                                                )
                                            )
                                        }
                                        className="-bottom-4 py-4 after:-mt-0.5"
                                    />
                                )}
                            </div>
                        )
                    })}

                    <div className="mt-3 flex flex-wrap gap-2">
                        {section.contents?.map(type => {
                            const content = contents[type]

                            return (
                                <PillButton
                                    key={type}
                                    icon={Plus}
                                    onPress={() =>
                                        arrayHelpers.push({
                                            uuid: uuidv4(),
                                            type,
                                        })
                                    }>
                                    {content.name}
                                </PillButton>
                            )
                        })}
                    </div>
                </>
            )}
        />
    )
}

export default RegulationForm
