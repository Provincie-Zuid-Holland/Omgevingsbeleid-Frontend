import { Button, Text } from '@pzh-ui/components'
import { PlusLight } from '@pzh-ui/icons'
import { useParams } from 'react-router-dom'

import { PackageType } from '@/api/fetchers.schemas'

import { useActions } from './actions'

interface PackageCreateProps {
    createPackage: ReturnType<typeof useActions>['createPackage']
    announcementUUID?: string
    inline?: boolean
    packageType: PackageType
    isLocked?: boolean
    isClosed?: boolean
}

const PackageCreate = ({
    createPackage,
    announcementUUID,
    inline,
    packageType,
    isLocked,
    isClosed,
}: PackageCreateProps) => {
    const { versionUUID } = useParams()

    const handleAction = () =>
        createPackage.mutateAsync({
            versionUuid: String(versionUUID),
            announcementUuid: String(announcementUUID),
            data: { Package_Type: packageType },
        })

    if (inline) {
        return (
            <div className="bg-pzh-gray-100 flex px-6 py-4">
                <Button
                    onPress={handleAction}
                    isLoading={createPackage.isPending}
                    isDisabled={createPackage.isPending}
                    variant="default"
                    icon={PlusLight}
                    iconSize={19}
                    className="text-pzh-green-500 flex items-center gap-4 font-bold [&>svg]:-mt-1 [&>svg]:mr-0">
                    Nieuwe levering maken
                </Button>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
                <div className="after:content-[` `] border-pzh-gray-600 flex h-[19px] w-[19px] items-center justify-center rounded-full border" />
                <Text
                    bold
                    className="heading-s -mb-1"
                    color="text-pzh-blue-500">
                    Levering maken
                </Text>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
                {createPackage.isPending && (
                    <Text size="s" className="text-pzh-gray-600">
                        Levering wordt gemaakt, dit kan even duren..
                    </Text>
                )}
                <Button
                    variant="cta"
                    size="small"
                    isDisabled={createPackage.isPending || isLocked || isClosed}
                    onPress={handleAction}
                    isLoading={createPackage.isPending}>
                    Maak levering
                </Button>
            </div>
        </div>
    )
}

export default PackageCreate
