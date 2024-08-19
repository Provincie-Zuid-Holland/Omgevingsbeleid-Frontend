import { Button, FormikSelect } from '@pzh-ui/components'
import { Form, Formik } from 'formik'
import { useMemo } from 'react'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { AREA_DATA_ATTRS } from '@/components/DynamicObject/DynamicObjectForm/DynamicField/extensions/area'
import Modal from '@/components/Modal'
import useModalStore from '@/store/modalStore'
import { SCHEMA_OBJECT_ANNOTATE_AREA } from '@/validation/objectAnnotate'

import { ModalStateMap } from '../../types'

type Values = z.infer<typeof SCHEMA_OBJECT_ANNOTATE_AREA>

const ObjectAreaAnnotateModal = () => {
    const setActiveModal = useModalStore(state => state.setActiveModal)
    const modalState = useModalStore(
        state => state.modalStates['objectAreaAnnotate']
    ) as ModalStateMap['objectAreaAnnotate']

    const groupOptions = [
        {
            label: 'Gebiedengroep 1',
            value: 'group-1',
        },
    ]

    const areaTypeOptions = [{ label: 'Type 1', value: 'areaType-1' }]

    const areaGroupOptions = [
        {
            label: 'Gebiedsaanwijzinggroep 1',
            value: 'areaGroup-1',
        },
    ]

    const isEmptySelection = useMemo(
        () => modalState?.editor.state.selection.empty,
        [modalState?.editor.state.selection.empty]
    )

    const hasValues = useMemo(
        () => {
            const values = modalState?.editor?.getAttributes('area')

            return !!values && !!Object.keys(values).length
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [modalState?.editor, modalState?.editor?.state.selection]
    )

    const initialValues: Values = useMemo(() => {
        const previousValues = modalState?.editor?.getAttributes('area')

        return {
            group: previousValues?.[AREA_DATA_ATTRS.group] ?? '',
            type: previousValues?.[AREA_DATA_ATTRS.type] ?? '',
            location: previousValues?.[AREA_DATA_ATTRS.location] ?? '',
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalState?.editor, modalState?.editor?.state.selection])

    const handleSubmit = (payload: Values) => {
        const groupName = groupOptions.find(
            option => option.value === payload.group
        )?.label

        modalState?.editor
            ?.chain()
            .focus()
            .extendMarkRange('area')
            .setArea({
                [AREA_DATA_ATTRS.group]: payload.group,
                [AREA_DATA_ATTRS.type]: payload.type,
                [AREA_DATA_ATTRS.location]: payload.location,
                text: isEmptySelection ? groupName : undefined,
            })
            .run()

        setActiveModal(null)
    }

    return (
        <Modal
            id="objectAreaAnnotate"
            title="Gebiedsaanwijzing toevoegen"
            size="m">
            <Formik
                onSubmit={handleSubmit}
                initialValues={initialValues}
                enableReinitialize
                validationSchema={toFormikValidationSchema(
                    SCHEMA_OBJECT_ANNOTATE_AREA
                )}>
                {({ isValid, isSubmitting, dirty }) => (
                    <Form>
                        <div className="space-y-4">
                            <div>
                                <FormikSelect
                                    name="group"
                                    label="Gebiedengroep"
                                    placeholder="Selecteer een gebiedengroep"
                                    options={groupOptions}
                                    required
                                />
                            </div>
                            <div>
                                <FormikSelect
                                    name="type"
                                    label="Type gebiedsaanwijzing"
                                    placeholder="Selecteer een type gebiedsaanwijzing"
                                    options={areaTypeOptions}
                                    required
                                />
                            </div>
                            <div>
                                <FormikSelect
                                    name="location"
                                    label="Gebiedsaanwijzinggroep"
                                    placeholder="Selecteer een gebiedsaanwijzinggroep"
                                    options={areaGroupOptions}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            {!hasValues ? (
                                <Button
                                    variant="link"
                                    onPress={() => setActiveModal(null)}>
                                    Annuleren
                                </Button>
                            ) : (
                                <Button
                                    variant="link"
                                    onPress={() => {
                                        modalState?.editor
                                            ?.chain()
                                            .focus()
                                            .extendMarkRange('area')
                                            .unsetMark('area')
                                            .run()
                                        setActiveModal(null)
                                    }}
                                    className="text-pzh-red-500">
                                    Gebiedsaanwijzing verwijderen
                                </Button>
                            )}
                            <Button
                                variant="cta"
                                type="submit"
                                isDisabled={!isValid || isSubmitting || !dirty}
                                isLoading={isSubmitting}>
                                Opslaan
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default ObjectAreaAnnotateModal
