import {
    FormikInput,
    FormikSelect,
    FormikTextArea,
    Heading,
    Text,
} from '@pzh-ui/components'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'

import { useUsersGet } from '@/api/fetchers'
import { ModuleCreate } from '@/api/fetchers.schemas'
import { Role } from '@/context/AuthContext'

const FormBasicInfo = () => {
    const { values } = useFormikContext<ModuleCreate>()

    const { data: users, isFetching, isLoading } = useUsersGet({ limit: 500 })

    const allowedUserRoles: Role[] = [
        'Functioneel beheerder',
        'Behandelend Ambtenaar',
        'Ambtelijk opdrachtgever',
    ]

    /**
     * Format user options
     */
    const userOptions1 = useMemo(
        () =>
            users?.results
                .filter(user => allowedUserRoles.includes(user.Rol))
                .filter(user => user.UUID !== values.Module_Manager_2_UUID)
                .map(user => ({
                    label: user.Gebruikersnaam,
                    value: user.UUID,
                })),
        [users, values.Module_Manager_2_UUID]
    )

    const userOptions2 = useMemo(
        () =>
            users?.results
                .filter(user => allowedUserRoles.includes(user.Rol))
                .filter(user => user.UUID !== values.Module_Manager_1_UUID)
                .map(user => ({
                    label: user.Gebruikersnaam,
                    value: user.UUID,
                })),
        [users, values.Module_Manager_1_UUID]
    )

    return (
        <>
            <div className="col-span-6 sm:col-span-2">
                <Heading level="2" size="m" className="mb-3">
                    Algemene informatie
                </Heading>
                <Text>
                    De algemene informatie bevat een duidelijke titel en
                    moduletrekkers.
                </Text>
            </div>

            <div className="col-span-6 pt-[42px] sm:col-span-4">
                <FormikInput
                    name="Title"
                    label="Titel"
                    placeholder="Titel van de module"
                    required
                />
                <div className="mt-6 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
                    <div>
                        <FormikSelect
                            key={String(
                                userOptions1?.length +
                                    (values.Module_Manager_2_UUID || '')
                            )}
                            name="Module_Manager_1_UUID"
                            label="Moduletrekker 1"
                            placeholder="Selecteer een moduletrekker"
                            isLoading={isLoading && isFetching}
                            options={userOptions1}
                            noOptionsMessage={({ inputValue }) =>
                                !!inputValue && 'Geen resultaten gevonden'
                            }
                            blurInputOnSelect
                            required
                        />
                    </div>
                    <div className="mt-6 sm:mt-0">
                        <FormikSelect
                            key={String(
                                userOptions2?.length +
                                    values.Module_Manager_1_UUID
                            )}
                            name="Module_Manager_2_UUID"
                            label="Moduletrekker 2"
                            placeholder="Selecteer een moduletrekker"
                            isLoading={isLoading && isFetching}
                            options={userOptions2}
                            noOptionsMessage={({ inputValue }) =>
                                !!inputValue && 'Geen resultaten gevonden'
                            }
                            blurInputOnSelect
                            isClearable
                        />
                    </div>
                </div>
                <div className="mt-6">
                    <FormikTextArea
                        name="Description"
                        label="Omschrijving"
                        description="Geef een omschrijving van de module. Denk hierbij aan de aanpassingen die worden gedaan."
                        required
                    />
                </div>
            </div>
        </>
    )
}

export default FormBasicInfo
