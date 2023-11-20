import { Button, Heading, Pagination, Text } from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useModulesGet } from '@/api/fetchers'
import { LoaderCard } from '@/components/Loader'
import ModuleTile from '@/components/Modules/ModuleTile'
import * as models from '@/config/objects'
import { Model } from '@/config/objects/types'

const PAGE_LIMIT = 20

const DashboardAdmin = () => {
    const [currPage, setCurrPage] = useState(1)

    const {
        data: modules,
        isLoading: modulesLoading,
        isSuccess,
    } = useModulesGet({
        only_active: false,
        only_mine: false,
        limit: PAGE_LIMIT,
        offset: (currPage - 1) * PAGE_LIMIT,
    })

    const [pagination, setPagination] = useState({
        isLoaded: false,
        total: modules?.total,
        limit: modules?.limit,
    })

    const sortedModules = useMemo(
        () =>
            modules?.results.sort(
                (a, b) => Number(a.Closed) - Number(b.Closed)
            ),
        [modules]
    )

    useEffect(() => {
        if (isSuccess) {
            if (!!!modules.results.length) {
                setPagination({
                    isLoaded: false,
                    total: modules?.total,
                    limit: modules?.limit,
                })
            } else {
                if (!pagination.isLoaded) {
                    setPagination({
                        isLoaded: true,
                        total: modules?.total,
                        limit: modules?.limit,
                    })
                }
            }
        }
    }, [isSuccess, modules, pagination.isLoaded])

    return (
        <div className="grid grid-cols-6">
            <div className="col-span-6 mb-4 lg:col-span-3">
                <Heading level="2" size="m" className="mb-3">
                    Onderdelen
                </Heading>
                <Text>
                    Als beheerder kan je alle onderdelen van het digitaal
                    omgevingsbeleid inzien en waar nodig aanpassen. Hieronder
                    vind je een lijst van de onderdelen die voor jou als
                    beheerder relevant zijn.
                </Text>
            </div>
            <div className="col-span-6">
                <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
                    {Object.keys(models).map(key => {
                        const model = models[key as keyof typeof models]

                        return <ModelTile key={`model-${key}`} model={model} />
                    })}
                </div>

                <div className="mt-10">
                    <div className="mb-4 flex items-center justify-between">
                        <Heading level="3" size="m">
                            Modules
                        </Heading>
                        <Button
                            as="a"
                            href="/muteer/modules/nieuw"
                            variant="cta"
                            size="small"
                            data-testid="dashboard-new-module">
                            Nieuwe module
                        </Button>
                    </div>

                    <div className="grid grid-cols-8 px-3 py-2">
                        <div className="col-span-5">
                            <Text bold>Titel</Text>
                        </div>
                        <div className="col-span-3">
                            <Text bold>Status</Text>
                        </div>
                    </div>

                    <div className="mb-3 h-px w-full bg-pzh-blue" />

                    <div className="grid grid-cols-1 gap-y-2">
                        {modulesLoading ? (
                            <>
                                <LoaderCard height="62" mb="" />
                                <LoaderCard height="62" mb="" />
                                <LoaderCard height="62" mb="" />
                            </>
                        ) : (
                            sortedModules?.map(module => (
                                <ModuleTile
                                    key={`module-${module.Module_ID}`}
                                    {...module}
                                />
                            ))
                        )}
                    </div>

                    {!!pagination.total &&
                        !!pagination.limit &&
                        pagination.total > pagination.limit && (
                            <div className="mt-8 flex justify-center">
                                <Pagination
                                    onChange={setCurrPage}
                                    forcePage={currPage - 1}
                                    {...pagination}
                                />
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}

const ModelTile = ({ model }: { model: Model }) => {
    const { icon: Icon, plural, pluralCapitalize } = model.defaults

    return (
        <Link to={`/muteer/${plural}`} data-testid="dashboard-model-tile">
            <div className="group flex items-center justify-between rounded border border-pzh-gray-200 px-6 py-7">
                <div className="flex items-center">
                    <Icon size={20} className="mr-4 text-pzh-blue" />
                    <Heading level="3" size="s" className="-mb-1.5">
                        {pluralCapitalize}
                    </Heading>
                </div>
                <div className="transition group-hover:translate-x-1">
                    <AngleRight size={18} className="text-pzh-green" />
                </div>
            </div>
        </Link>
    )
}

export default DashboardAdmin
