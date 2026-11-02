import { useMemo } from 'react'

import { FieldSelectProps, FormikSelect } from '@pzh-ui/components'

import { useUpdateEffect } from '@react-hookz/web'
import { useFormikContext } from 'formik'

import { usePublicationValueListsGetAreaDesignation } from '@/api/fetchers'
import { GebiedsaanwijzingPostModulePatchObjectBody } from '@/api/fetchers.schemas'

export interface FieldAreaAnnotateProps extends FieldSelectProps {
    optionType: 'type' | 'group'
}

const FieldAreaAnnotate = ({
    optionType,
    ...props
}: FieldAreaAnnotateProps) => {
    const { values, setFieldValue, setFieldTouched } =
        useFormikContext<GebiedsaanwijzingPostModulePatchObjectBody>()

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
                : !!values.ref_type
                  ? data?.gebiedsaanwijzingen
                        .find(
                            item =>
                                item.aanwijzing_type.label === values.ref_type
                        )
                        ?.waardes.filter(item => !item.deprecated)
                        .map(item => ({
                            label: item.label,
                            value: item.label,
                        }))
                  : undefined,
        [data, values.ref_type, optionType]
    )

    useUpdateEffect(() => {
        setFieldValue('ref_group', null)
        setFieldTouched('ref_group', false)
    }, [values.ref_type])

    return (
        <FormikSelect
            key={
                props.name +
                (optionType === 'group'
                    ? isLoading.toString() + values.ref_type
                    : isLoading.toString())
            }
            {...props}
            options={options}
            isLoading={isLoading}
            disabled={
                props.disabled ||
                (optionType === 'group' ? !values.ref_type : undefined)
            }
            blurInputOnSelect
        />
    )
}

export default FieldAreaAnnotate
