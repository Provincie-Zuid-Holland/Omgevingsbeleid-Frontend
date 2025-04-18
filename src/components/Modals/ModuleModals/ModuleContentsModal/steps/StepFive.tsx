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

    const model = models[existingObject?.Object_Type as ModelType] || {}
    const { singularReadable, prefixSingular } = model.defaults || {}

    return (
        <div>
            <Heading level="2" className="mb-4">
                Bestaande {existingObject?.Object_Type}
            </Heading>
            <Text className="mb-4">
                “{existingObject?.Title}” toevoegen aan de module “{title}”
            </Text>
            <FormikRadioGroup
                key="Action"
                name="Action"
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
                    name="Explanation"
                    label="Toelichting"
                    placeholder="Vul de toelichting in (dit kan ook later)"
                    description="Geef aan waarom je deze wijziging aanbrengt"
                />
            </div>
            {values.Action !== 'Terminate' && (
                <div className="mt-3">
                    <FormikTextArea
                        name="Conclusion"
                        label="Conclusie"
                        placeholder="Vul de conclusie in (dit kan ook later)"
                        description={`Geef aan welke wijzigingen doorgevoerd gaan worden aan ${prefixSingular} ${singularReadable}`}
                    />
                </div>
            )}
        </div>
    )
}
