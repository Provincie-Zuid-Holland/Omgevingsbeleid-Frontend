import { Button, Heading, Text } from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'
import { keepPreviousData } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { useModulesGet } from '@/api/fetchers'
import { LoaderCard } from '@/components/Loader'
import ModuleTile from '@/components/Modules/ModuleTile'
import * as models from '@/config/objects'
import { Model } from '@/config/objects/types'

const PAGE_LIMIT = 3

const DashboardAdmin = () => {
    const { data: modules, isFetching: modulesLoading } = useModulesGet(
        {
            filter_activated: true,
            filter_closed: false,
            only_mine: false,
            limit: PAGE_LIMIT,
            sort_column: 'Modified_Date',
            sort_order: 'DESC',
        },
        {
            query: {
                placeholderData: keepPreviousData,
            },
        }
    )

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
                            Actieve modules
                        </Heading>
                        <Button
                            asChild
                            variant="cta"
                            size="small"
                            data-testid="dashboard-new-module">
                            <Link to="/muteer/modules/nieuw">
                                Nieuwe module
                            </Link>
                        </Button>
                    </div>

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
                            <Text>
                                Er zijn op dit moment geen actieve modules.
                            </Text>
                        )}
                    </div>

                    <Button asChild variant="secondary" size="small">
                        <Link to="/muteer/modules">Bekijk alle modules</Link>
                    </Button>
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
                    <Icon size={20} className="mr-4 text-pzh-blue-500" />
                    <Heading level="3" size="s" className="-mb-1.5">
                        {pluralCapitalize}
                    </Heading>
                </div>
                <div className="transition group-hover:translate-x-1">
                    <AngleRight size={18} className="text-pzh-green-500" />
                </div>
            </div>
        </Link>
    )
}

export default DashboardAdmin
