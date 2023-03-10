import { Divider, Text } from '@pzh-ui/components'
import { CircleInfo, EllipsisVertical } from '@pzh-ui/icons'
import { useState } from 'react'

import { ModuleObjectShort } from '@/api/fetchers.schemas'
import Dropdown from '@/components/Dropdown'
import getModuleActionText from '@/utils/getModuleActionText'

const ModuleItem = ({
    Object_Type,
    Action,
    Title,
}: Partial<ModuleObjectShort>) => {
    const [isOpen, setIsOpen] = useState(false)

    const dropdownItems = [
        {
            text: 'Bewerken',
            link: '/',
        },
        {
            text: 'Verwijderen uit module',
            link: '/',
        },
    ]

    return (
        <div>
            <Divider />
            <div className="flex justify-between items-center">
                <div className="flex-1 pr-2 w-[90%]">
                    <div className="flex justify-between">
                        <Text
                            type="body-small"
                            className="text-pzh-gray-600 capitalize">
                            {Object_Type}
                        </Text>
                        <div className="flex items-center ">
                            <Text
                                type="body-small"
                                className="mr-1 text-pzh-gray-600">
                                {getModuleActionText(Action)}
                            </Text>
                            <CircleInfo className="-mt-1 text-pzh-gray-600" />
                        </div>
                    </div>
                    <Text type="body" className="truncate">
                        {Title}
                    </Text>
                </div>
                <div className="relative">
                    <button
                        className="flex items-center justify-center w-4"
                        onClick={() => setIsOpen(!isOpen)}>
                        <EllipsisVertical />
                    </button>
                    <Dropdown
                        items={dropdownItems}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        className="-right-2 mt-7"
                    />
                </div>
            </div>
        </div>
    )
}

export default ModuleItem
