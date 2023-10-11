import { Form, Formik } from 'formik'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { Button, FormikSelect } from '@pzh-ui/components'

import { useUsersGet } from '@/api/fetchers'
import Modal from '@/components/Modal'
import { ModelPatchStaticType } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import useModalStore from '@/store/modalStore'

import { ObjectPersonModalActions } from '../types'

const ObjectPersonModal = ({ person, isEdit }: ObjectPersonModalActions) => {
    const { objectId } = useParams()

    const activeModal = useModalStore(state => state.activeModal)
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const {
        data: users,
        isFetching,
        isLoading: loadingUsers,
    } = useUsersGet(
        { limit: 500 },
        { query: { enabled: activeModal === 'objectPerson' } }
    )

    /**
     * Format user options
     */
    const userOptions = useMemo(
        () =>
            users?.results
                ?.filter(user => user.UUID !== person?.filter)
                ?.filter(user => person?.filterRoles?.includes(user.Rol))
                ?.map(user => ({
                    label: user.Gebruikersnaam,
                    value: user.UUID,
                })),
        [users, person?.filter, person?.filterRoles]
    )

    const { usePostObjectStatic } = useObject()
    const { mutate, isLoading } = usePostObjectStatic(() =>
        setActiveModal(null)
    )

    /**
     * Update person
     */
    const handleFormSubmit = (payload: ModelPatchStaticType) => {
        mutate({ lineageId: parseInt(objectId!), data: payload })
    }

    return (
        <Modal
            id="objectPerson"
            title={`${person?.label} ${isEdit ? 'wijzigen' : 'toevoegen'}`}>
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={{}}
                enableReinitialize>
                <Form>
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
                        <Button
                            variant="link"
                            onPress={() => setActiveModal(null)}>
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
