import { useMemo, useState } from 'react'

import {
    cn,
    Divider,
    FieldInput,
    FieldLabel,
    formatDate,
    FormikError,
    FormikRadio,
    FormikSelect,
    Heading,
    NotificationProps,
    Text,
} from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'

import { useUpdateEffect } from '@react-hookz/web'
import { useFormikContext } from 'formik'

import {
    useInputGeoGetInputGeoListLatestWerkingsgebieden,
    useInputGeoGetInputGeoWerkingsgebiedenHistory,
} from '@/api/fetchers'
import AreaPreview from '@/components/AreaPreview'
import { LoaderSpinner } from '@/components/Loader'
import { ModelReturnType } from '@/config/objects/types'
import { DynamicField } from '@/config/types'
import useObject from '@/hooks/useObject'
import { parseUtc } from '@/utils/parseUtc'

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
    const { data } = useObject()

    const { values, setFieldValue, setFieldTouched, errors, touched } =
        useFormikContext<
            ModelReturnType & { source_title?: string; source_uuid?: string }
        >()

    const [query, setQuery] = useState('')

    const { data: options, isLoading } =
        useInputGeoGetInputGeoListLatestWerkingsgebieden(
            { limit: 1000 },
            {
                query: {
                    select: data =>
                        data.results.map(item => ({
                            label: item.title,
                            value: item.title,
                        })),
                },
            }
        )

    const { data: versions, isLoading: versionsLoading } =
        useInputGeoGetInputGeoWerkingsgebiedenHistory(
            { title: String(values.source_title) },
            {
                query: {
                    enabled: !!values.source_title,
                    select: data =>
                        data.sort(
                            (a, b) =>
                                new Date(b.created_date).getTime() -
                                new Date(a.created_date).getTime()
                        ),
                },
            }
        )

    const filteredVersions = useMemo(
        () =>
            !!versions?.length
                ? versions.filter(version =>
                      version.description
                          .toLowerCase()
                          .includes(query.toLowerCase())
                  )
                : undefined,
        [query, versions]
    )

    useUpdateEffect(() => {
        setFieldValue('source_uuid', null)
        setFieldTouched('source_uuid', false)
    }, [values.source_title])

    return (
        <>
            {!!data?.gebieden_statics?.length && (
                <>
                    <div className="prose text-m text-pzh-blue-500 marker:text-s marker:text-pzh-blue-500 prose-ul:my-0 prose-ul:pl-6 prose-li:my-0">
                        <p className="mb-2 text-heading-s font-bold">
                            Huidige onderliggende gebieden
                        </p>

                        <ul>
                            {data.gebieden_statics.map(item => (
                                <li key={item.code}>{item.cached_title}</li>
                            ))}
                        </ul>
                    </div>

                    <Divider className="my-8" />
                </>
            )}

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
                name="source_title"
                placeholder="Selecteer geodata om te koppelen"
                options={options}
                isLoading={isLoading}
                disabled={disabled}
            />

            {!!values.source_title && !!versions?.length && (
                <>
                    <div className="mt-4">
                        <div className="grid grid-cols-6 gap-12">
                            <div className="col-span-6 lg:col-span-2">
                                <Text
                                    bold
                                    color="text-pzh-blue-500"
                                    className="mb-2">
                                    Selecteer een versie
                                </Text>

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
                                        'mt-2 flex h-106.5 flex-col gap-2 overflow-y-auto',
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
                                                key={version.id}
                                                className="relative rounded border border-pzh-gray-600 px-4 py-2">
                                                <div className="flex items-center justify-between [&_>span]:hidden [&_input]:top-0 [&_input]:left-0 [&_input]:h-full [&_input]:w-full [&_input]:cursor-pointer [&_input]:opacity-0">
                                                    <FormikRadio
                                                        name="source_uuid"
                                                        value={version.id}
                                                        defaultChecked={
                                                            version.id ===
                                                            values.source_uuid
                                                        }
                                                        disabled={disabled}>
                                                        {formatDate(
                                                            parseUtc(
                                                                version.created_date
                                                            ),
                                                            'd MMMM yyyy'
                                                        )}
                                                    </FormikRadio>
                                                </div>

                                                <span className="ml-7 block text-s">
                                                    {version.description}
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

                                <div className="flex flex-1 rounded border border-pzh-gray-200">
                                    <AreaPreview
                                        key={values?.source_uuid}
                                        id={values.source_uuid}
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
