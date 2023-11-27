import { Heading, Pagination, TabItem, Tabs, Text } from '@pzh-ui/components'
import { keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'

import { useModulesGet, useObjectsValidGet } from '@/api/fetchers'
import {
    Module,
    ModuleObjectShort,
    PagedResponseGenericObjectShort,
} from '@/api/fetchers.schemas'
import ObjectCard from '@/components/DynamicObject/ObjectCard'
import { LoaderCard } from '@/components/Loader'
import ModuleCard from '@/components/Modules/ModuleCard'
import { ModelReturnType } from '@/config/objects/types'
import useAuth from '@/hooks/useAuth'

const PAGE_LIMIT = 9

const DashboardUser = () => (
    <div className="col-span-6">
        <div>
            <Heading level="2" size="m" className="mb-4">
                Modules
            </Heading>

            <UserModules />

            <div className="mt-8 grid grid-cols-6">
                <div className="col-span-6 mb-6 lg:col-span-3">
                    <Heading level="3" size="m" className="mb-4">
                        Mijn beleid
                    </Heading>
                    <Text>
                        Binnen het digitaal omgevingsbeleid ben jij eigenaar van
                        een aantal beleidsobjecten, hieronder vind je een
                        overzicht van deze onderdelen.
                    </Text>
                </div>

                <UserObject />
            </div>
        </div>
    </div>
)

const UserModules = () => {
    const [currPage, setCurrPage] = useState(1)

    const { data: modules, isFetching: modulesLoading } = useModulesGet(
        {
            only_active: true,
            only_mine: true,
            limit: PAGE_LIMIT,
            offset: (currPage - 1) * PAGE_LIMIT,
        },
        {
            query: {
                placeholderData: keepPreviousData,
            },
        }
    )

    return (
        <>
            <ItemList
                items={modules?.results}
                isLoading={modulesLoading}
                type="module"
            />
            {!!modules?.total &&
                !!modules?.limit &&
                modules.total > modules.limit && (
                    <div className="mt-8 flex justify-center">
                        <Pagination
                            onChange={setCurrPage}
                            forcePage={currPage - 1}
                            total={modules?.total}
                            limit={modules?.limit}
                        />
                    </div>
                )}
        </>
    )
}

const UserObject = () => {
    const { user } = useAuth()

    const [currPage, setCurrPage] = useState(1)

    const { data: objects, isFetching } = useObjectsValidGet(
        {
            owner_uuid: user?.UUID,
            limit: PAGE_LIMIT,
            offset: (currPage - 1) * PAGE_LIMIT,
        },
        {
            query: {
                enabled: !!user?.UUID,
                placeholderData: keepPreviousData,
            },
        }
    )

    /**
     * Format objects
     */
    // const userObjects = useMemo(() => {
    //     const grouped = groupBy(objects?.results, 'Object_Type')
    //     const sorted = Object.keys(grouped)
    //         .sort()
    //         .reduce((obj: any, key) => {
    //             obj[key] = grouped[key]
    //             return obj
    //         }, {})

    //     return sorted
    // }, [objects?.results]) as {
    //     [key in ModelType]: PagedResponseGenericObjectShort[]
    // }

    return (
        <>
            {!!objects?.results ? (
                <div className="col-span-6">
                    <Tabs>
                        <TabItem title="Tab">
                            <ItemList
                                items={objects?.results}
                                isLoading={isFetching}
                                type="object"
                            />
                            {!!objects?.total &&
                                !!objects?.limit &&
                                objects.total > objects.limit && (
                                    <div className="mt-8 flex justify-center">
                                        <Pagination
                                            onChange={setCurrPage}
                                            forcePage={currPage - 1}
                                            total={objects.total}
                                            limit={objects.limit}
                                        />
                                    </div>
                                )}
                        </TabItem>
                        {/* {Object.keys(userObjects).map(type => {
                            const objects = userObjects[type as ModelType]
                            const model = models[type as ModelType]

                            return (
                                <TabItem
                                    key={type}
                                    title={`${
                                        model.defaults.pluralCapitalize
                                    } (${objects?.length || 0})`}>
                                    <ItemList
                                        items={objects}
                                        isLoading={isLoading}
                                        type="object"
                                    />
                                    {!!objects?.total &&
                                        !!objects?.limit &&
                                        objects.total > objects.limit && (
                                            <div className="mt-8 flex justify-center">
                                                <Pagination
                                                    onChange={setCurrPage}
                                                    forcePage={currPage - 1}
                                                    {...pagination}
                                                />
                                            </div>
                                        )}
                                </TabItem>
                            )
                        })} */}
                    </Tabs>
                </div>
            ) : (
                <div className="col-span-6">
                    <span className="italic">
                        Geen beleidsobjecten gevonden
                    </span>
                </div>
            )}
        </>
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
                <LoaderCard height="180" mb="" />
                <LoaderCard height="180" mb="" />
                <LoaderCard height="180" mb="" />
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
