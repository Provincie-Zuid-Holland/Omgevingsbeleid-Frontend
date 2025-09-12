import { FormikRadioGroup, Heading, Text } from '@pzh-ui/components'

import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'

import { StepProps } from './types'

export const StepTwo = ({}: StepProps) => {
    const options = Object.keys(models)
        .filter(model => !models[model as ModelType].defaults.atemporal)
        .map(model => ({
            label: models[model as ModelType].defaults.singularCapitalize,
            value: model,
        }))

    return (
        <div>
            <Heading level="2" className="mb-4">
                Wat wil je toevoegen?
            </Heading>
            <Text className="mb-4">
                Welk soort onderdeel wil je toevoegen aan deze module?
            </Text>
            <FormikRadioGroup name="Object_Type" options={options} />
        </div>
    )
}
