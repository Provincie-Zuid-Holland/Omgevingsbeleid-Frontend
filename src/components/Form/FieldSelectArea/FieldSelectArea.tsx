import {
    cn,
    FieldLabel,
    formatDate,
    FormikError,
    FormikRadio,
    FormikSelect,
    Text,
} from '@pzh-ui/components'
import { useFormikContext } from 'formik'

import {
    useInputGeoGetInputGeoListLatestWerkingsgebieden,
    useInputGeoGetInputGeoWerkingsgebiedenHistory,
} from '@/api/fetchers'
import AreaPreview from '@/components/AreaPreview'
import { LoaderSpinner } from '@/components/Loader'
import { ModelReturnType } from '@/config/objects/types'
import { DynamicField } from '@/config/types'
import { parseUtc } from '@/utils/parseUtc'
import { useUpdateEffect } from '@react-hookz/web'

const FieldSelectArea = ({
    name,
    label,
    required,
    description,
    disabled,
}: Omit<DynamicField, 'type'> & { disabled?: boolean }) => {
    const { values, setFieldValue, setFieldTouched, errors, touched } =
        useFormikContext<
            ModelReturnType & { Source_Title?: string; Source_UUID?: string }
        >()

    const { data: options, isLoading } =
        useInputGeoGetInputGeoListLatestWerkingsgebieden(
            { limit: 1000 },
            {
                query: {
                    select: data =>
                        data.results.map(item => ({
                            label: item.Title,
                            value: item.Title,
                        })),
                },
            }
        )

    const { data: versions, isLoading: versionsLoading } =
        useInputGeoGetInputGeoWerkingsgebiedenHistory(
            { title: String(values.Source_Title) },
            {
                query: {
                    enabled: !!values.Source_Title,
                    select: data =>
                        data.sort(
                            (a, b) =>
                                new Date(b.Created_Date).getTime() -
                                new Date(a.Created_Date).getTime()
                        ),
                },
            }
        )

    useUpdateEffect(() => {
        setFieldValue('Source_UUID', null)
        setFieldTouched('Source_UUID', false)
    }, [values.Source_Title])

    return (
        <>
            {label && (
                <FieldLabel
                    name={name}
                    label={label}
                    description={description}
                    required={required}
                />
            )}

            <FormikSelect
                key={isLoading?.toString()}
                name="Source_Title"
                placeholder="Selecteer geodata om te koppelen"
                options={options}
                isLoading={isLoading}
                disabled={disabled}
            />

            {!!values.Source_Title && !!versions?.length && (
                <div className="mt-4">
                    <Text bold className="mb-2" color="text-pzh-blue-500">
                        Selecteer een versie
                    </Text>

                    <div className="grid grid-cols-6 gap-12">
                        <div className="col-span-2">
                            <div
                                className={cn(
                                    'border-pzh-gray-200 flex h-[500px] flex-col gap-2 overflow-y-auto rounded border p-2',
                                    {
                                        'border-pzh-red-500':
                                            !!errors?.[
                                                name as keyof typeof errors
                                            ] &&
                                            !!touched?.[
                                                name as keyof typeof touched
                                            ],
                                    }
                                )}>
                                {versionsLoading ? (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <LoaderSpinner />
                                    </div>
                                ) : (
                                    versions?.map((version, index) => (
                                        <div
                                            key={version.UUID}
                                            className="border-pzh-gray-200 relative rounded border px-4 py-2">
                                            <div className="flex items-center gap-2 [&_>span]:hidden [&_input]:top-0 [&_input]:left-0 [&_input]:h-full [&_input]:w-full [&_input]:cursor-pointer [&_input]:opacity-0">
                                                <FormikRadio
                                                    name="Source_UUID"
                                                    value={version.UUID}
                                                    defaultChecked={
                                                        version.UUID ===
                                                        values.Source_UUID
                                                    }
                                                    disabled={disabled}>
                                                    Versie{' '}
                                                    {versions.length - index}
                                                </FormikRadio>
                                            </div>

                                            <span className="text-s -mt-1 ml-7 block">
                                                {formatDate(
                                                    parseUtc(
                                                        version.Created_Date
                                                    ),
                                                    'd MMMM yyyy'
                                                )}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        <div className="col-span-4 flex flex-col">
                            <div className="border-pzh-gray-200 flex flex-1 rounded border">
                                <AreaPreview
                                    key={values?.Source_UUID}
                                    UUID={values.Source_UUID}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <FormikError name={name} />
        </>
    )
}

export default FieldSelectArea
