import { useObjectRelatedFilesPostObjectRelatedFilesUpload } from '@/api/fetchers'
import Modal from '@/components/Modal'
import { ModalFooter } from '@/components/Modal/Modal'
import { DynamicField } from '@/config/types'
import useObject from '@/hooks/useObject'
import useModalStore from '@/store/modalStore'
import { toastNotification } from '@/utils/toastNotification'
import { OBJECT_RELATED_FILE_ADD_SCHEMA } from '@/validation/objectRelatedFiles'
import {
    Button,
    FieldInput,
    FieldLabel,
    FormikCheckbox,
    FormikInput,
} from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik, useFormikContext } from 'formik'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

const ObjectRelatedFileAddModal = () => {
    const queryClient = useQueryClient()
    const { objectId } = useParams()
    const lineageId = Number(objectId)

    const { queryKey } = useObject()

    const setActiveModal = useModalStore(state => state.setActiveModal)
    const [fileName, setFileName] = useState<string | undefined>()

    const { mutateAsync, isPending, isError, reset } =
        useObjectRelatedFilesPostObjectRelatedFilesUpload({
            mutation: {
                onSuccess: () => {
                    queryClient
                        .invalidateQueries({ queryKey })
                        .finally(() => {
                            toastNotification('objectRelatedFileAdded')
                        })
                },
                onError: () => {},
            },
        })

    const initialValues = {
        title: '',
        uploaded_file: '',
        ignore_report: false,
    }

    const handleFormSubmit = (
        payload: typeof initialValues,
        resetForm?: () => void
    ) => {
        mutateAsync({
            lineageId,
            data: payload,
        }).then(() => {
            if (!!resetForm) {
                setFileName(undefined)
                resetForm()
            } else {
                onClose()
            }
        })
    }

    const onClose = () => {
        reset()
        setFileName(undefined)
        setActiveModal(null)
    }

    return (
        <Modal
            id="objectRelatedFileAdd"
            onClose={onClose}
            title="Gerelateerd bestand koppelen"
            description="Upload of kies een bestand om aan dit beleidsdoel te koppelen.">
            <Formik
                initialValues={initialValues}
                validationSchema={toFormikValidationSchema(
                    OBJECT_RELATED_FILE_ADD_SCHEMA
                )}
                onSubmit={() => {}}>
                {({ values, dirty, isValid, resetForm }) => (
                    <Form className="flex flex-col gap-2">
                        <div>
                            <FormikInput
                                name="title"
                                label="Titel van bestand"
                                placeholder='Bijv. "2025 Beleidsdoel titel"'
                                required
                            />
                        </div>
                        <div>
                            <FileField
                                name="uploaded_file"
                                label="Upload nieuw bestand"
                                description="Selecteer een PDF bestand om aan het beleidsdoel te koppelen. Max 20MB."
                                hasError={isError}
                                defaultValue={fileName}
                                setDefaultValue={setFileName}
                                required
                            />
                        </div>

                        <ModalFooter className="mt-4">
                            <Button
                                variant="link"
                                type="button"
                                onPress={onClose}
                                className="text-pzh-blue-500 mr-3">
                                Annuleren
                            </Button>
                            <div className="flex gap-4">
                                <Button
                                    isDisabled={
                                        !dirty ||
                                        !isValid ||
                                        (isPending && !isError)
                                    }
                                    isLoading={isPending && !isError}
                                    onPress={() =>
                                        handleFormSubmit(values, () =>
                                            resetForm()
                                        )
                                    }>
                                    Opslaan & Volgende
                                </Button>
                                <Button
                                    variant="cta"
                                    isDisabled={
                                        !dirty ||
                                        !isValid ||
                                        (isPending && !isError)
                                    }
                                    isLoading={isPending && !isError}
                                    onPress={() => handleFormSubmit(values)}>
                                    Koppelen
                                </Button>
                            </div>
                        </ModalFooter>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

const FileField = ({
    label,
    name,
    description,
    required,
    hasError,
    defaultValue,
    setDefaultValue,
}: Omit<DynamicField, 'type'> & {
    hasError?: boolean
    defaultValue?: string
    setDefaultValue: (defaultValue?: string) => void
}) => {
    const { setFieldValue } = useFormikContext()

    return (
        <>
            {label && (
                <FieldLabel
                    name={name}
                    label={label}
                    description={description}
                    required={required}
                />
            )}

            <div className="relative flex gap-2">
                <div className="flex-1">
                    <FieldInput
                        name={name}
                        defaultValue={defaultValue}
                        hasError={hasError}
                    />
                </div>
                <Button>Selecteer bestand</Button>
                <div className="absolute top-0 left-0 h-full w-full opacity-0">
                    <input
                        name={name}
                        className="h-full w-full cursor-pointer"
                        type="file"
                        accept="application/pdf"
                        onClick={e => {
                            e.currentTarget.value = ''
                        }}
                        onChange={e => {
                            if (e.currentTarget.files) {
                                setFieldValue(name, e.currentTarget.files[0])
                                setDefaultValue(e.currentTarget.files[0].name)
                            }
                        }}
                    />
                </div>
            </div>

            {hasError && (
                <div className="mt-2">
                    <FormikCheckbox name="ignore_report">
                        Ik ben mij ervan bewust dat het document een auteur
                        heeft, en ik verspreid hiermee geen naam of namen van
                        mij of mijn collega's.
                    </FormikCheckbox>
                </div>
            )}
        </>
    )
}

export default ObjectRelatedFileAddModal
