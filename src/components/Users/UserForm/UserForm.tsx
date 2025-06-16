import { Button, FormikInput, FormikSelect } from '@pzh-ui/components'
import { Form, Formik, FormikConfig } from 'formik'
import { useMemo } from 'react'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { UserCreate } from '@/api/fetchers.schemas'
import { availableRoleTypes } from '@/context/AuthContext'
import { SCHEMA_ADD_USER } from '@/validation/user'

export interface UserFormProps extends FormikConfig<UserCreate> {
    submitText?: string
    handleClose: () => void
}

const UserForm = ({
    submitText = 'Opslaan',
    handleClose,
    ...rest
}: UserFormProps) => {
    const roleOptions = useMemo(
        () => availableRoleTypes.map(role => ({ label: role, value: role })),
        []
    )

    return (
        <Formik
            {...rest}
            validationSchema={toFormikValidationSchema(SCHEMA_ADD_USER)}
            enableReinitialize>
            {({ isValid, isSubmitting, dirty }) => (
                <Form className="grid gap-6">
                    <div>
                        <FormikInput
                            name="Gebruikersnaam"
                            label="Naam"
                            placeholder="Voor- en achternaam van de gebruiker"
                        />
                    </div>
                    <div>
                        <FormikInput
                            name="Email"
                            label="E-mailadres"
                            placeholder="Vul een geldig e-mailadres in"
                        />
                    </div>
                    <div>
                        <FormikSelect
                            name="Rol"
                            label="Rol"
                            placeholder="Kies een rol"
                            options={roleOptions}
                            noOptionsMessage={({ inputValue }) =>
                                !!inputValue && 'Geen resultaten gevonden'
                            }
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

                    <div className="border-pzh-gray-200 flex items-center justify-between border-t pt-6">
                        <Button variant="link" onPress={handleClose}>
                            Annuleren
                        </Button>

                        <div className="ml-auto">
                            <Button
                                type="submit"
                                variant="cta"
                                isDisabled={!isValid || isSubmitting || !dirty}
                                isLoading={isSubmitting}>
                                {submitText}
                            </Button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default UserForm
