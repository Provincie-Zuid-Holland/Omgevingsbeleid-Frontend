import { Divider, Text } from '@pzh-ui/components'
import { CircleInfo, EllipsisVertical } from '@pzh-ui/icons'

import { PolicyTitlesSingular } from '@/constants/policyObjects'

interface ModuleItemProps {
    type: PolicyTitlesSingular
    status: string
    title: string
}

const ModuleItem = ({ type, status, title }: ModuleItemProps) => (
    <div>
        <Divider />
        <div className="flex justify-between items-center">
            <div className="flex-1 pr-2 w-[90%]">
                <div className="flex justify-between">
                    <Text
                        type="body-small"
                        className="text-pzh-gray-600 capitalize">
                        {type}
                    </Text>
                    <div className="flex items-center ">
                        <Text
                            type="body-small"
                            className="mr-1 text-pzh-gray-600">
                            {status}
                        </Text>
                        <CircleInfo className="-mt-1 text-pzh-gray-600" />
                    </div>
                </div>
                <Text type="body" className="truncate">
                    {title}
                </Text>
            </div>
            <div>
                <button>
                    <EllipsisVertical />
                </button>
            </div>
        </div>
    </div>
)

export default ModuleItem
