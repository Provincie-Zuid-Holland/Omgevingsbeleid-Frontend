import {
    useObjectRelatedFilesDeleteObjectRelatedFilesDelete,
    useObjectRelatedFilesPostObjectRelatedFilesUpload,
} from '@/api/fetchers'
import {
    HTTPValidationError,
    ObjectRelatedFileResponse,
} from '@/api/fetchers.schemas'
import Modal from '@/components/Modal'
import { ModalFooter } from '@/components/Modal/Modal'
import { Model } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import usePermissions from '@/hooks/usePermissions'
import useModalStore from '@/store/modalStore'
import { handleFileError } from '@/utils/handleError'
import { toastNotification } from '@/utils/toastNotification'
import { OBJECT_RELATED_FILE_ADD_SCHEMA } from '@/validation/objectRelatedFiles'
import { Button } from '@pzh-ui/components'
import { useUpdateEffect } from '@react-hookz/web'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Form, Formik, FormikHelpers, FormikProps } from 'formik'
import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { ObjectRelatedFilesModalActions } from '../types'
import { StepOne, StepThree, StepTwo } from './steps'

const steps = [StepOne, StepTwo, StepThree]

interface FormValues {
    title: string
    uploaded_file: string
    ignore_report: boolean
    consent: boolean
}

const initialValues: FormValues = {
    title: '',
    uploaded_file: '',
    ignore_report: false,
    consent: false,
}

interface ObjectRelatedFilesModalProps extends ObjectRelatedFilesModalActions {
    model: Model
}

const ObjectRelatedFilesModal = ({
    model,
    initialStep = 1,
}: ObjectRelatedFilesModalProps) => {
    const queryClient = useQueryClient()
    const { objectId } = useParams()
    const lineageId = Number(objectId)

    const { canCreateModule, canPatchObjectInModule } = usePermissions()
    const { isOwner, queryKey, data: objectData } = useObject()
    const userCanEdit = (canPatchObjectInModule && isOwner) || canCreateModule

    const activeModal = useModalStore(state => state.activeModal)
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [step, setStep] = useState(initialStep)
    const [selectedFile, setSelectedFile] =
        useState<ObjectRelatedFileResponse>()
    const [avgWarning, setAvgWarning] = useState(false)
    const formikRef = useRef<FormikProps<FormValues>>(null)

    /**
     * Keep step in sync when a new initialStep comes in while the modal
     * is already mounted (it's rendered unconditionally alongside its
     * trigger button, so mount-time state alone won't pick this up).
     */
    useUpdateEffect(() => setStep(initialStep), [initialStep])

    /**
     * Wait for the close animation to finish before resetting, mirroring
     * ObjectConnectionModal's handleClose/step-reset pattern.
     */
    useUpdateEffect(() => {
        setTimeout(() => {
            setStep(initialStep)
            setSelectedFile(undefined)
            setAvgWarning(false)
            formikRef.current?.resetForm()
        }, 300)
    }, [activeModal === 'objectRelatedFiles'])

    const handleClose = () => setActiveModal(null)

    const { mutateAsync: addFile, isPending: isAdding } =
        useObjectRelatedFilesPostObjectRelatedFilesUpload({
            mutation: {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey }).finally(() => {
                        toastNotification('objectRelatedFileAdded')
                    })
                },
                onError: () => {},
            },
        })

    const {
        mutate: removeFile,
        isPending: isDeleting,
        isError: isDeleteError,
    } = useObjectRelatedFilesDeleteObjectRelatedFilesDelete({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey }).finally(() => {
                    toastNotification('objectRelatedFileDeleted')
                    handleClose()
                })
            },
        },
    })

    const isAddStep = step === 2
    const isDeleteStep = step === 3
    const CurrentStep = steps[step - 1]

    const handleFormSubmit = async (
        payload: FormValues,
        helpers: FormikHelpers<FormValues>
    ) => {
        if (isAddStep) {
            try {
                await addFile({
                    lineageId,
                    data: {
                        title: payload.title,
                        uploaded_file: payload.uploaded_file,
                        ignore_report: payload.ignore_report,
                    },
                })
                handleClose()
            } catch (err) {
                const error = err as AxiosError<HTTPValidationError>

                if (!error.response) {
                    helpers.setSubmitting(false)
                    return
                }

                handleFileError<FormValues>(
                    error.response,
                    helpers,
                    'uploaded_file'
                )
                setAvgWarning(true)
            }
        } else if (isDeleteStep && selectedFile) {
            removeFile({
                lineageId,
                params: { related_file_uuid: selectedFile.UUID },
            })
        }
    }

    return (
        <Modal
            id="objectRelatedFiles"
            title="Gerelateerde bestanden"
            onClose={handleClose}
            hideTitle>
            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={
                    isAddStep
                        ? toFormikValidationSchema(
                              OBJECT_RELATED_FILE_ADD_SCHEMA
                          )
                        : undefined
                }
                onSubmit={handleFormSubmit}>
                {({ values, dirty, isValid, submitForm }) => (
                    <Form className={step !== 1 ? 'mt-4' : undefined}>
                        <CurrentStep
                            model={model}
                            objectData={objectData}
                            userCanEdit={userCanEdit}
                            selectedFile={selectedFile}
                            setStep={setStep}
                            setSelectedFile={setSelectedFile}
                            avgWarning={avgWarning}
                            setAvgWarning={setAvgWarning}
                        />

                        <ModalFooter className="mt-4">
                            {step === 1 ? (
                                <Button
                                    key="close"
                                    onPress={handleClose}
                                    className="ml-auto">
                                    Sluiten
                                </Button>
                            ) : (
                                <Button
                                    key="cancel"
                                    variant="link"
                                    type="button"
                                    onPress={handleClose}
                                    className="text-pzh-blue-500">
                                    Annuleren
                                </Button>
                            )}

                            {step !== 1 && (
                                <div className="flex items-center">
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onPress={() => setStep(1)}
                                        className="mr-3">
                                        Vorige stap
                                    </Button>
                                    <Button
                                        variant="cta"
                                        isDisabled={
                                            isAddStep
                                                ? !dirty || !isValid || isAdding
                                                : !values.consent ||
                                                  (isDeleting && !isDeleteError)
                                        }
                                        isLoading={
                                            isAddStep
                                                ? isAdding
                                                : isDeleting && !isDeleteError
                                        }
                                        onPress={submitForm}>
                                        {isAddStep ? 'Koppelen' : 'Verwijderen'}
                                    </Button>
                                </div>
                            )}
                        </ModalFooter>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default ObjectRelatedFilesModal
