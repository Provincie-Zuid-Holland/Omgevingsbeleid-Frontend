import { Heading, Text } from '@pzh-ui/components'

import DynamicObjectSearch from '@/components/DynamicObject/DynamicObjectSearch'

import { StepProps } from './types'

export const StepFour = ({ existingObject, setExistingObject }: StepProps) => (
    <div>
        <Heading level="2" className="mb-4">
            Wat wil je toevoegen?
        </Heading>
        <Text className="mb-4">
            Je wilt een bestaand onderdeel toevoegen aan deze module. Welk
            object wil je toevoegen?
        </Text>
        <DynamicObjectSearch
            onChange={setExistingObject}
            defaultValue={
                existingObject && {
                    label: existingObject?.Title,
                    value: existingObject?.UUID,
                }
            }
        />
    </div>
)
