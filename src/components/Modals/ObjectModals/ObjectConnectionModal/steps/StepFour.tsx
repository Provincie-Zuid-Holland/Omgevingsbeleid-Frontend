import { Heading, Text } from '@pzh-ui/components'
import { useFormikContext } from 'formik'

import { ReadRelation } from '@/api/fetchers.schemas'

import { StepProps } from './types'

export const StepFour = ({ title, model, connectionModel }: StepProps) => {
    const { values } = useFormikContext<ReadRelation>()

    const { singular } = model.defaults

    return (
        <>
            <Heading level="2" size="xl" className="mb-2">
                Koppeling verbreken
            </Heading>

            <Text>
                Weet je zeker dat je {singular}:{' '}
                <span className="font-bold">{title}</span>
                <br />
                niet meer gekoppeld wilt hebben aan{' '}
                {connectionModel?.defaults.singularReadable}:{' '}
                <span className="font-bold">{values.Title}</span>
            </Text>
        </>
    )
}
