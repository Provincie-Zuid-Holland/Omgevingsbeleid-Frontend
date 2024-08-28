import { FormikSelect, Text } from '@pzh-ui/components'

import { LoaderCard } from '@/components/Loader'

import { StepProps } from './types'

const StepFour = ({ data }: StepProps) => {
    return (
        <>
            <Text
                as="label"
                bold
                htmlFor="Document_Type"
                className="text-heading-m text-pzh-blue-500">
                Regeling & Publicatie template
            </Text>
            <div className="flex w-full justify-center gap-4">
                <div className="max-w-[360px] flex-1">
                    {data.acts.isLoading ? (
                        <LoaderCard mb="" height="50" />
                    ) : (
                        <FormikSelect
                            name="Act_UUID"
                            options={data.acts.options}
                            placeholder="Selecteer een regeling"
                            required
                        />
                    )}{' '}
                </div>
                <div className="max-w-[360px] flex-1">
                    {data.templates.isLoading ? (
                        <LoaderCard mb="" height="50" />
                    ) : (
                        <FormikSelect
                            name="Template_UUID"
                            options={data.templates.options}
                            placeholder="Selecteer een publicatie template"
                            required
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default StepFour
