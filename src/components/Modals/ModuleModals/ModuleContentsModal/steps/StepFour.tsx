import { Heading, Text } from '@pzh-ui/components'

import DynamicObjectSearch from '@/components/DynamicObject/DynamicObjectSearch'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'

import { StepProps } from './types'

export const StepFour = ({ existingObject, setExistingObject }: StepProps) => {
    const filterTypes = Object.keys(models).filter(
        model => !!!models[model as ModelType].defaults.atemporal
    ) as ModelType[]

    return (
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
                filterType={filterTypes}
                styles={{
                    menu: base => ({
                        ...base,
                        position: 'relative',
                        zIndex: 9999,
                        marginTop: 2,
                        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.10)',
                    }),
                }}
            />
        </div>
    )
}
