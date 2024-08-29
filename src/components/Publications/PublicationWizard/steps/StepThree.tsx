import { FormikRadioGroup, Text } from '@pzh-ui/components'
import { useFormikContext } from 'formik'

import { PublicationWizardSchema } from '../PublicationWizard'
import { StepProps } from './types'

const StepThree = ({ data }: StepProps) => {
    const { values } = useFormikContext<PublicationWizardSchema>()

    return (
        <>
            <Text
                as="label"
                bold
                htmlFor="Environment_UUID"
                className="text-heading-m text-pzh-blue-500">
                Naar welke omgeving wil je{' '}
                {values.Procedure_Type === 'draft' ? 'het' : null}{' '}
                <span className="underline">
                    {values.Procedure_Type === 'draft'
                        ? 'Ontwerp'
                        : 'Definitief'}
                </span>{' '}
                publiceren?
            </Text>
            <FormikRadioGroup
                name="Environment_UUID"
                options={data.environments.options}
                optionLayout="horizontal"
                className="capitalize"
                withBorder
            />
        </>
    )
}

export default StepThree
