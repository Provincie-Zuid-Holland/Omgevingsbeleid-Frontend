import {
    Heading,
    TabItem,
    Tabs,
    Text,
    getHeadingStyles,
} from '@pzh-ui/components'

import { useBeleidskeuzesValidGet, useModulesGet } from '@/api/fetchers'
import { Module } from '@/api/fetchers.schemas'
import ObjectCard from '@/components/DynamicObject/ObjectCard'
import { LoaderCard } from '@/components/Loader'
import ModuleCard from '@/components/Modules/ModuleCard'
import { ModelReturnType } from '@/config/objects/types'
import useBreakpoint from '@/hooks/useBreakpoint'

const DashboardUser = () => {
    const { isMobile } = useBreakpoint()

    const { data: modules, isLoading: modulesLoading } = useModulesGet({
        only_active: true,
        only_mine: true,
    })

    const { data, isLoading } = useBeleidskeuzesValidGet()

    return (
        <div className="col-span-6">
            <div>
                <h2
                    className="mb-3 text-pzh-blue"
                    style={getHeadingStyles('3', isMobile)}>
                    Modules
                </h2>

                <ItemList items={modules} isLoading={modulesLoading} />

                <div className="grid grid-cols-6 mt-8">
                    <div className="col-span-6 lg:col-span-3 mb-6">
                        <Heading level="3" className="mb-4">
                            Mijn beleid
                        </Heading>
                        <Text type="body">
                            Binnen het digitaal omgevingsbeleid ben jij eigenaar
                            van een aantal beleidsobjecten, hieronder vind je
                            een overzicht van deze onderdelen.
                        </Text>
                    </div>

                    <div className="col-span-6">
                        <Tabs>
                            <TabItem
                                title={`Beleidskeuzes (${data?.length || 0})`}>
                                <ItemList items={data} isLoading={isLoading} />
                            </TabItem>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface ItemListProps {
    isLoading: boolean
    items?: Module[] | ModelReturnType[]
}

const ItemList = ({ isLoading, items }: ItemListProps) => (
    <>
        {isLoading ? (
            <div className="mt-5 grid gap-9 lg:grid-cols-3 grid-cols-1">
                <LoaderCard height="180" />
                <LoaderCard height="180" />
                <LoaderCard height="180" />
            </div>
        ) : (
            <>
                {items?.length ? (
                    <ul className="mt-5 grid gap-9 lg:grid-cols-3 grid-cols-1">
                        {items.map(item =>
                            'Module_ID' in item ? (
                                <ModuleCard key={item.Module_ID} {...item} />
                            ) : (
                                'Object_ID' in item && (
                                    <ObjectCard
                                        key={item.UUID}
                                        Object_Type="beleidskeuze"
                                        {...item}
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
