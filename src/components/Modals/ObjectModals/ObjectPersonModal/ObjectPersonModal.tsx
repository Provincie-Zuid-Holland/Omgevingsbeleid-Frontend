import {
    Button,
    FormikSelect,
    Heading,
    OLDModal as Modal,
} from '@pzh-ui/components'
import { Form, Formik } from 'formik'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { useUsersGet } from '@/api/fetchers'
import { ModelPatchStaticType } from '@/config/objects/types'
import useObject from '@/hooks/useObject'

import { ObjectPersonModalActions } from '../types'

interface ObjectPersonModalProps extends ObjectPersonModalActions {
    onClose: () => void
}

const ObjectPersonModal = ({
    isOpen,
    onClose,
    person,
    isEdit,
}: ObjectPersonModalProps) => {
    const { objectId } = useParams()

    const {
        data: users,
        isFetching,
        isLoading: loadingUsers,
    } = useUsersGet({ limit: 500 }, { query: { enabled: isOpen } })

    /**
     * Format user options
     */
    const userOptions = useMemo(
        () =>
            users?.results
                ?.filter(user => user.UUID !== person?.filter)
                ?.map(user => ({
                    label: user.Gebruikersnaam,
                    value: user.UUID,
                })),
        [users, person?.filter]
    )

    const { usePostObjectStatic } = useObject()
    const { mutate, isLoading } = usePostObjectStatic(onClose)

    /**
     * Update person
     */
    const handleFormSubmit = (payload: ModelPatchStaticType) => {
        mutate({ lineageId: parseInt(objectId!), data: payload })
    }

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            ariaLabel={`${person?.label} ${isEdit ? 'wijzigen' : 'toevoegen'}`}
            maxWidth="sm:max-w-[812px]">
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={{}}
                enableReinitialize>
                <Form>
                    <Heading level="2" className="mb-4 first-letter:uppercase">
                        {person?.label} {isEdit ? 'wijzigen' : 'toevoegen'}
                    </Heading>

                    <FormikSelect
                        name={person?.key || ''}
                        label={person?.label}
                        placeholder={`Kies een ${person?.label.toLowerCase()}`}
                        isLoading={loadingUsers && isFetching}
                        optimized={false}
                        options={userOptions}
                        defaultValue={
                            person?.value && {
                                label: person?.value?.Gebruikersnaam,
                                value: person?.value?.UUID,
                            }
                        }
                        styles={{
                            menu: base => ({
                                ...base,
                                position: 'relative',
                                zIndex: 9999,
                                marginTop: 2,
                                boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.10)',
                            }),
                        }}
                        isClearable={!person?.required}
                        required={person?.required}
                        blurInputOnSelect
                    />

                    <div className="mt-6 flex items-center justify-between">
                        <Button variant="link" onPress={onClose}>
                            Annuleren
                        </Button>
                        <Button
                            variant="cta"
                            type="submit"
                            isDisabled={isLoading}
                            isLoading={isLoading}>
                            Opslaan
                        </Button>
                    </div>
                </Form>
            </Formik>
        </Modal>
    )
}

export default ObjectPersonModal
