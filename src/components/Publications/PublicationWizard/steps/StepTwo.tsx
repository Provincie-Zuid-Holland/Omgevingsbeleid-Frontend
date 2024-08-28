import { FormikRadioGroup, Text } from '@pzh-ui/components'
import { useFormikContext } from 'formik'

import { ProcedureType } from '@/api/fetchers.schemas'

import { PublicationWizardSchema } from '../PublicationWizard'
import { StepProps } from './types'

const StepTwo = ({}: StepProps) => {
    const { values } = useFormikContext<PublicationWizardSchema>()

    const procedureTypeOptions = Object.entries(ProcedureType).map(
        ([, value]) => ({
            label: value === 'draft' ? 'Ontwerp' : 'Definitief',
            value,
        })
    )

    return (
        <>
            <Text
                as="label"
                bold
                htmlFor="Procedure_Type"
                className="text-heading-m text-pzh-blue-500">
                Voor welke fase in{' '}
                <span className="capitalize underline">
                    {values.Document_Type}
                </span>
                ?
            </Text>
            <FormikRadioGroup
                name="Procedure_Type"
                options={procedureTypeOptions}
                optionLayout="horizontal"
                className="capitalize"
                withBorder
            />
        </>
    )
}

export default StepTwo
