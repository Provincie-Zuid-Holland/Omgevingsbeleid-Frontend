import { Text } from '@pzh-ui/components'

import {
    usePublicationActPackagesGet,
    usePublicationAnnouncementPackagesGet,
} from '@/api/fetchers'
import {
    PackageType,
    PublicationShort,
    PublicationVersion,
} from '@/api/fetchers.schemas'
import { LoaderCard } from '@/components/Loader'

import { PublicationType } from '../../types'
import Package from './Package'
import PackageCreate from './PackageCreate'

const config = {
    validation: {
        label: 'Validatie',
    },
    publication: {
        label: 'Publicatie',
    },
    fetcher: {
        act: usePublicationActPackagesGet,
        announcement: usePublicationAnnouncementPackagesGet,
    },
}

interface PackagesProps {
    version: PublicationVersion
    publication?: PublicationShort
    publicationType: PublicationType
    packageType: PackageType
}

const Packages = ({
    version,
    publication,
    publicationType,
    packageType,
}: PackagesProps) => {
    const { data, isFetching } = config.fetcher[publicationType](
        {
            version_uuid: version.UUID,
            limit: 100,
        },
        {
            query: {
                enabled: !!version.UUID,
                select: data =>
                    data.results
                        .filter(item => item.Package_Type === packageType)
                        .sort(
                            (a, b) =>
                                new Date(a.Created_Date + 'Z').getTime() -
                                new Date(b.Created_Date + 'Z').getTime()
                        ),
            },
        }
    )

    return (
        <div className="grid grid-cols-12 border-pzh-gray-200 first:border-b">
            <div className="col-span-3 p-6 pt-9">
                <Text bold className="heading-s" color="text-pzh-blue-500">
                    {config[packageType].label}
                </Text>
            </div>
            <div className="col-span-9 px-6 py-4">
                <div className="rounded-lg border border-pzh-gray-200">
                    {isFetching ? (
                        <LoaderCard mb="0" height="64" />
                    ) : !!!data?.length ? (
                        <PackageCreate
                            publication={publication}
                            packageType={packageType}
                        />
                    ) : (
                        <>
                            {data.slice(-3).map(item => (
                                <Package key={item.UUID} {...item} />
                            ))}
                            {!version.Is_Locked && (
                                <PackageCreate
                                    inline
                                    packageType={packageType}
                                    publication={publication}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Packages
