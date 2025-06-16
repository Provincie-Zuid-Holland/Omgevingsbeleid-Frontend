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
        ...(relations?.map(relation => relation.Side_B.Object_ID) || []),
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
                onChange={object => setFieldValue('Title', object?.Title)}
                objectKey="Object_ID"
                filter={filter}
                filterType={[singular]}
                placeholder={`Zoek in de ${plural}`}
                label={pluralCapitalize}
                defaultValue={
                    values.Title &&
                    values.Object_ID && {
                        label: values.Title,
                        value: values.Object_ID,
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
