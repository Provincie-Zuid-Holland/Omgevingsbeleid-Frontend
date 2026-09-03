import { useModulesGetListModules } from '@/api/fetchers'
import { LoaderCard } from '@/components/Loader'
import ModuleTile from '@/components/Modules/ModuleTile'
import { Button, Heading, Text } from '@pzh-ui/components'
import { keepPreviousData } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

const PAGE_LIMIT = 3

const Modules = () => {
    const { data: modules, isFetching: modulesLoading } =
        useModulesGetListModules(
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
        <>
            <div className="mb-4 flex items-center justify-between">
                <Heading level="3" size="m">
                    Actieve modules
                </Heading>
                <Button
                    asChild
                    variant="cta"
                    size="small"
                    data-testid="dashboard-new-module">
                    <Link to="/muteer/modules/nieuw">Nieuwe module</Link>
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
                    <Text>Er zijn op dit moment geen actieve modules.</Text>
                )}
            </div>

            <Button asChild variant="secondary" size="small">
                <Link to="/muteer/modules">Bekijk alle modules</Link>
            </Button>
        </>
    )
}

export default Modules
