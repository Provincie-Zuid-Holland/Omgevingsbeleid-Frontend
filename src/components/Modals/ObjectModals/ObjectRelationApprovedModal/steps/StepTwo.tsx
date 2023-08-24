import { FormikCheckbox, Heading, Text } from '@pzh-ui/components'
import { useFormikContext } from 'formik'

import { ReadRelation } from '@/api/fetchers.schemas'

import { StepProps } from './types'

export const StepTwo = ({ title, model }: StepProps) => {
    const { values } = useFormikContext<ReadRelation>()

    const { singular } = model.defaults

    return (
        <>
            <Heading level="2" className="mb-2">
                Beleidsrelatie verbreken
            </Heading>

            <Text className="mb-4">
                Weet je zeker dat je {singular}:{' '}
                <span className="font-bold">{title}</span>
                <br />
                niet meer gerelateerd wilt hebben aan {singular}:{' '}
                <span className="font-bold">{values.Title}</span>
            </Text>

            <FormikCheckbox name="consent" required>
                Ik weet zeker dat ik deze beleidsrelatie wil verbreken
            </FormikCheckbox>
        </>
    )
}
