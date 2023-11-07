import { Heading, TabItem, Tabs, Text } from '@pzh-ui/components'
import groupBy from 'lodash.groupby'
import { useMemo } from 'react'

import { useModulesGet, useObjectsValidGet } from '@/api/fetchers'
import {
    Module,
    ModuleObjectShort,
    PagedResponseGenericObjectShort,
} from '@/api/fetchers.schemas'
import ObjectCard from '@/components/DynamicObject/ObjectCard'
import { LoaderCard } from '@/components/Loader'
import ModuleCard from '@/components/Modules/ModuleCard'
import * as models from '@/config/objects'
import { ModelReturnType, ModelType } from '@/config/objects/types'
import useAuth from '@/hooks/useAuth'

const DashboardUser = () => {
    const { user } = useAuth()

    const { data: modules, isLoading: modulesLoading } = useModulesGet({
        only_active: true,
        only_mine: true,
        limit: 100,
    })

    const { data: objects, isLoading } = useObjectsValidGet(
        {
            owner_uuid: user?.UUID,
        },
        { query: { enabled: !!user?.UUID } }
    )

    /**
     * Format relations
     */
    const userObjects = useMemo(() => {
        const grouped = groupBy(objects?.results, 'Object_Type')
        const sorted = Object.keys(grouped)
            .sort()
            .reduce((obj: any, key) => {
                obj[key] = grouped[key]
                return obj
            }, {})

        return sorted
    }, [objects?.results]) as {
        [key in ModelType]: PagedResponseGenericObjectShort[]
    }

    return (
        <div className="col-span-6">
            <div>
                <Heading level="2" size="m" className="mb-4">
                    Modules
                </Heading>

                <ItemList
                    items={modules?.results}
                    isLoading={modulesLoading}
                    type="module"
                />

                <div className="mt-8 grid grid-cols-6">
                    <div className="col-span-6 mb-6 lg:col-span-3">
                        <Heading level="3" size="m" className="mb-4">
                            Mijn beleid
                        </Heading>
                        <Text>
                            Binnen het digitaal omgevingsbeleid ben jij eigenaar
                            van een aantal beleidsobjecten, hieronder vind je
                            een overzicht van deze onderdelen.
                        </Text>
                    </div>

                    {!!Object.keys(userObjects).length ? (
                        <div className="col-span-6">
                            <Tabs>
                                {Object.keys(userObjects).map(type => {
                                    const objects =
                                        userObjects[type as ModelType]
                                    const model = models[type as ModelType]

                                    return (
                                        <TabItem
                                            key={type}
                                            title={`${
                                                model.defaults.pluralCapitalize
                                            } (${objects?.length || 0})`}>
                                            <ItemList
                                                items={objects || []}
                                                isLoading={isLoading}
                                                type="object"
                                            />
                                        </TabItem>
                                    )
                                })}
                            </Tabs>
                        </div>
                    ) : (
                        <div className="col-span-6">
                            <span className="italic">
                                Geen beleidsobjecten gevonden
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

interface ItemListProps {
    isLoading: boolean
    items?:
        | Module[]
        | ModelReturnType[]
        | ModuleObjectShort[]
        | PagedResponseGenericObjectShort[]
    type: 'module' | 'object'
}

const ItemList = ({ isLoading, items, type }: ItemListProps) => (
    <>
        {isLoading ? (
            <div className="mt-5 grid grid-cols-1 gap-9 lg:grid-cols-3">
                <LoaderCard height="180" />
                <LoaderCard height="180" />
                <LoaderCard height="180" />
            </div>
        ) : (
            <>
                {items?.length ? (
                    <ul className="mt-5 grid grid-cols-1 gap-9 lg:grid-cols-3">
                        {items.map(item =>
                            'Module_ID' in item &&
                            'Status' in item &&
                            type === 'module' ? (
                                <ModuleCard key={item.Module_ID} {...item} />
                            ) : (
                                'Object_ID' in item &&
                                type === 'object' && (
                                    <ObjectCard
                                        key={item.UUID}
                                        Object_Type={item.Object_Type}
                                        {...(item as ModelReturnType)}
                                    />
                                )
                            )
                        )}
                    </ul>
                ) : (
                    <span className="mt-3 block italic">
                        Geen modules gevonden.
                    </span>
                )}
            </>
        )}
    </>
)

export default DashboardUser
