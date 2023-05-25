import { FormikSelect, FormikTextArea, Heading, Text } from '@pzh-ui/components'

import { StepProps } from './types'

export const StepFive = ({ title, existingObject }: StepProps) => (
    <div>
        <Heading level="2" className="mb-4">
            Bestaande {existingObject?.Object_Type}
        </Heading>
        <Text className="mb-4">
            “{existingObject?.Title}” toevoegen aan de module “{title}”
        </Text>
        <FormikSelect
            key="Action"
            name="Action"
            placeholder="Selecteer de actie"
            label="Actie"
            description="Gaat deze beleidskeuze wijzigen in deze module, of komt hij te vervallen?"
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
            required
        />
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
