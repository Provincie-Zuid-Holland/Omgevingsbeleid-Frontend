import {
    FormikInput,
    FormikSelect,
    getHeadingStyles,
    Text,
} from '@pzh-ui/components'
import { useMemo } from 'react'
import { useMedia } from 'react-use'

import { useUsersGet } from '@/api/fetchers'
import { Model } from '@/config/objects/types'

interface SectionBasicInfoProps {
    model: Model
}

const SectionBasicInfo = ({ model }: SectionBasicInfoProps) => {
    const isMobile = useMedia('(max-width: 640px)')

    const { prefixSingular, singular } = model.defaults

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
                    description={`Formuleer in enkele woorden de titel van ${prefixSingular} ${singular}.`}
                    required
                />
                <div className="mt-6 grid grid-cols-2 gap-x-10">
                    <div>
                        <FormikSelect
                            name="Module_Manager_1_UUID"
                            label="Ambtelijk opdrachtgever"
                            placeholder="Selecteer ambtelijk opdrachtgever"
                            isLoading={isLoading && isFetching}
                            optimized={false}
                            options={userOptions}
                            required
                        />
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-x-10">
                    <div>
                        <FormikSelect
                            name="Owner_1_UUID"
                            label="Eerste eigenaar"
                            placeholder="Selecteer eerste eigenaar"
                            isLoading={isLoading && isFetching}
                            optimized={false}
                            options={userOptions}
                        />
                    </div>
                    <div>
                        <FormikSelect
                            name="Owner_2_UUID"
                            label="Tweede eigenaar"
                            placeholder="Selecteer tweede eigenaar"
                            isLoading={isLoading && isFetching}
                            optimized={false}
                            options={userOptions}
                        />
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-x-10">
                    <div>
                        <FormikSelect
                            name="Module_Manager_2_UUID"
                            label="Eerste portefeuillehouder"
                            placeholder="Selecteer eerste portefeuillehouder"
                            isLoading={isLoading && isFetching}
                            optimized={false}
                            options={userOptions}
                        />
                    </div>
                    <div>
                        <FormikSelect
                            name="Module_Manager_2_UUID"
                            label="Tweede portefeuillehouder"
                            placeholder="Selecteer tweede portefeuillehouder"
                            isLoading={isLoading && isFetching}
                            optimized={false}
                            options={userOptions}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SectionBasicInfo
