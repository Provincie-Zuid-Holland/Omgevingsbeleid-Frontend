import { useMemo, useState } from 'react'

import { FormikSelect, Heading, Text } from '@pzh-ui/components'

import { useFormikContext } from 'formik'
import { useParams } from 'react-router-dom'

import { modulesGetListModules } from '@/api/fetchers'
import DynamicObjectSearch from '@/components/DynamicObject/DynamicObjectSearch'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import {
    useInfiniteSelectComponents,
    useInfiniteSelectQuery,
    useStableInfiniteOptions,
} from '@/hooks/useInfiniteSelect'

import { ContentsModalForm } from '../ModuleContentsModal'
import { StepProps } from './types'

const PAGE_LIMIT = 50

export const StepFour = ({ setExistingObject }: StepProps) => {
    const { moduleId } = useParams()
    const [moduleFilter, setModuleFilter] = useState('')

    const { values, setFieldValue, setFieldError, setFieldTouched } =
        useFormikContext<ContentsModalForm>()

    const availableTypes = Object.keys(models).filter(
        model => !models[model as ModelType].defaults.atemporal
    )

    const {
        data: modulePages,
        fetchNextPage: fetchNextModules,
        hasNextPage: hasNextModules,
        isFetching,
        isFetchingNextPage: isFetchingNextModules,
    } = useInfiniteSelectQuery({
        queryKey: ['module-contents-modules', moduleFilter],
        queryFn: (offset, signal) =>
            modulesGetListModules(
                {
                    only_mine: false,
                    filter_activated: true,
                    filter_closed: false,
                    filter_title: moduleFilter
                        ? `%${moduleFilter}%`
                        : undefined,
                    offset,
                    limit: PAGE_LIMIT,
                },
                signal
            ),
    })

    const moduleOptions = useStableInfiniteOptions({
        pages: modulePages?.pages,
        getKey: module => module.Module_ID,
        includeItem: module =>
            !!moduleId && module.Module_ID !== parseInt(moduleId),
        toOption: module => ({
            label: module.Title,
            value: module.Module_ID,
        }),
    })

    const options = useMemo(
        () => [
            { label: 'Alle vigerende objecten', value: 'valid' },
            ...(moduleOptions || []),
        ],
        [moduleOptions]
    )

    const selectedModule = useMemo(() => {
        if (values.validOrModule === 'valid') return

        return options.find(option => option.value === values.validOrModule)
    }, [values.validOrModule, options])

    const moduleSelectComponents = useInfiniteSelectComponents({
        fetchNextPage: fetchNextModules,
        hasNextPage: hasNextModules,
        isFetchingNextPage: isFetchingNextModules,
    })

    return (
        <div className="flex flex-col gap-4">
            <Heading level="2" size="xl">
                Wat wil je toevoegen?
            </Heading>
            <Text>
                Je wilt een bestaand onderdeel toevoegen aan deze module. Geef
                aan vanuit welke bron je een onderdeel wilt toevoegen en
                selecteer daarna het juiste onderdeel.
            </Text>
            <Text>
                Indien je een onderdeel uit een andere module selecteert, wordt
                er een kopie gemaakt vanuit die module en worden wijzigingen
                niet automatisch doorgevoerd in andere modules.
            </Text>
            <FormikSelect
                name="validOrModule"
                optimized={false}
                label="Kies een bron (module of vigerend)"
                options={options}
                isLoading={isFetching}
                filterOption={() => true}
                onInputChange={(inputValue, { action }) => {
                    if (action === 'input-change') {
                        setModuleFilter(inputValue)
                    }

                    return inputValue
                }}
                onChange={() => {
                    setExistingObject(undefined)
                    setFieldValue('Object_UUID', null)
                    setFieldError('Object_UUID', undefined)
                    setFieldTouched('Object_UUID', false)
                }}
                components={moduleSelectComponents}
                styles={{
                    menu: base => ({
                        ...base,
                        position: 'relative',
                        zIndex: 9999,
                        marginTop: 4,
                        boxShadow: 'none',
                    }),
                }}
            />

            <div>
                <DynamicObjectSearch
                    key={values.validOrModule}
                    objectKey="Object_UUID"
                    defaultOptions={!!values.validOrModule}
                    initialLimit={PAGE_LIMIT}
                    infiniteScroll
                    label="Selecteer een onderdeel"
                    placeholder={
                        values.validOrModule === 'valid'
                            ? 'Zoek een vigerend onderdeel'
                            : `Zoek een onderdeel binnen de module '${selectedModule?.label}'`
                    }
                    disabled={!values.validOrModule}
                    filterParams={{
                        object_types: availableTypes,
                        include_valids: values.validOrModule === 'valid',
                        include_modules: values.validOrModule !== 'valid',
                        module_id:
                            values.validOrModule &&
                            values.validOrModule !== 'valid'
                                ? Number(values.validOrModule)
                                : undefined,
                    }}
                    onChange={val => {
                        setExistingObject(
                            !Array.isArray(val) ? val?.object : undefined
                        )
                    }}
                    defaultMenuIsOpen
                    styles={{
                        menu: base => ({
                            ...base,
                            position: 'relative',
                            zIndex: 9999,
                            marginTop: 4,
                            boxShadow: 'none',
                        }),
                        menuList: base => ({
                            ...base,
                            maxHeight: 300,
                        }),
                    }}
                />
            </div>
        </div>
    )
}
