import { FormikTextArea, Heading, Text } from '@pzh-ui/components'
import { useFormikContext } from 'formik'

import { ReadRelationShort } from '@/api/fetchers.schemas'

import { StepProps } from './types'

export const StepTwo = ({ title, model }: StepProps) => {
    const { values } = useFormikContext<ReadRelationShort>()

    const { singular } = model.defaults

    return (
        <>
            <Heading level="2" className="mb-2">
                Verzoek tot beleidsrelatie
            </Heading>

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
