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

import { ContentsModalForm } from '../ModuleContentsModal'
import { StepProps } from './types'

export const StepThree = ({}: StepProps) => {
    const { values } = useFormikContext<ContentsModalForm>()
    const { data: users, isFetching, isLoading } = useUsersGet()

    /**
     * Format user options
     */
    const userOptions = useMemo(
        () =>
            users?.map(user => ({
                label: user.Gebruikersnaam,
                value: user.UUID,
            })),
        [users]
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
                    key={String(!!userOptions)}
                    name="Owner_1_UUID"
                    label="Eerste eigenaar"
                    placeholder="Kies een eigenaar"
                    isLoading={isLoading && isFetching}
                    options={userOptions}
                    required
                />
            </div>
            <div className="mt-3">
                <FormikSelect
                    key={String(!!userOptions)}
                    name="Owner_2_UUID"
                    label="Tweede eigenaar"
                    placeholder="Kies een eigenaar"
                    isLoading={isLoading && isFetching}
                    options={userOptions}
                />
            </div>
            <div className="mt-3">
                <FormikTextArea
                    name="Explanation"
                    label="Toelichting"
                    placeholder="Vul de toelichting in (dit kan ook later)"
                    description="Geef aan waarom deze beleidskeuze gaat worden aangepast in deze module"
                />
            </div>
            <div className="mt-3">
                <FormikTextArea
                    name="Conclusion"
                    label="Conclusie"
                    placeholder="Vul de conclusie in (dit kan ook later)"
                    description="Geef aan welke wijzigingen doorgevoerd gaan worden aan deze beleidskeuze"
                />
            </div>
        </div>
    )
}
