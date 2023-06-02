import { FormikTextArea, Heading, Text } from '@pzh-ui/components'
import { useFormikContext } from 'formik'

import { RelationShort } from '@/api/fetchers.schemas'

import { StepProps } from './types'

export const StepTwo = ({ title, model, actionType }: StepProps) => {
    const { values } = useFormikContext<RelationShort & { Title?: string }>()

    const { singular } = model.defaults

    return (
        <>
            <Heading level="2" className="mb-2">
                Binnengekomen verzoek{' '}
                {actionType === 'accept' ? 'accepteren' : 'afwijzen'}
            </Heading>

            <Text className="mb-4">
                Leg uit waarom je {singular}:{' '}
                <span className="font-bold">{title}</span>
                <br />
                {actionType === 'accept'
                    ? 'wilt relateren aan'
                    : 'niet gerelateerd wilt hebben aan'}{' '}
                {singular}: <span className="font-bold">{values.Title}</span>
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
