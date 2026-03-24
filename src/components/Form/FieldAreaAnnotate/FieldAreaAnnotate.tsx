import { usePublicationValueListsGetAreaDesignation } from '@/api/fetchers'
import { GebiedsaanwijzingPatch } from '@/api/fetchers.schemas'
import { FieldSelectProps, FormikSelect } from '@pzh-ui/components'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'

export interface FieldAreaAnnotateProps extends FieldSelectProps {
    optionType: 'type' | 'group'
}

const FieldAreaAnnotate = ({
    optionType,
    ...props
}: FieldAreaAnnotateProps) => {
    const { values } = useFormikContext<GebiedsaanwijzingPatch>()

    const { data, isLoading } = usePublicationValueListsGetAreaDesignation()

    const options = useMemo(
        () =>
            optionType === 'type'
                ? data?.gebiedsaanwijzingen
                      .filter(item => !item.aanwijzing_type.deprecated)
                      .map(item => ({
                          label: item.aanwijzing_type.label,
                          value: item.aanwijzing_type.label,
                      }))
                : !!values.Ref_Type
                  ? data?.gebiedsaanwijzingen
                        .find(
                            item =>
                                item.aanwijzing_type.label === values.Ref_Type
                        )
                        ?.waardes.filter(item => !item.deprecated)
                        .map(item => ({
                            label: item.label,
                            value: item.label,
                        }))
                  : undefined,
        [data, values.Ref_Type]
    )

    return (
        <FormikSelect
            key={
                optionType === 'group'
                    ? isLoading.toString() + values.Ref_Type
                    : isLoading.toString()
            }
            options={options}
            disabled={optionType === 'group' ? !values.Ref_Type : undefined}
            isLoading={isLoading}
            {...props}
        />
    )
}

export default FieldAreaAnnotate
