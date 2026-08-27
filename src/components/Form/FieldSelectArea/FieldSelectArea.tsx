import {
    cn,
    FieldInput,
    FieldLabel,
    formatDate,
    FormikError,
    FormikRadio,
    FormikSelect,
    Heading,
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
import { MagnifyingGlass } from '@pzh-ui/icons'
import { NotificationProps } from '@pzh-ui/react'
import { useUpdateEffect } from '@react-hookz/web'
import { useMemo, useState } from 'react'

const FieldSelectArea = ({
    name,
    label,
    required,
    description,
    disabled,
    notification,
}: Omit<DynamicField, 'type'> & {
    disabled?: boolean
    notification?: NotificationProps
}) => {
    const { values, setFieldValue, setFieldTouched, errors, touched } =
        useFormikContext<
            ModelReturnType & { Source_Title?: string; Source_UUID?: string }
        >()

    const [query, setQuery] = useState('')

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

    const filteredVersions = useMemo(
        () =>
            !!versions?.length
                ? versions.filter(version =>
                      version.Description.toLowerCase().includes(
                          query.toLowerCase()
                      )
                  )
                : undefined,
        [query, versions]
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
                    notification={notification}
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
                <>
                    <div className="mt-4">
                        <div className="grid grid-cols-6 gap-12">
                            <div className="col-span-6 lg:col-span-2">
                                <Text bold color="text-pzh-blue-500">
                                    Selecteer een versie
                                </Text>

                                <span className="mb-2 block text-xs">
                                    Je herkent versies met dezelfde geo-data aan
                                    de genummerde pin.
                                </span>

                                <FieldInput
                                    name="query"
                                    placeholder="Zoek op omschrijving"
                                    aria-label="Zoek op omschrijving"
                                    className="pr-12 text-ellipsis"
                                    icon={MagnifyingGlass}
                                    onChange={e => setQuery(e.target.value)}
                                />

                                <div
                                    className={cn(
                                        'mt-2 flex h-102.5 flex-col gap-2 overflow-y-auto',
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
                                    ) : !!filteredVersions?.length ? (
                                        filteredVersions.map(version => (
                                            <div
                                                key={version.UUID}
                                                className="border-pzh-gray-600 relative rounded border px-4 py-2">
                                                <div className="flex items-center justify-between [&_>span]:hidden [&_input]:top-0 [&_input]:left-0 [&_input]:h-full [&_input]:w-full [&_input]:cursor-pointer [&_input]:opacity-0">
                                                    <FormikRadio
                                                        name="Source_UUID"
                                                        value={version.UUID}
                                                        defaultChecked={
                                                            version.UUID ===
                                                            values.Source_UUID
                                                        }
                                                        disabled={disabled}>
                                                        {formatDate(
                                                            parseUtc(
                                                                version.Created_Date
                                                            ),
                                                            'd MMMM yyyy'
                                                        )}
                                                    </FormikRadio>

                                                    {/* <Tooltip label="Overeenkomende geo-data">
                                                        <div className="relative size-4.5 cursor-help">
                                                            <span className="absolute inset-0 flex items-center justify-center text-xs">
                                                                1
                                                            </span>
                                                            <LocationPin className="size-4.5" />
                                                        </div>
                                                    </Tooltip> */}
                                                </div>

                                                <span className="text-s ml-7 block">
                                                    {version.Description}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-s italic">
                                            Geen onderdelen gevonden met deze
                                            omschrijving.
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="col-span-6 flex flex-col gap-2 lg:col-span-4">
                                <Heading level="2" size="m">
                                    Kaartweergave
                                </Heading>

                                <div className="border-pzh-gray-200 flex flex-1 rounded border">
                                    <AreaPreview
                                        key={values?.Source_UUID}
                                        UUID={values.Source_UUID}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <FormikError name={name} />
                </>
            )}
        </>
    )
}

export default FieldSelectArea
