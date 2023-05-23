import {
    FormikInput,
    FormikSelect,
    FormikTextArea,
    getHeadingStyles,
    Text,
} from '@pzh-ui/components'
import { useMemo } from 'react'

import { useUsersGet } from '@/api/fetchers'
import useBreakpoint from '@/hooks/useBreakpoint'

const FormBasicInfo = () => {
    const { isMobile } = useBreakpoint()

    const { data: users, isFetching, isLoading } = useUsersGet()

    const userOptions = useMemo(
        () =>
            users?.map(user => ({
                label: user.Gebruikersnaam,
                value: user.UUID,
            })),
        [users]
    )

    return (
        <>
            <div className="col-span-2">
                <h2 style={getHeadingStyles('3', isMobile)} className="mb-3">
                    Algemene informatie
                </h2>
                <Text type="body">
                    De algemene informatie bevat een duidelijke titel en
                    moduletrekkers.
                </Text>
            </div>

            <div className="col-span-4 pt-[48px]">
                <FormikInput
                    name="Title"
                    label="Titel"
                    placeholder="Titel van de module"
                    required
                />
                <div className="mt-6 grid grid-cols-2 gap-x-10">
                    <div>
                        <FormikSelect
                            name="Module_Manager_1_UUID"
                            label="Moduletrekker 1"
                            placeholder="Selecteer een moduletrekker"
                            isLoading={isLoading && isFetching}
                            optimized={false}
                            options={userOptions}
                            required
                        />
                    </div>
                    <div>
                        <FormikSelect
                            name="Module_Manager_2_UUID"
                            label="Moduletrekker 2"
                            placeholder="Selecteer een moduletrekker"
                            isLoading={isLoading && isFetching}
                            optimized={false}
                            options={userOptions}
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
