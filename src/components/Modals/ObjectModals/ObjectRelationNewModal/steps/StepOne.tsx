import { Text } from '@pzh-ui/components'
import { useFormikContext } from 'formik'

import { RelationShort } from '@/api/fetchers.schemas'
import DynamicObjectSearch from '@/components/DynamicObject/DynamicObjectSearch'

import { StepProps } from './types'

export const StepOne = ({ title, id, model }: StepProps) => {
    const { values, setFieldValue } = useFormikContext<
        RelationShort & { Title?: string }
    >()

    const { pluralCapitalize, plural, prefixSingular, singular } =
        model.defaults

    return (
        <>
            <Text className="mb-4">
                Selecteer {prefixSingular} {singular} waarmee je een relatie
                wilt aangaan vanuit {model.defaults.singular}:{' '}
                <span className="font-bold">{title}</span>
            </Text>
            <DynamicObjectSearch
                onChange={object => setFieldValue('Title', object?.Title)}
                objectKey="id"
                filter={id}
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
                        marginTop: 2,
                        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.10)',
                    }),
                }}
            />
            <input name="Title" type="hidden" />
        </>
    )
}
