import { Button, FormikInput, FormikSelect } from '@pzh-ui/components'
import { AngleDown } from '@pzh-ui/icons'
import { Form, Formik, FormikProps } from 'formik'
import { useMemo } from 'react'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import {
    usePublicationValueListsGetAreaDesignationGroups,
    usePublicationValueListsGetAreaDesignationTypes,
} from '@/api/fetchers'
import { AREA_DATA_ATTRS } from '@/components/DynamicObject/DynamicObjectForm/DynamicField/extensions/area'
import DynamicObjectSearch from '@/components/DynamicObject/DynamicObjectSearch'
import Modal from '@/components/Modal'
import { Model } from '@/config/objects/types'
import useModalStore from '@/store/modalStore'
import { SCHEMA_OBJECT_ANNOTATE_AREA } from '@/validation/objectAnnotate'

import { ModalFooter } from '@/components/Modal/Modal'
import { ModalStateMap } from '../../types'

type Values = z.infer<typeof SCHEMA_OBJECT_ANNOTATE_AREA>

interface ObjectAreaAnnotateModalProps {
    model: Model
}

const ObjectAreaAnnotateModal = ({ model }: ObjectAreaAnnotateModalProps) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)
    const modalState = useModalStore(
        state => state.modalStates['objectAreaAnnotate']
    ) as ModalStateMap['objectAreaAnnotate']

    const isEmptySelection = useMemo(
        () => modalState?.editor.state.selection.empty,
        [modalState?.editor.state.selection.empty]
    )

    const initialValues: Values = useMemo(() => {
        const previousValues = modalState?.editor?.getAttributes('area')

        return {
            group: previousValues?.[AREA_DATA_ATTRS.group] ?? '',
            type: previousValues?.[AREA_DATA_ATTRS.type] ?? '',
            location: previousValues?.[AREA_DATA_ATTRS.location] ?? '',
            label: previousValues?.[AREA_DATA_ATTRS.label] ?? '',
            id: previousValues?.[AREA_DATA_ATTRS.id] ?? '',
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalState?.editor, modalState?.editor?.state.selection])

    const handleSubmit = (payload: Values) => {
        modalState?.editor
            ?.chain()
            .focus()
            .extendMarkRange('area')
            .setArea({
                [AREA_DATA_ATTRS.group]: payload.group,
                [AREA_DATA_ATTRS.type]: payload.type,
                [AREA_DATA_ATTRS.location]: payload.location,
                [AREA_DATA_ATTRS.label]: payload.label,
                [AREA_DATA_ATTRS.id]: payload.id,
                text: isEmptySelection ? payload.label : undefined,
            })
            .run()

        setActiveModal(null)
    }

    return (
        <Modal id="objectAreaAnnotate" title="Gebiedsaanwijzing toevoegen">
            <Formik
                onSubmit={handleSubmit}
                initialValues={initialValues}
                enableReinitialize
                validationSchema={toFormikValidationSchema(
                    SCHEMA_OBJECT_ANNOTATE_AREA
                )}>
                {props => <InnerForm model={model} {...props} />}
            </Formik>
        </Modal>
    )
}

const InnerForm = <TData extends Values>({
    model,
    dirty,
    values,
    isSubmitting,
    isValid,
    setFieldValue,
    setFieldTouched,
}: ObjectAreaAnnotateModalProps & FormikProps<TData>) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)
    const modalState = useModalStore(
        state => state.modalStates['objectAreaAnnotate']
    ) as ModalStateMap['objectAreaAnnotate']

    const hasValues = useMemo(
        () => {
            const values = modalState?.editor?.getAttributes('area')

            return !!values && !!Object.keys(values).length
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [modalState?.editor, modalState?.editor?.state.selection]
    )

    const {
        data: areaTypeOptions,
        isFetching: areaTypesFetching,
        queryKey: areaTypeQueryKey,
    } = usePublicationValueListsGetAreaDesignationTypes(
        {
            values:
                model.defaults.parentType === 'Visie'
                    ? 'omgevingsvisie'
                    : 'programma',
        },
        {
            query: {
                select: data =>
                    data.Allowed_Values.map(value => ({
                        label: value,
                        value,
                    })),
            },
        }
    )

    const {
        data: areaGroupOptions,
        isFetching: areaGroupsFetching,
        queryKey: areaGroupQueryKey,
    } = usePublicationValueListsGetAreaDesignationGroups(
        {
            type: values.type,
        },
        {
            query: {
                enabled: !!values.type,
                select: data =>
                    data.Allowed_Values.map(value => ({
                        label: value,
                        value,
                    })),
            },
        }
    )

    return (
        <Form>
            <div className="mb-4 flex flex-col gap-4">
                <div>
                    <DynamicObjectSearch
                        fieldName="location"
                        filterType={['werkingsgebied']}
                        status="all"
                        label="Gebiedengroep"
                        required
                        placeholder="Zoek op gebiedengroep"
                        objectKey="Werkingsgebied_Code"
                        onChange={val => {
                            const selected = Array.isArray(val) ? val[0] : val
                            setFieldValue(
                                'label',
                                selected?.object?.Title ?? ''
                            )
                            setFieldValue(
                                'id',
                                selected?.object?.Object_ID?.toString() ?? ''
                            )
                        }}
                        defaultValue={
                            values.label &&
                            values.location && {
                                label: values.label,
                                value: values.location,
                            }
                        }
                        components={{
                            DropdownIndicator: () => (
                                <div className="mr-4">
                                    <AngleDown className="text-pzh-blue-900" />
                                </div>
                            ),
                        }}
                        styles={{
                            menu: base => ({
                                ...base,
                                position: 'relative',
                                zIndex: 9999,
                                marginTop: 4,
                                boxShadow: 'none',
                            }),
                        }}
                    />
                    <FormikInput name="label" type="hidden" />
                    <FormikInput name="id" type="hidden" />
                </div>
                <div>
                    <FormikSelect
                        key={JSON.stringify(
                            areaTypeQueryKey + String(areaTypesFetching)
                        )}
                        name="type"
                        label="Type gebiedsaanwijzing"
                        placeholder="Selecteer een type gebiedsaanwijzing"
                        options={areaTypeOptions}
                        isLoading={areaTypesFetching}
                        required
                        onChange={() => {
                            setFieldValue('group', null)
                            setFieldTouched('group', false)
                        }}
                        styles={{
                            menu: base => ({
                                ...base,
                                position: 'relative',
                                zIndex: 9999,
                                marginTop: 4,
                                boxShadow: 'none',
                            }),
                        }}
                    />
                </div>
                <div>
                    <FormikSelect
                        key={JSON.stringify(
                            areaGroupQueryKey + String(areaGroupsFetching)
                        )}
                        name="group"
                        label="Gebiedsaanwijzinggroep"
                        placeholder="Selecteer een gebiedsaanwijzinggroep"
                        options={areaGroupOptions}
                        isLoading={areaGroupsFetching}
                        disabled={!values.type}
                        required
                        styles={{
                            menu: base => ({
                                ...base,
                                position: 'relative',
                                zIndex: 9999,
                                marginTop: 4,
                                boxShadow: 'none',
                            }),
                        }}
                    />
                </div>
            </div>

            <ModalFooter>
                {!hasValues ? (
                    <Button variant="link" onPress={() => setActiveModal(null)}>
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
            </ModalFooter>
        </Form>
    )
}

export default ObjectAreaAnnotateModal
