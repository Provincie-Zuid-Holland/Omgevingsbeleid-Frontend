import { FormikTextArea, Text } from '@pzh-ui/components'
import { useFormikContext } from 'formik'

import { ReadRelation } from '@/api/fetchers.schemas'

import { StepProps } from './types'

export const StepThree = ({ title, connectionModel, model }: StepProps) => {
    const { values } = useFormikContext<ReadRelation>()

    const { defaults } = connectionModel || {}
    const { singular } = defaults || {}

    return (
        <>
            <Text className="mb-4">
                Leg uit waarom je {singular}:{' '}
                <span className="font-bold">{values.Title}</span>
                <br />
                wilt koppelen aan {model.defaults.singular}:{' '}
                <span className="font-bold">{title}</span>
            </Text>
            <FormikTextArea
                name="Description"
                placeholder="Beschrijving / Motivering van de koppeling"
                label="Toelichting"
            />
        </>
    )
}
