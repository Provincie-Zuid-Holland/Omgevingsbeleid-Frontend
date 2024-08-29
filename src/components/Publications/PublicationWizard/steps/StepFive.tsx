import { FormikInput, Text } from '@pzh-ui/components'

import { StepProps } from './types'

const StepFive = ({}: StepProps) => (
    <>
        <Text
            as="label"
            bold
            htmlFor="Document_Type"
            className="text-heading-m text-pzh-blue-500">
            Geef de publicatie een interne titel
        </Text>
        <div className="flex w-full justify-center">
            <div className="max-w-[736px] flex-1">
                <FormikInput
                    name="Title"
                    placeholder="Bijvoorbeeld: Omgevingsvisie Herziening 2024"
                />
            </div>
        </div>
    </>
)

export default StepFive
