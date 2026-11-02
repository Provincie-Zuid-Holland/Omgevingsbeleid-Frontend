import { useMemo } from 'react'

import {
    FormikInput,
    FormikSelect,
    FormikTextArea,
    Heading,
    Text,
} from '@pzh-ui/components'

import { useFormikContext } from 'formik'

import { useUserGetListUsers } from '@/api/fetchers'
import { ModuleAddNewObject } from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import { getStaticDataFilterRoles } from '@/utils/dynamicObject'

import { StepProps } from './types'

export const StepThree = ({}: StepProps) => {
    const { values } = useFormikContext<ModuleAddNewObject>()
    const {
        data: users,
        isFetching,
        isLoading,
    } = useUserGetListUsers({ limit: 500 })

    const model =
        models[('object_type' in values && values.object_type) as ModelType] ||
        {}
    const { singularReadable, prefixSingular } = model.defaults || {}

    const filterRoles = getStaticDataFilterRoles('owner_1_id')

    /**
     * Format user options
     */
    const userOptions1 = useMemo(
        () =>
            users?.results
                .filter(user => user.id !== values.owner_2_id)
                .filter(user =>
                    user.roles?.some(role => filterRoles?.includes(role))
                )
                .map(user => ({
                    label: user.name,
                    value: user.id,
                })),
        [users, values.owner_2_id, filterRoles]
    )

    const userOptions2 = useMemo(
        () =>
            users?.results
                .filter(user => user.id !== values.owner_1_id)
                .filter(user =>
                    user.roles?.some(role => filterRoles?.includes(role))
                )
                .map(user => ({
                    label: user.name,
                    value: user.id,
                })),
        [users, values.owner_1_id, filterRoles]
    )

    return (
        <div>
            <Heading level="2" size="xl" className="mb-4">
                Nieuwe {singularReadable}
            </Heading>
            <Text className="mb-4">
                Geef alvast een titel, een eerste en een tweede eigenaar op.
            </Text>
            <FormikInput
                name="title"
                label="Titel"
                placeholder="Geef een titel op"
                required
            />
            <div className="mt-3">
                <FormikSelect
                    key={String(
                        userOptions1?.length + (values.owner_2_id || '')
                    )}
                    name="owner_1_id"
                    label="Eerste eigenaar"
                    placeholder="Kies een eigenaar"
                    isLoading={isLoading && isFetching}
                    options={userOptions1}
                    noOptionsMessage={({ inputValue }) =>
                        !!inputValue && 'Geen resultaten gevonden'
                    }
                    blurInputOnSelect
                    required
                />
            </div>
            <div className="mt-3">
                <FormikSelect
                    key={String(userOptions2?.length + values.owner_1_id)}
                    name="owner_2_id"
                    label="Tweede eigenaar"
                    placeholder="Kies een eigenaar"
                    isLoading={isLoading && isFetching}
                    options={userOptions2}
                    noOptionsMessage={({ inputValue }) =>
                        !!inputValue && 'Geen resultaten gevonden'
                    }
                    blurInputOnSelect
                />
            </div>
            <div className="mt-3">
                <FormikTextArea
                    name="explanation"
                    label="Toelichting"
                    placeholder="Vul de toelichting in (dit kan ook later)"
                    description={`Geef aan waarom ${prefixSingular} ${singularReadable} gaat worden toegevoegd aan deze module.`}
                />
            </div>
            <div className="mt-3">
                <FormikTextArea
                    name="conclusion"
                    label="Conclusie"
                    placeholder="Vul de conclusie in (dit kan ook later)"
                    description={`Geef aan welke wijzigingen doorgevoerd gaan worden aan ${prefixSingular} ${singularReadable}.`}
                />
            </div>
        </div>
    )
}
