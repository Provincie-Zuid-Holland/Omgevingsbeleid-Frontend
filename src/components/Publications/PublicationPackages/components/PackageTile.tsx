import { Badge, Button, Heading, Text } from '@pzh-ui/components'
import { Link } from 'react-router-dom'

import { DocumentType, UnifiedPackage } from '@/api/fetchers.schemas'
import { config } from '@/pages/protected/Packages/config'
import { getPackageStatus } from './utils'

const PackageTile = ({
    Module_Title,
    Document_Type,
    UUID,
    Report_Status,
    Publication_Type,
}: UnifiedPackage) => {
    const status = getPackageStatus(Report_Status)

    return (
        <Link
            to={`/muteer/leveringen/${Publication_Type}/${UUID}`}
            data-testid="dashboard-module-tile"
            className="group border-pzh-gray-200 flex flex-col justify-between rounded border p-6">
            <div className="mb-4">
                <Heading level="3" size="m">
                    {config.documentType[Document_Type as DocumentType].label}
                </Heading>
                <Text size="s" color="text-pzh-gray-600">
                    {Module_Title}
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
