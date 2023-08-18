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
import { ModuleAddNewObject } from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'

import { StepProps } from './types'

export const StepThree = ({}: StepProps) => {
    const { values } = useFormikContext<ModuleAddNewObject>()
    const { data: users, isFetching, isLoading } = useUsersGet({ limit: 500 })

    const model =
        models[('Object_Type' in values && values.Object_Type) as ModelType] ||
        {}
    const { singularReadable, prefixSingular } = model.defaults || {}

    /**
     * Format user options
     */
    const userOptions1 = useMemo(
        () =>
            users?.results
                .filter(user => user.UUID !== values.Owner_2_UUID)
                .map(user => ({
                    label: user.Gebruikersnaam,
                    value: user.UUID,
                })),
        [users, values.Owner_2_UUID]
    )

    const userOptions2 = useMemo(
        () =>
            users?.results
                .filter(user => user.UUID !== values.Owner_1_UUID)
                .map(user => ({
                    label: user.Gebruikersnaam,
                    value: user.UUID,
                })),
        [users, values.Owner_1_UUID]
    )

    return (
        <div>
            <Heading level="2" className="mb-4">
                Nieuwe {'Object_Type' in values && values.Object_Type}
            </Heading>
            <Text className="mb-4">
                Geef alvast een titel, een eerste en een tweede eigenaar op.
            </Text>
            <FormikInput
                name="Title"
                label="Titel"
                placeholder="Geef een titel op"
                required
            />
            <div className="mt-3">
                <FormikSelect
                    key={String(
                        userOptions1?.length + (values.Owner_2_UUID || '')
                    )}
                    name="Owner_1_UUID"
                    label="Eerste eigenaar"
                    placeholder="Kies een eigenaar"
                    isLoading={isLoading && isFetching}
                    options={userOptions1}
                    blurInputOnSelect
                    required
                />
            </div>
            <div className="mt-3">
                <FormikSelect
                    key={String(userOptions2?.length + values.Owner_1_UUID)}
                    name="Owner_2_UUID"
                    label="Tweede eigenaar"
                    placeholder="Kies een eigenaar"
                    isLoading={isLoading && isFetching}
                    options={userOptions2}
                    blurInputOnSelect
                />
            </div>
            <div className="mt-3">
                <FormikTextArea
                    name="Explanation"
                    label="Toelichting"
                    placeholder="Vul de toelichting in (dit kan ook later)"
                    description={`Geef aan waarom ${prefixSingular} ${singularReadable} gaat worden toegevoegd aan deze module`}
                />
            </div>
            <div className="mt-3">
                <FormikTextArea
                    name="Conclusion"
                    label="Conclusie"
                    placeholder="Vul de conclusie in (dit kan ook later)"
                    description={`Geef aan welke wijzigingen doorgevoerd gaan worden aan ${prefixSingular} ${singularReadable}`}
                />
            </div>
        </div>
    )
}
