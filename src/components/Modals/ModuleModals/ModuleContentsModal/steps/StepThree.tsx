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
import {
    getStaticDataFilterRoles,
    getStaticDataLabel,
    getStaticDataPropertyRequired,
    ownerFields,
} from '@/utils/dynamicObject'

import { StepProps } from './types'

export const StepThree = ({}: StepProps) => {
    const { values } = useFormikContext<ModuleAddNewObject>()
    const {
        data: users,
        isFetching,
        isLoading,
    } = useUserGetListUsers({ limit: 500 })

    const model =
        models[('Object_Type' in values && values.Object_Type) as ModelType] ||
        {}
    const { singularReadable, prefixSingular } = model.defaults || {}

    return (
        <div>
            <Heading level="2" size="xl" className="mb-4">
                Nieuwe {singularReadable}
            </Heading>
            <Text className="mb-4">
                Geef een titel en een ambtelijk opdrachtnemer op.
            </Text>
            <FormikInput
                name="Title"
                label="Titel"
                placeholder="Geef een titel op"
                required
            />
            {ownerFields.map(field => {
                const label = getStaticDataLabel(field)
                const required = getStaticDataPropertyRequired(field)
                const roles = getStaticDataFilterRoles(field)
                const options = users?.results
                    .filter(user =>
                        user.Roles?.some(role => roles?.includes(role))
                    )
                    .filter(
                        user =>
                            !ownerFields.some(
                                other =>
                                    other !== field &&
                                    values[other] === user.UUID
                            )
                    )
                    .map(user => ({
                        label: user.Gebruikersnaam,
                        value: user.UUID,
                    }))

                return (
                    <div className="mt-3" key={field}>
                        <FormikSelect
                            name={field}
                            optimized={false}
                            label={label}
                            placeholder={`Kies een ${label.toLowerCase()}`}
                            isLoading={isLoading || isFetching}
                            options={options}
                            noOptionsMessage={({ inputValue }) =>
                                !!inputValue && 'Geen resultaten gevonden'
                            }
                            blurInputOnSelect
                            isClearable={!required}
                            required={required}
                        />
                    </div>
                )
            })}
            <div className="mt-3">
                <FormikTextArea
                    name="Explanation"
                    label="Toelichting"
                    placeholder="Vul de toelichting in (dit kan ook later)"
                    description={`Geef aan waarom ${prefixSingular} ${singularReadable} gaat worden toegevoegd aan deze module.`}
                />
            </div>
            <div className="mt-3">
                <FormikTextArea
                    name="Conclusion"
                    label="Conclusie"
                    placeholder="Vul de conclusie in (dit kan ook later)"
                    description={`Geef aan welke wijzigingen doorgevoerd gaan worden aan ${prefixSingular} ${singularReadable}.`}
                />
            </div>
        </div>
    )
}
