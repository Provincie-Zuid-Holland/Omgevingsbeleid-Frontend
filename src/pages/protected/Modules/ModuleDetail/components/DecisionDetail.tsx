import {
    usePublicationEnvironmentsGetDetailEnvironment,
    usePublicationVersionsGetDetailVersion,
} from '@/api/fetchers'
import { buildVersionTitle } from '@/pages/protected/Packages/config'
import { BackLink, Heading } from '@pzh-ui/components'
import { Link, Outlet, useParams } from 'react-router-dom'

const DecisionDetail = () => {
    const { moduleId, versionUUID } = useParams()

    const { data: version } = usePublicationVersionsGetDetailVersion(
        String(versionUUID),
        {
            query: {
                enabled: !!versionUUID,
            },
        }
    )

    const { data: environment } =
        usePublicationEnvironmentsGetDetailEnvironment(
            String(version?.Publication.Environment_UUID),
            {
                query: {
                    enabled: !!version?.Publication.Environment_UUID,
                },
            }
        )

    const title = buildVersionTitle(version, environment)

    return (
        <div className="col-span-6 flex flex-col gap-6">
            <div>
                <BackLink
                    asChild
                    className="text-s text-pzh-blue-500 inline-flex underline hover:no-underline">
                    <Link to={`/muteer/modules/${moduleId}/besluiten`}>
                        Terug naar het overzicht
                    </Link>
                </BackLink>
            </div>

            {version && (
                <Heading level="2" size="l">
                    {title}
                </Heading>
            )}

            <Outlet />
        </div>
    )
}

export default DecisionDetail
