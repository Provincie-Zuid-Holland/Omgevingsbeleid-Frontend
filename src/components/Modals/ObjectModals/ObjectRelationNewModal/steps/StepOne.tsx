import { Text } from '@pzh-ui/components'

import { useFormikContext } from 'formik'

import { ReadRelation } from '@/api/fetchers.schemas'
import DynamicObjectSearch from '@/components/DynamicObject/DynamicObjectSearch'

import { StepProps } from './types'

export const StepOne = ({ title, id, model, relations }: StepProps) => {
    const { values, setFieldValue } = useFormikContext<ReadRelation>()

    const { pluralCapitalize, plural, prefixSingular, singular } =
        model.defaults

    /**
     * Filter items which already have a relation with current object
     */
    const filter = [
        ...(relations?.map(relation => relation.side_b.object_id) || []),
        ...(id ? [id] : []),
    ]

    return (
        <>
            <Text className="mb-4">
                Selecteer {prefixSingular} {singular} waarmee je een relatie
                wilt aangaan vanuit {model.defaults.singular}:{' '}
                <span className="font-bold">{title}</span>
            </Text>
            <DynamicObjectSearch
                onChange={val => {
                    if (Array.isArray(val)) {
                        setFieldValue('title', val[0].object?.model.title ?? '')
                    } else {
                        setFieldValue('title', val?.object?.model.title ?? '')
                    }
                }}
                objectKey="object_id"
                filter={filter}
                filterParams={{
                    object_types: [singular],
                }}
                placeholder={`Zoek in de ${plural}`}
                label={pluralCapitalize}
                defaultValue={
                    values.title &&
                    values.object_id && {
                        label: values.title,
                        value: values.object_id,
                    }
                }
                styles={{
                    menu: base => ({
                        ...base,
                        position: 'relative',
                        zIndex: 9999,
                        marginTop: 4,
                        boxShadow: 'none',
                    }),
                }}
                blurInputOnSelect
            />
        </>
    )
}
