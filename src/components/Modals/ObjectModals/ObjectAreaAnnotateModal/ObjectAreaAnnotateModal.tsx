import { Button } from '@pzh-ui/components'
import { AngleDown } from '@pzh-ui/icons'
import { Form, Formik, FormikProps } from 'formik'
import { useMemo } from 'react'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { AREA_DATA_ATTRS } from '@/components/DynamicObject/DynamicObjectForm/DynamicField/extensions/area'
import DynamicObjectSearch from '@/components/DynamicObject/DynamicObjectSearch'
import Modal from '@/components/Modal'
import useModalStore from '@/store/modalStore'
import { SCHEMA_OBJECT_ANNOTATE_AREA } from '@/validation/objectAnnotate'

import { LoaderSpinner } from '@/components/Loader'
import { ModalFooter } from '@/components/Modal/Modal'
import useObject from '@/hooks/useObject'
import { ModalStateMap } from '../../types'

type Values = Record<string, any>

const ObjectAreaAnnotateModal = () => {
    const setActiveModal = useModalStore(state => state.setActiveModal)
    const modalState = useModalStore(
        state => state.modalStates['objectAreaAnnotate']
    ) as ModalStateMap['objectAreaAnnotate']

    const { data, isLoading } = useObject()

    const initialValues: Values = useMemo(() => {
        const previousValue = modalState?.editor?.getAttributes('area')

        if (Object.keys(previousValue ?? {}).length) {
            const code = previousValue?.[AREA_DATA_ATTRS.Object_Code]
            const item = data?.Gebiedsaanwijzingen_Statics?.find(
                item => item.Code === code
            )

            return {
                Object_Code: {
                    label:
                        item?.Cached_Title ??
                        previousValue?.[AREA_DATA_ATTRS.Cached_Title],
                    value: code,
                },
            }
        }

        return {
            Object_Code: null,
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalState?.editor, modalState?.editor?.state.selection])

    const handleSubmit = (payload: Values) => {
        modalState?.editor
            ?.chain()
            .focus()
            .extendMarkRange('area')
            .setArea({
                [AREA_DATA_ATTRS.Object_Code]: payload.Object_Code,
                [AREA_DATA_ATTRS.Cached_Title]: payload.Cached_Title,
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
            {!isLoading ? (
                <Formik
                    onSubmit={handleSubmit}
                    initialValues={initialValues}
                    enableReinitialize
                    validationSchema={toFormikValidationSchema(
                        SCHEMA_OBJECT_ANNOTATE_AREA
                    )}>
                    {props => <InnerForm {...props} />}
                </Formik>
            ) : (
                <LoaderSpinner />
            )}
        </Modal>
    )
}

const InnerForm = <TData extends Values>({
    dirty,
    isSubmitting,
    isValid,
    values,
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
                    filterType={['gebiedsaanwijzing']}
                    filterOnModule
                    status="all"
                    label="Gebiedsaanwijzing"
                    required
                    placeholder="Selecteer een gebiedsaanwijzing"
                    objectKey="Object_Code"
                    blurInputOnSelect
                    initialOptions={[values.Object_Code]}
                    defaultValue={values.Object_Code}
                    onChange={val => {
                        if (Array.isArray(val)) {
                            setFieldValue(
                                'Cached_Title',
                                val[0].object?.Model.Title ?? ''
                            )
                        } else {
                            setFieldValue(
                                'Cached_Title',
                                val?.object?.Model.Title ?? ''
                            )
                        }
                    }}
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
