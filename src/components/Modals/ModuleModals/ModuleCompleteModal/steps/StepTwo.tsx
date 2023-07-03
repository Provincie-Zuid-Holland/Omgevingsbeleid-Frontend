import {
    Divider,
    FieldCheckbox,
    FormikDate,
    FormikInput,
    Text,
} from '@pzh-ui/components'
import { useFormikContext } from 'formik'
import { useMemo, useState } from 'react'

import { CompleteModule, ModuleObjectShort } from '@/api/fetchers.schemas'
import useModule from '@/hooks/useModule'
import { getObjectActionText } from '@/utils/dynamicObject'
import formatDate from '@/utils/formatDate'

export const StepTwo = () => {
    const { values } = useFormikContext<CompleteModule>()

    const { data } = useModule()

    const objects = useMemo(
        () =>
            data?.Objects.filter(object => object.Object_Type !== 'Terminate'),
        [data?.Objects]
    )

    const date = useMemo(
        () =>
            values.Default_Start_Validity &&
            formatDate(new Date(values.Default_Start_Validity), 'dd-MM-yyyy'),
        [values.Default_Start_Validity]
    )

    return (
        <div>
            <Text className="mb-4">
                Geef aan welke onderdelen de inwerkingtredingdatum ‘{date}’
                hebben, mocht het onderdeel een andere inwerkingtredingsdatum
                hebben, geef dit per object aan.
            </Text>

            {objects?.map(object => (
                <Object key={object.UUID} {...object} />
            ))}
        </div>
    )
}

const Object = ({
    Object_ID,
    Object_Type,
    ModuleObjectContext,
    Title,
}: ModuleObjectShort) => {
    const { values, setFieldValue } = useFormikContext<CompleteModule>()

    const [checked, setChecked] = useState(true)

    const index = useMemo(
        () =>
            values.ObjectSpecifiekeGeldigheden?.findIndex(
                item =>
                    item?.Object_ID === Object_ID &&
                    item?.Object_Type === Object_Type
            ) || 0,
        [values.ObjectSpecifiekeGeldigheden, Object_ID, Object_Type]
    )

    const isDirty = useMemo(
        () =>
            !!values.ObjectSpecifiekeGeldigheden?.find(
                item =>
                    item?.Object_ID === Object_ID &&
                    item?.Object_Type === Object_Type
            )?.Start_Validity,
        [values.ObjectSpecifiekeGeldigheden, Object_ID, Object_Type]
    )

    return (
        <div>
            <Divider />
            <div className="flex items-baseline">
                <FieldCheckbox
                    checked={checked && !isDirty}
                    onChange={() => {
                        setChecked(!checked)

                        if (checked) {
                            const index =
                                values.ObjectSpecifiekeGeldigheden?.length || 0

                            setFieldValue(
                                `ObjectSpecifiekeGeldigheden.${index}.Object_Type`,
                                Object_Type
                            )
                            setFieldValue(
                                `ObjectSpecifiekeGeldigheden.${index}.Object_ID`,
                                Object_ID
                            )
                            setFieldValue(
                                `ObjectSpecifiekeGeldigheden.${index}.Start_Validity`,
                                new Date().toISOString()
                            )
                        } else {
                            setFieldValue(
                                'ObjectSpecifiekeGeldigheden',
                                values.ObjectSpecifiekeGeldigheden?.filter(
                                    item =>
                                        item?.Object_ID !== Object_ID &&
                                        item?.Object_Type !== Object_Type
                                )
                            )
                        }
                    }}
                />
                <div className="w-full ml-2">
                    <div className="flex justify-between">
                        <span className="capitalize block text-sm text-pzh-gray-600">
                            {Object_Type}
                        </span>
                        <span className="capitalize block text-sm text-pzh-gray-600">
                            {getObjectActionText(ModuleObjectContext?.Action)}
                        </span>
                    </div>
                    <Text className="truncate">{Title}</Text>

                    {(!checked || isDirty) && (
                        <>
                            <FormikDate
                                name={`ObjectSpecifiekeGeldigheden.${index}.Start_Validity`}
                                layout="grid"
                                label="Inwerkingtredingsdatum"
                                required
                            />
                            <FormikInput
                                type="hidden"
                                name={`ObjectSpecifiekeGeldigheden.${index}.Object_Type`}
                                defaultValue={Object_Type}
                            />
                            <FormikInput
                                type="hidden"
                                name={`ObjectSpecifiekeGeldigheden.${index}.Object_ID`}
                                value={Object_ID}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
