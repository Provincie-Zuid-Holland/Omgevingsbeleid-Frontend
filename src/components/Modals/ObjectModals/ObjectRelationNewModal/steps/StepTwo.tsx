import { FormikTextArea, Text } from '@pzh-ui/components'
import { useFormikContext } from 'formik'

import { RelationShort } from '@/api/fetchers.schemas'

import { StepProps } from './types'

export const StepTwo = ({ title, model }: StepProps) => {
    const { values } = useFormikContext<RelationShort & { Title?: string }>()

    const { singular } = model.defaults

    return (
        <>
            <Text className="mb-4">
                Leg uit waarom je {singular}:{' '}
                <span className="font-bold">{title}</span>
                <br />
                wilt relateren aan {singular}:{' '}
                <span className="font-bold">{values.Title}</span>
            </Text>
            <FormikTextArea
                name="Explanation"
                placeholder="Beschrijving / Motivering van de relatie"
                label="Toelichting"
                required
            />
        </>
    )
}
