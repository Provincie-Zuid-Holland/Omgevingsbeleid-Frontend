import {
    FieldSelectProps,
    FormikSelect,
    Heading,
    Text,
} from '@pzh-ui/components'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useFormikContext } from 'formik'
import { CSSProperties, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
    modulesGetListModuleObjects,
    modulesGetListModules,
    useObjectsDoListAllLatest,
} from '@/api/fetchers'
import { LoaderSpinner } from '@/components/Loader'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'

import { ContentsModalForm } from '../ModuleContentsModal'
import { StepProps } from './types'

export const StepFour = ({ setExistingObject }: StepProps) => {
    const { moduleId } = useParams()
    const [moduleFilter, setModuleFilter] = useState('')
    const [moduleObjectFilter, setModuleObjectFilter] = useState('')

    const { values, setFieldValue, setFieldError } =
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
    } = useInfiniteQuery({
        queryKey: ['module-contents-modules', moduleFilter],
        queryFn: ({ pageParam, signal }) =>
            modulesGetListModules(
                {
                    only_mine: false,
                    filter_activated: true,
                    filter_closed: false,
                    filter_title: moduleFilter
                        ? `%${moduleFilter}%`
                        : undefined,
                    offset: pageParam,
                    limit: 100,
                },
                signal
            ),
        initialPageParam: 0,
        getNextPageParam: lastPage => {
            const nextOffset = (lastPage.offset ?? 0) + lastPage.results.length

            return nextOffset < lastPage.total ? nextOffset : undefined
        },
    })

    const { data: validObjects, isFetching: validIsFetching } =
        useObjectsDoListAllLatest(
            {
                limit: 500,
                sort_column: 'Title',
                sort_order: 'ASC',
                object_types: availableTypes,
            },
            {
                query: {
                    enabled:
                        !!values.validOrModule &&
                        values.validOrModule === 'valid',
                    select: data =>
                        data.results.map(object => ({
                            label: (
                                <div className="flex justify-between gap-4">
                                    <span className="truncate">
                                        {object.Model.Title}
                                    </span>
                                    <span className="whitespace-nowrap capitalize opacity-50">
                                        {object.Object_Type.replace('_', ' ')}
                                    </span>
                                </div>
                            ),
                            value: object.Model.UUID,
                            objectContext: object,
                        })),
                },
            }
        )

    const {
        data: moduleObjectPages,
        fetchNextPage: fetchNextModuleObjects,
        hasNextPage: hasNextModuleObjects,
        isFetching: moduleIsFetching,
        isFetchingNextPage: isFetchingNextModuleObjects,
    } = useInfiniteQuery({
        queryKey: [
            'module-contents-objects',
            values.validOrModule,
            moduleObjectFilter,
        ],
        queryFn: ({ pageParam, signal }) =>
            modulesGetListModuleObjects(
                {
                    module_id: values.validOrModule as number,
                    title: moduleObjectFilter
                        ? `%${moduleObjectFilter}%`
                        : undefined,
                    offset: pageParam,
                    limit: 100,
                },
                signal
            ),
        initialPageParam: 0,
        getNextPageParam: lastPage => {
            const nextOffset = (lastPage.offset ?? 0) + lastPage.results.length

            return nextOffset < lastPage.total ? nextOffset : undefined
        },
        enabled: !!values.validOrModule && values.validOrModule !== 'valid',
    })

    const moduleObjects = useMemo(
        () =>
            moduleObjectPages?.pages.flatMap(page =>
                page.results.map(object => ({
                    label: (
                        <div className="flex justify-between gap-4">
                            <span>{object.Model.Title}</span>
                            <span className="whitespace-nowrap capitalize opacity-50">
                                {object.Object_Type.replace('_', ' ')}
                            </span>
                        </div>
                    ),
                    value: object.Model.UUID,
                    objectContext: object,
                }))
            ),
        [moduleObjectPages]
    )

    const options = useMemo(() => {
        const defaultOption = {
            label: 'Alle vigerende objecten',
            value: 'valid',
        }

        return [
            defaultOption,
            ...(modulePages?.pages.flatMap(page =>
                page.results
                    .filter(
                        module =>
                            moduleId && module.Module_ID !== parseInt(moduleId)
                    )
                    .map(module => ({
                        label: module.Title,
                        value: module.Module_ID,
                    }))
            ) || []),
        ]
    }, [moduleId, modulePages])

    const selectedModule = useMemo(() => {
        if (values.validOrModule === 'valid') return

        return options.find(option => option.value === values.validOrModule)
    }, [values.validOrModule, options])

    const objects =
        values.validOrModule === 'valid' ? validObjects : moduleObjects
    const objectsFetching =
        values.validOrModule === 'valid' ? validIsFetching : moduleIsFetching

    const isFetchingNextModulesRef = useRef(isFetchingNextModules)
    const isFetchingNextModuleObjectsRef = useRef(isFetchingNextModuleObjects)

    isFetchingNextModulesRef.current = isFetchingNextModules
    isFetchingNextModuleObjectsRef.current = isFetchingNextModuleObjects

    const moduleSelectComponents = useMemo<FieldSelectProps['components']>(
        () => ({
            MenuList: props => (
                <div
                    {...props.innerProps}
                    ref={props.innerRef}
                    className={props.cx(
                        {
                            'menu-list': true,
                            'menu-list--is-multi': props.isMulti,
                        },
                        props.getClassNames('menuList', props)
                    )}
                    style={props.getStyles('menuList', props) as CSSProperties}>
                    {props.children}
                    {isFetchingNextModulesRef.current && (
                        <div className="flex justify-center py-3">
                            <LoaderSpinner />
                        </div>
                    )}
                </div>
            ),
        }),
        []
    )

    const moduleObjectSelectComponents = useMemo<
        FieldSelectProps['components']
    >(
        () => ({
            MenuList: props => (
                <div
                    {...props.innerProps}
                    ref={props.innerRef}
                    className={props.cx(
                        {
                            'menu-list': true,
                            'menu-list--is-multi': props.isMulti,
                        },
                        props.getClassNames('menuList', props)
                    )}
                    style={props.getStyles('menuList', props) as CSSProperties}>
                    {props.children}
                    {isFetchingNextModuleObjectsRef.current && (
                        <div className="flex justify-center py-3">
                            <LoaderSpinner />
                        </div>
                    )}
                </div>
            ),
        }),
        []
    )

    /**
     * Handle filtering of select field
     */
    const handleFilter: FieldSelectProps['filterOption'] = (
        option,
        inputValue
    ) => {
        if (!objects) return false

        const data = option.data as (typeof objects)[0]
        const label = data.label.props.children[0].props.children as string

        if (
            label?.toLowerCase().includes(inputValue.toLowerCase()) ||
            data.value?.toLowerCase().includes(inputValue.toLowerCase())
        ) {
            return true
        }

        return false
    }

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
                onMenuScrollToBottom={() => {
                    if (hasNextModules && !isFetchingNextModules) {
                        fetchNextModules()
                    }
                }}
                onChange={() => {
                    setModuleObjectFilter('')
                    setExistingObject(undefined)
                    setFieldValue('Object_UUID', null)
                    setFieldError('Object_UUID', undefined)
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
                <FormikSelect
                    name="Object_UUID"
                    optimized={false}
                    label="Selecteer een onderdeel"
                    options={objects}
                    isLoading={objectsFetching}
                    placeholder={
                        values.validOrModule === 'valid'
                            ? 'Selecteer een vigerend onderdeel'
                            : `Selecteer een onderdeel binnen de module '${selectedModule?.label}'`
                    }
                    onChange={val => {
                        const selected = objects?.find(
                            object =>
                                object.value ===
                                (val as (typeof objects)[0]).value
                        )

                        setExistingObject(selected?.objectContext)
                    }}
                    defaultMenuIsOpen
                    filterOption={
                        values.validOrModule === 'valid'
                            ? handleFilter
                            : () => true
                    }
                    onInputChange={(inputValue, { action }) => {
                        if (
                            action === 'input-change' &&
                            values.validOrModule !== 'valid'
                        ) {
                            setModuleObjectFilter(inputValue)
                        }

                        return inputValue
                    }}
                    onMenuScrollToBottom={() => {
                        if (
                            values.validOrModule !== 'valid' &&
                            hasNextModuleObjects &&
                            !isFetchingNextModuleObjects
                        ) {
                            fetchNextModuleObjects()
                        }
                    }}
                    components={moduleObjectSelectComponents}
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
