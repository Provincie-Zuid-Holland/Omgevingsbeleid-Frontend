import {
    FieldSelectProps,
    FormikSelect,
    Heading,
    Text,
} from '@pzh-ui/components'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import {
    useModulesGetListModuleObjects,
    useModulesGetListModules,
    useObjectsDoListAllLatest,
} from '@/api/fetchers'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'

import { ContentsModalForm } from '../ModuleContentsModal'
import { StepProps } from './types'

export const StepFour = ({ setExistingObject }: StepProps) => {
    const { moduleId } = useParams()

    const { values, setFieldValue, setFieldError } =
        useFormikContext<ContentsModalForm>()

    const availableTypes = Object.keys(models).filter(
        model => !models[model as ModelType].defaults.atemporal
    )

    const { data, isFetching } = useModulesGetListModules(
        {
            only_mine: false,
            filter_activated: true,
            filter_closed: false,
            limit: 100,
        },
        {
            query: {
                select: data =>
                    data.results.filter(
                        module =>
                            moduleId && module.Module_ID !== parseInt(moduleId)
                    ),
            },
        }
    )

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

    const { data: moduleObjects, isFetching: moduleIsFetching } =
        useModulesGetListModuleObjects(
            {
                module_id: values.validOrModule as number,
                limit: 100,
            },
            {
                query: {
                    enabled:
                        !!values.validOrModule &&
                        values.validOrModule !== 'valid',
                    select: data =>
                        data.results.map(object => ({
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
                        })),
                },
            }
        )

    const options = useMemo(() => {
        const defaultOption = {
            label: 'Alle vigerende objecten',
            value: 'valid',
        }

        return [
            defaultOption,
            ...(data?.map(module => ({
                label: module.Title,
                value: module.Module_ID,
            })) || []),
        ]
    }, [data])

    const selectedModule = useMemo(() => {
        if (values.validOrModule === 'valid') return

        return options.find(option => option.value === values.validOrModule)
    }, [values.validOrModule, options])

    const objects =
        values.validOrModule === 'valid' ? validObjects : moduleObjects
    const objectsFetching =
        values.validOrModule === 'valid' ? validIsFetching : moduleIsFetching

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
                key={isFetching?.toString() + String(options.length)}
                name="validOrModule"
                label="Kies een bron (module of vigerend)"
                options={options}
                isLoading={isFetching}
                onChange={() => {
                    setExistingObject(undefined)
                    setFieldValue('Object_UUID', null)
                    setFieldError('Object_UUID', undefined)
                }}
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
                    key={objectsFetching?.toString() + String(objects?.length)}
                    name="Object_UUID"
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
                    filterOption={handleFilter}
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
