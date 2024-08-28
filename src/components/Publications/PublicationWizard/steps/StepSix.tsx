import { FormikSelect, Text } from '@pzh-ui/components'

import { LoaderCard } from '@/components/Loader'

import { StepProps } from './types'

const StepSix = ({ data }: StepProps) => (
    <>
        <Text
            as="label"
            bold
            htmlFor="Document_Type"
            className="text-heading-m text-pzh-blue-500">
            Module status
        </Text>
        <div className="flex w-full justify-center">
            <div className="max-w-[736px] flex-1">
                {data.moduleStatus.isLoading ? (
                    <LoaderCard mb="" />
                ) : (
                    <FormikSelect
                        name="Module_Status_ID"
                        placeholder="Selecteer een module status"
                        options={data.moduleStatus.options}
                    />
                )}
            </div>
        </div>
    </>
)

export default StepSix
