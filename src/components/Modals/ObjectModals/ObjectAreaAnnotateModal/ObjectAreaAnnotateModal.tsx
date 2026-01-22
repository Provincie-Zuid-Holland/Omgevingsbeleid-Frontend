import { Button, FormikInput, FormikSelect } from '@pzh-ui/components'
import { AngleDown } from '@pzh-ui/icons'
import { Form, Formik, FormikProps } from 'formik'
import { useMemo } from 'react'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { AREA_DATA_ATTRS } from '@/components/DynamicObject/DynamicObjectForm/DynamicField/extensions/area'
import DynamicObjectSearch from '@/components/DynamicObject/DynamicObjectSearch'
import Modal from '@/components/Modal'
import useModalStore from '@/store/modalStore'
import { SCHEMA_OBJECT_ANNOTATE_AREA } from '@/validation/objectAnnotate'

import { usePublicationValueListsGetAreaDesignation } from '@/api/fetchers'
import { ModalFooter } from '@/components/Modal/Modal'
import { ModalStateMap } from '../../types'

type Values = z.infer<typeof SCHEMA_OBJECT_ANNOTATE_AREA>

const ObjectAreaAnnotateModal = () => {
    const setActiveModal = useModalStore(state => state.setActiveModal)
    const modalState = useModalStore(
        state => state.modalStates['objectAreaAnnotate']
    ) as ModalStateMap['objectAreaAnnotate']

    const isEmptySelection = useMemo(
        () => modalState?.editor.state.selection.empty,
        [modalState?.editor.state.selection.empty]
    )

    const selectedText = useMemo(
        () =>
            modalState?.editor.state.doc.textBetween(
                modalState?.editor.state.selection.from,
                modalState?.editor.state.selection.to
            ),
        [
            modalState?.editor.state.selection.from,
            modalState?.editor.state.selection.to,
        ]
    )

    const initialValues: Values = useMemo(() => {
        const previousValues = modalState?.editor?.getAttributes('area')

        return {
            group: previousValues?.[AREA_DATA_ATTRS.group] ?? '',
            type: previousValues?.[AREA_DATA_ATTRS.type] ?? '',
            locations: previousValues?.[AREA_DATA_ATTRS.locations] ?? '',
            title: previousValues?.[AREA_DATA_ATTRS.title] ?? selectedText,
            context: previousValues?.[AREA_DATA_ATTRS.context] ?? '',
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
                [AREA_DATA_ATTRS.locations]: payload.locations,
                [AREA_DATA_ATTRS.title]: payload.title,
                [AREA_DATA_ATTRS.context]: payload.context,
                text: isEmptySelection ? payload.title : undefined,
            })
            .run()

        setActiveModal(null)
    }

    return (
        <Modal
            id="objectAreaAnnotate"
            title="Gebiedsaanwijzing"
            description="Een gebiedsaanwijzing wordt gebruikt als een annotatie waarmee nadere informatie kan worden toegevoegd aan een gebied dat is aangewezen door een juridische regel of een tekstdeel.">
            <Formik
                onSubmit={handleSubmit}
                initialValues={initialValues}
                enableReinitialize
                validationSchema={toFormikValidationSchema(
                    SCHEMA_OBJECT_ANNOTATE_AREA
                )}>
                {props => <InnerForm {...props} />}
            </Formik>
        </Modal>
    )
}

const InnerForm = <TData extends Values>({
    dirty,
    values,
    isSubmitting,
    isValid,
    setFieldValue,
}: FormikProps<TData>) => {
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

    const { data, isLoading } = usePublicationValueListsGetAreaDesignation()

    const typeOptions = useMemo(
        () =>
            data?.gebiedsaanwijzingen
                .filter(item => !item.aanwijzing_type.deprecated)
                .map(item => ({
                    label: item.aanwijzing_type.label,
                    value: item.aanwijzing_type.label,
                })),
        [data]
    )

    const groupOptions = useMemo(
        () =>
            !!values.type
                ? data?.gebiedsaanwijzingen
                      .find(item => item.aanwijzing_type.label === values.type)
                      ?.waardes.filter(item => !item.deprecated)
                      .map(item => ({
                          label: item.label,
                          value: item.label,
                      }))
                : undefined,
        [values.type, data]
    )

    // console.log(typeOptions)

    return (
        <Form>
            <div className="mb-4 flex flex-col gap-4">
                <div>
                    <FormikInput
                        name="title"
                        label="Titel"
                        placeholder='Bijv. "Bedrijventerrein"'
                    />
                </div>
                <div>
                    <FormikSelect
                        key={isLoading.toString()}
                        name="type"
                        label="Type"
                        placeholder="Selecteer een type"
                        description="Geef aan van welk type de gebiedsaanwijzing is"
                        options={typeOptions}
                        isLoading={isLoading}
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
                        key={isLoading.toString() || values.type}
                        name="group"
                        label="Groep"
                        placeholder="Selecteer een groep"
                        description="Geef aan in welke groep de gebiedsaanwijzing valt"
                        options={groupOptions}
                        disabled={!values.type}
                        isLoading={isLoading}
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
                    <DynamicObjectSearch
                        fieldName="locations"
                        filterType={['gebiedengroep', 'gebied']}
                        status="all"
                        label="Locaties"
                        isMulti
                        required
                        placeholder="Zoek op locaties"
                        description="Geef aan welke gebieden moeten worden geannoteerd"
                        objectKey="Werkingsgebied_Code"
                        onChange={val => {
                            const selected = Array.isArray(val)
                                ? val.map(item => ({
                                      label: !!item.object
                                          ? item.object?.Model.Title
                                          : item.label,
                                      value: item.value,
                                  }))
                                : {
                                      label: !!val?.object
                                          ? val?.object?.Model.Title
                                          : val?.label,
                                      value: val?.value,
                                  }

                            setFieldValue('context', JSON.stringify(selected))
                        }}
                        defaultValue={
                            !!values.context && JSON.parse(values.context)
                        }
                        components={{
                            DropdownIndicator: () => (
                                <div className="mr-2">
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
                    <FormikInput name="context" type="hidden" />
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
