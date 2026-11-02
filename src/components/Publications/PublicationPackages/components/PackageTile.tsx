import { Badge, Button, Heading, Text } from '@pzh-ui/components'

import { Link } from 'react-router-dom'

import { DocumentType, UnifiedPackage } from '@/api/fetchers.schemas'
import { config } from '@/pages/protected/Packages/config'

import { getPackageStatus } from './utils'

const PackageTile = ({
    module_title,
    document_type,
    id,
    report_status,
    publication_type,
}: UnifiedPackage) => {
    const status = getPackageStatus(report_status)

    return (
        <Link
            to={`/muteer/leveringen/${publication_type}/${id}`}
            data-testid="dashboard-module-tile"
            className="group flex flex-col justify-between rounded border border-pzh-gray-200 p-6">
            <div className="mb-4">
                <Heading level="3" size="m">
                    {config.documentType[document_type as DocumentType].label}
                </Heading>
                <Text size="s" color="text-pzh-gray-600">
                    {module_title}
                </Text>
            </div>
            <div className="flex items-center justify-between">
                {!!status && (
                    <Badge
                        text={status.text}
                        variant={status.variant}
                        upperCase={false}
                        solid
                        className="whitespace-nowrap"
                    />
                )}
                <Button
                    variant="link"
                    size="small"
                    className="text-pzh-green-500 group-hover:text-pzh-green-900 group-hover:no-underline">
                    Bekijk levering
                </Button>
            </div>
        </Link>
    )
}

export default PackageTile
