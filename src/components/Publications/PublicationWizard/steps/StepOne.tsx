import { FormikRadioGroup, Text } from '@pzh-ui/components'

import { DocumentType } from '@/api/fetchers.schemas'

import { StepProps } from './types'

const StepOne = ({}: StepProps) => {
    const documentTypeOptions = Object.entries(DocumentType).map(
        ([, value]) => ({ label: value, value })
    )

    return (
        <>
            <Text
                as="label"
                bold
                htmlFor="Document_Type"
                className="text-heading-m text-pzh-blue-500">
                Voor welk instrument wil je de publicatie aanmaken?
            </Text>
            <FormikRadioGroup
                name="Document_Type"
                options={documentTypeOptions}
                optionLayout="horizontal"
                className="capitalize"
                withBorder
            />
        </>
    )
}

export default StepOne
