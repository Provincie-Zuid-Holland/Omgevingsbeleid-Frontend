import { FormikRadioGroup, Heading, Text } from '@pzh-ui/components'

import { StepProps } from './types'

export const StepOne = ({}: StepProps) => (
    <div>
        <Heading level="2" className="mb-4">
            Wat wil je toevoegen?
        </Heading>
        <Text className="mb-4">
            Wil je een nieuw object toevoegen, of een bestaand object?
        </Text>
        <FormikRadioGroup
            name="state"
            options={[
                { label: 'Nieuw', value: 'new' },
                { label: 'Bestaand', value: 'existing' },
            ]}
            required
        />
    </div>
)
