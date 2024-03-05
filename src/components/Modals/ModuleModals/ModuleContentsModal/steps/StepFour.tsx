import { FormikSelect, Heading, Text } from '@pzh-ui/components'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { useModulesGet, useModulesModuleIdGet } from '@/api/fetchers'
import DynamicObjectSearch from '@/components/DynamicObject/DynamicObjectSearch'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'

import { ContentsModalForm } from '../ModuleContentsModal'
import { StepProps } from './types'

export const StepFour = ({ existingObject, setExistingObject }: StepProps) => {
    const { moduleId } = useParams()

    const { values, setFieldValue, setFieldError } =
        useFormikContext<ContentsModalForm>()

    const { data, isFetching } = useModulesGet(
        {
            only_mine: false,
            only_active: true,
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

    const { data: moduleObjects, isFetching: moduleIsFetching } =
        useModulesModuleIdGet(values.validOrModule as number, {
            query: {
                enabled:
                    !!values.validOrModule && values.validOrModule !== 'valid',
                select: data =>
                    data.Objects.map(object => ({
                        label: (
                            <div className="flex justify-between">
                                <span>{object.Title}</span>
                                <span className="capitalize opacity-50">
                                    {object.Object_Type.replace('_', ' ')}
                                </span>
                            </div>
                        ),
                        value: object.UUID,
                        objectContext: object,
                    })),
            },
        })

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

    const filterTypes = Object.keys(models).filter(
        model => !!!models[model as ModelType].defaults.atemporal
    ) as ModelType[]

    return (
        <div className="flex flex-col gap-4">
            <Heading level="2">Wat wil je toevoegen?</Heading>
            <Text>
                Je wilt een bestaand onderdeel toevoegen aan deze module. Geef
                aan vanuit welke bron je een onderdeel wilt toevoegen en
                selecteer daarna het juiste onderdeel.
            </Text>
            <FormikSelect
                key={isFetching?.toString() + String(options.length)}
                name="validOrModule"
                options={options}
                isLoading={isFetching}
                onChange={() => {
                    setExistingObject(undefined)
                    setFieldValue('Object_UUID', null)
                    setFieldError('Object_UUID', undefined)
                }}
            />
            {values.validOrModule === 'valid' ? (
                <div>
                    <DynamicObjectSearch
                        onChange={setExistingObject}
                        defaultValue={
                            existingObject && {
                                label: existingObject?.Title,
                                value: existingObject?.UUID,
                            }
                        }
                        filterType={filterTypes}
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
                </div>
            ) : (
                <div>
                    <FormikSelect
                        key={
                            moduleIsFetching?.toString() +
                            String(moduleObjects?.length)
                        }
                        name="Object_UUID"
                        options={moduleObjects}
                        isLoading={moduleIsFetching}
                        placeholder={`Selecteer een onderdeel binnen de module '${selectedModule?.label}'`}
                        onChange={val => {
                            const selected = moduleObjects?.find(
                                object => object.value === val
                            )

                            setExistingObject(selected?.objectContext)
                        }}
                    />
                </div>
            )}
        </div>
    )
}
