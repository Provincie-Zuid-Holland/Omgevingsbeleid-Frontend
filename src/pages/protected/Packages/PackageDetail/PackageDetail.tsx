import {
    usePublicationActPackagesGet,
    usePublicationAnnouncementPackagesGet,
} from '@/api/fetchers'
import MutateLayout from '@/templates/MutateLayout'
import { Heading } from '@pzh-ui/components'
import { useParams } from 'react-router-dom'

const config = {
    title: 'Levering',
}

const PackageDetail = () => {
    const { type, uuid } = useParams()

    const useGetData =
        type === 'act'
            ? usePublicationActPackagesGet
            : usePublicationAnnouncementPackagesGet

    const { data } = useGetData(
        {
            version_uuid: uuid,
        },
        {
            query: {
                enabled: !!uuid,
            },
        }
    )

    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        { name: 'Leveringen', path: '/muteer/leveringen' },
        { name: config.title, isCurrent: true },
    ]

    return (
        <MutateLayout
            title={config.title}
            breadcrumbs={breadcrumbPaths}
            className="gap-y-6">
            <div className="col-span-6">
                <Heading size="xxl">{config.title}</Heading>
            </div>
        </MutateLayout>
    )
}

export default PackageDetail
