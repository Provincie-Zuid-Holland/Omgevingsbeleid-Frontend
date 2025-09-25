import { FormikRadioGroup, Heading, Text } from '@pzh-ui/components'

import { StepProps } from './types'

export const StepOne = ({}: StepProps) => (
    <div>
        <Heading level="2" size="xl" className="mb-4">
            Wat wil je toevoegen?
        </Heading>
        <Text className="mb-4">
            Wil je een bestaand object bewerken of een nieuw object toevoegen?
        </Text>
        <FormikRadioGroup
            name="state"
            options={[
                { label: 'Bestaand', value: 'existing' },
                { label: 'Nieuw', value: 'new' },
            ]}
            required
        />
    </div>
)
