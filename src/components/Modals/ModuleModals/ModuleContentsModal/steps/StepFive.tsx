import {
    FormikRadioGroup,
    FormikTextArea,
    Heading,
    Text,
} from '@pzh-ui/components'

import { useFormikContext } from 'formik'

import { ModuleAddExistingObject } from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'

import { StepProps } from './types'

export const StepFive = ({ title, existingObject }: StepProps) => {
    const { values } = useFormikContext<ModuleAddExistingObject>()

    const model = models[existingObject?.object_type as ModelType] || {}
    const { singularReadable, prefixSingular } = model.defaults || {}

    return (
        <div>
            <Heading level="2" size="xl" className="mb-4">
                Bestaande {existingObject?.object_type}
            </Heading>
            <Text className="mb-4">
                <Text as="strong">{existingObject?.model.title}</Text> toevoegen
                aan de module <Text as="strong">{title}</Text>
            </Text>
            <FormikRadioGroup
                key="action"
                name="action"
                placeholder="Selecteer de actie"
                label="Actie"
                description={`Gaat ${prefixSingular} ${singularReadable} wijzigen in deze module, of wordt ${prefixSingular} ${singularReadable} verwijderd?`}
                options={[
                    {
                        label: 'Wijzigen',
                        value: 'Edit',
                    },
                    {
                        label: 'Verwijderen',
                        value: 'Terminate',
                    },
                ]}
                defaultValue="Edit"
                required
            />
            <div className="mt-3">
                <FormikTextArea
                    name="explanation"
                    label="Toelichting"
                    placeholder="Vul de toelichting in (dit kan ook later)"
                    description="Geef aan waarom je deze wijziging aanbrengt."
                />
            </div>
            {values.action !== 'Terminate' && (
                <div className="mt-3">
                    <FormikTextArea
                        name="conclusion"
                        label="Conclusie"
                        placeholder="Vul de conclusie in (dit kan ook later)"
                        description={`Geef aan welke wijzigingen doorgevoerd gaan worden aan ${prefixSingular} ${singularReadable}.`}
                    />
                </div>
            )}
        </div>
    )
}
