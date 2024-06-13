import { Button, FormikSelect } from '@pzh-ui/components'
import { Form, Formik } from 'formik'
import { useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { useUsersGet } from '@/api/fetchers'
import Modal from '@/components/Modal'
import { Model, ModelPatchStaticType } from '@/config/objects/types'
import { Role } from '@/context/AuthContext'
import useObject from '@/hooks/useObject'
import useModalStore from '@/store/modalStore'
import {
    getStaticDataFilterRoles,
    getStaticDataLabel,
    getStaticDataPropertyKey,
    getStaticDataPropertyRequired,
} from '@/utils/dynamicObject'
import { SCHEMA_GENERAL_INFORMATION } from '@/validation/objectGeneralInformation'

interface ObjectPersonModalProps {
    model: Model
}

const ObjectPersonModal = ({ model }: ObjectPersonModalProps) => {
    const { objectId } = useParams()

    const activeModal = useModalStore(state => state.activeModal)
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { staticData } = model

    const { data: object } = useObject()
    const data = useMemo(() => object?.ObjectStatics, [object?.ObjectStatics])

    const {
        data: users,
        isFetching,
        isLoading: loadingUsers,
    } = useUsersGet(
        { limit: 500 },
        { query: { enabled: activeModal === 'objectGeneralInformation' } }
    )

    /**
     * Format user options
     */
    const getUserOptions = useCallback(
        (filterRoles?: Role[]) =>
            users?.results
                ?.filter(user => filterRoles?.includes(user.Rol))
                ?.map(user => ({
                    label: user.Gebruikersnaam,
                    value: user.UUID,
                })),
        [users]
    )

    const { usePostObjectStatic } = useObject()
    const { mutate } = usePostObjectStatic(() => setActiveModal(null))

    /**
     * Update person
     */
    const handleFormSubmit = (payload: ModelPatchStaticType) => {
        mutate({ lineageId: parseInt(objectId!), data: payload })
    }

    if (!!!staticData?.length) return null

    const initialValues = staticData.reduce(
        (acc: ModelPatchStaticType, item) => {
            const key = getStaticDataPropertyKey(item)
            const user = data?.[key]

            acc[item] = user?.UUID

            return acc
        },
        {}
    )

    return (
        <Modal id="objectGeneralInformation" title="Algemene informatie">
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={toFormikValidationSchema(
                    SCHEMA_GENERAL_INFORMATION
                )}
                validateOnChange
                enableReinitialize>
                {({ isValid, isSubmitting }) => (
                    <Form>
                        <div className="space-y-4">
                            {staticData.map(item => {
                                const label = getStaticDataLabel(item)
                                const required =
                                    getStaticDataPropertyRequired(item)
                                const filterRoles =
                                    getStaticDataFilterRoles(item)

                                const userOptions = getUserOptions(filterRoles)

                                return (
                                    <div key={item}>
                                        <FormikSelect
                                            name={item}
                                            label={label}
                                            placeholder={`Kies een ${label.toLowerCase()}`}
                                            isLoading={
                                                loadingUsers && isFetching
                                            }
                                            optimized={false}
                                            options={userOptions}
                                            styles={{
                                                menu: base => ({
                                                    ...base,
                                                    position: 'relative',
                                                    zIndex: 9999,
                                                    marginTop: 2,
                                                    boxShadow:
                                                        '0px 10px 30px rgba(0, 0, 0, 0.10)',
                                                }),
                                            }}
                                            noOptionsMessage={({
                                                inputValue,
                                            }) =>
                                                !!inputValue &&
                                                'Geen resultaten gevonden'
                                            }
                                            isClearable={!required}
                                            required={required}
                                            blurInputOnSelect
                                        />
                                    </div>
                                )
                            })}
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <Button
                                variant="link"
                                onPress={() => setActiveModal(null)}>
                                Annuleren
                            </Button>
                            <Button
                                variant="cta"
                                type="submit"
                                isDisabled={!isValid || isSubmitting}
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

export default ObjectPersonModal
