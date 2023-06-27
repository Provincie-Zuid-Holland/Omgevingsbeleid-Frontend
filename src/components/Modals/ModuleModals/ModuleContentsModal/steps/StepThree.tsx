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
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'

import { ContentsModalForm } from '../ModuleContentsModal'
import { StepProps } from './types'

export const StepThree = ({}: StepProps) => {
    const { values } = useFormikContext<ContentsModalForm>()
    const { data: users, isFetching, isLoading } = useUsersGet()

    const model =
        models[('Object_Type' in values && values.Object_Type) as ModelType] ||
        {}
    const { singularReadable, prefixSingular } = model.defaults || {}

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
                    blurInputOnSelect
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
