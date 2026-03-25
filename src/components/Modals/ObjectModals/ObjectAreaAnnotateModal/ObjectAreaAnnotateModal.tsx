import { Button } from '@pzh-ui/components'
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
            code: previousValues?.[AREA_DATA_ATTRS.code] ?? '',
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalState?.editor, modalState?.editor?.state.selection])

    const handleSubmit = (payload: Values) => {
        modalState?.editor
            ?.chain()
            .focus()
            .extendMarkRange('area')
            .setArea({
                [AREA_DATA_ATTRS.code]: payload.code,
            })
            .run()

        setActiveModal(null)
    }

    return (
        <Modal
            id="objectAreaAnnotate"
            title="Gebiedsaanwijzing"
            description={
                <>
                    Een gebiedsaanwijzing wordt gebruikt als een annotatie
                    waarmee nadere informatie kan worden toegevoegd aan een
                    gebied dat is aangewezen door een juridische regel of een
                    tekstdeel. Mis je een gebiedsaanwijzing? Neem dan contact op
                    via{' '}
                    <a
                        href="mailto:omgevingsbeleid@pzh.nl"
                        className="text-pzh-green-500 hover:text-pzh-green-900 underline">
                        omgevingsbeleid@pzh.nl
                    </a>
                    .
                </>
            }>
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

    return (
        <Form>
            <div className="mb-4 flex flex-col gap-4">
                <DynamicObjectSearch
                    fieldName="code"
                    filterType={['gebiedsaanwijzing']}
                    filterOnModule
                    status="all"
                    label="Gebiedsaanwijzing"
                    required
                    placeholder="Selecteer een gebiedsaanwijzing"
                    objectKey="Object_Code"
                    blurInputOnSelect
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
