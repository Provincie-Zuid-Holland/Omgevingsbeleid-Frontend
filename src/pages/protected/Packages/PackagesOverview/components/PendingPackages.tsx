import { usePublicationPackagesGetListUnifiedPackages } from '@/api/fetchers'
import { PublicationEnvironment } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import PackageTile from '@/components/Publications/PublicationPackages/components/PackageTile'
import { Button, Heading, Text } from '@pzh-ui/components'
import { ArrowUpToLine } from '@pzh-ui/icons'
import { useNavigate } from 'react-router-dom'
import type { Filter } from './Filter'

const PAGE_LIMIT = 3

interface PendingPackagesProps extends PublicationEnvironment {
    setFilter: React.Dispatch<React.SetStateAction<Filter>>
}

const PendingPackages = ({ Title, UUID, setFilter }: PendingPackagesProps) => {
    const navigate = useNavigate()

    const { data, isFetching } = usePublicationPackagesGetListUnifiedPackages({
        limit: PAGE_LIMIT,
        environment_uuid: UUID,
        report_status: 'pending',
        sort_column: 'Created_Date',
        sort_order: 'DESC',
    })

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading level="2" size="xl">
                    In afwachting ({Title})
                </Heading>
                <Button
                    variant="cta"
                    icon={ArrowUpToLine}
                    iconSize={20}
                    isDisabled={!!!data?.results.length || isFetching}
                    isLoading={isFetching}>
                    Upload rapporten
                </Button>
            </div>

            {isFetching ? (
                <LoaderSpinner />
            ) : !!data?.results.length ? (
                <div className="grid grid-cols-3 gap-12">
                    {data.results.map(pkg => (
                        <PackageTile key={pkg.UUID} {...pkg} />
                    ))}
                </div>
            ) : (
                <Text size="s" className="italic" color="text-pzh-blue-500">
                    Er zijn momenteel geen leveringen in afwachting.
                </Text>
            )}

            {data && data?.total > PAGE_LIMIT && (
                <Button
                    size="small"
                    variant="secondary"
                    className="self-start"
                    onPress={() => {
                        navigate(
                            `/muteer/leveringen?environment=${UUID}&report_status=pending`
                        )
                        setFilter(() => ({
                            report_status: 'pending',
                            publication_type: undefined,
                            document_type: undefined,
                            package_type: undefined,
                            module_id: undefined,
                        }))

                        setTimeout(() => {
                            const element =
                                document.getElementById('packages-list')
                            element?.scrollIntoView({ behavior: 'smooth' })
                        }, 100)
                    }}>
                    Bekijk alle leveringen in afwachting
                </Button>
            )}
        </>
    )
}

export default PendingPackages
