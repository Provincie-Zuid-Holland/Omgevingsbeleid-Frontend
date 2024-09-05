import { Button, Text } from '@pzh-ui/components'
import { PlusLight } from '@pzh-ui/icons'
import { useParams } from 'react-router-dom'

import { PackageType } from '@/api/fetchers.schemas'

import { useActions } from './actions'

interface PackageCreateProps {
    createPackage: ReturnType<typeof useActions>['createPackage']
    inline?: boolean
    packageType: PackageType
    isLocked?: boolean
}

const PackageCreate = ({
    createPackage,
    inline,
    packageType,
    isLocked,
}: PackageCreateProps) => {
    const { versionUUID } = useParams()

    const handleAction = () =>
        createPackage.mutate({
            versionUuid: String(versionUUID),
            data: { Package_Type: packageType },
        })

    if (inline) {
        return (
            <div className="flex bg-pzh-gray-100 px-6 py-4">
                <Button
                    onPress={handleAction}
                    isLoading={createPackage.isPending}
                    isDisabled={createPackage.isPending}
                    variant="default"
                    icon={PlusLight}
                    iconSize={19}
                    className="flex items-center gap-4 font-bold text-pzh-green-500 [&>svg]:-mt-1 [&>svg]:mr-0">
                    Nieuwe levering maken
                </Button>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
                <div className="after:content-[` `] flex h-[19px] w-[19px] items-center justify-center rounded-full border border-pzh-gray-600" />
                <Text
                    bold
                    className="heading-s -mb-1"
                    color={
                        !isLocked ? 'text-pzh-blue-500' : 'text-pzh-gray-300'
                    }>
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
                    isDisabled={createPackage.isPending || isLocked}
                    onPress={handleAction}
                    isLoading={createPackage.isPending}>
                    Maak levering
                </Button>
            </div>
        </div>
    )
}

export default PackageCreate
