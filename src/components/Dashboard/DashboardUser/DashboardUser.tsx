import {
    Button,
    Heading,
    Pagination,
    TabItem,
    Tabs,
    Text,
} from '@pzh-ui/components'
import { keepPreviousData } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import {
    useModulesGet,
    useObjectsValidCountGet,
    useObjectsValidGet,
} from '@/api/fetchers'
import {
    GenericObjectShort,
    Module,
    ModuleObjectShort,
} from '@/api/fetchers.schemas'
import ObjectCard from '@/components/DynamicObject/ObjectActiveModules/ObjectCard'
import { LoaderCard } from '@/components/Loader'
import ModuleCard from '@/components/Modules/ModuleCard'
import ModuleTile from '@/components/Modules/ModuleTile'
import * as models from '@/config/objects'
import { ModelReturnType, ModelType } from '@/config/objects/types'
import useAuth from '@/hooks/useAuth'

const PAGE_LIMIT = 9

const DashboardUser = () => {
    const { data: modules, isFetching: modulesLoading } = useModulesGet(
        {
            filter_activated: true,
            only_mine: false,
            limit: 3,
        },
        {
            query: {
                placeholderData: keepPreviousData,
            },
        }
    )

    return (
        <div className="col-span-6">
            <div>
                <Heading level="2" size="m" className="mb-4">
                    Modules
                </Heading>

                <div className="mb-4 grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
                    {modulesLoading ? (
                        <>
                            <LoaderCard height="62" mb="" />
                            <LoaderCard height="62" mb="" />
                            <LoaderCard height="62" mb="" />
                        </>
                    ) : !!modules?.results.length ? (
                        modules?.results?.map(module => (
                            <ModuleTile
                                key={`module-${module.Module_ID}`}
                                {...module}
                            />
                        ))
                    ) : (
                        <Text>Er zijn op dit moment geen actieve modules.</Text>
                    )}
                </div>

                <Button asChild variant="secondary" size="small">
                    <Link to="/muteer/modules">Bekijk alle modules</Link>
                </Button>

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

                    <UserObject />
                </div>
            </div>
        </div>
    )
}

const UserObject = () => {
    const { user } = useAuth()

    const [activeTab, setActiveTab] = useState<ModelType>()
    const [currPage, setCurrPage] = useState(1)

    const { data: availableObjectTypes } = useObjectsValidCountGet()

    const { data: objects, isFetching } = useObjectsValidGet(
        {
            owner_uuid: user?.UUID,
            object_type: activeTab,
            limit: PAGE_LIMIT,
            offset: (currPage - 1) * PAGE_LIMIT,
        },
        {
            query: {
                enabled: !!user?.UUID && !!activeTab,
                placeholderData: keepPreviousData,
            },
        }
    )

    return (
        <>
            {!!availableObjectTypes?.length ? (
                <div className="col-span-6">
                    <Tabs
                        selectedKey={activeTab}
                        onSelectionChange={key => {
                            setActiveTab(key as ModelType)
                            setCurrPage(1)
                        }}>
                        {availableObjectTypes?.map(type => {
                            const model = models[type.Object_Type as ModelType]

                            return (
                                <TabItem
                                    key={type.Object_Type}
                                    title={`${model.defaults.pluralCapitalize} (${type.Count})`}>
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
                                                    onPageChange={setCurrPage}
                                                    current={currPage}
                                                    total={objects.total}
                                                    limit={objects.limit}
                                                />
                                            </div>
                                        )}
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
        </>
    )
}

interface ItemListProps {
    isLoading: boolean
    items?:
        | Module[]
        | ModelReturnType[]
        | ModuleObjectShort[]
        | GenericObjectShort[]
    type: 'module' | 'object'
}

const ItemList = ({ isLoading, items, type }: ItemListProps) => (
    <>
        {isLoading ? (
            <div className="mt-4">
                <LoaderCard height="62" mb="" />
                <LoaderCard height="62" mb="" />
                <LoaderCard height="62" mb="" />
            </div>
        ) : (
            <>
                {items?.length ? (
                    <ul className="mt-4">
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
