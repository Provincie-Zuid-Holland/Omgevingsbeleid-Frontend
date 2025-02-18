import { Hyperlink, Text } from '@pzh-ui/components'
import { Xmark } from '@pzh-ui/icons'
import classNames from 'clsx'
import { Link } from 'react-router-dom'

import { ModelType } from '@/config/objects/types'
import useNetworkStore from '@/store/networkStore'
import { generateObjectPath } from '@/utils/dynamicObject'

const NetworkGraphPopup = () => {
    const activeNode = useNetworkStore(state => state.activeNode)

    return (
        <div
            className={classNames(
                'absolute left-4 top-4 min-w-[300px] rounded bg-pzh-white px-3 pb-1 pt-2 shadow-card',
                {
                    hidden: !!!activeNode,
                }
            )}>
            <Text className="block capitalize">{activeNode?.Object_Type}</Text>
            <Hyperlink asChild>
                <Link
                    to={
                        (activeNode &&
                            generateObjectPath(
                                activeNode.Object_Type as ModelType,
                                activeNode.UUID
                            )) ||
                        ''
                    }>
                    {activeNode?.Title}
                </Link>
            </Hyperlink>
            <button className="absolute right-3 top-2" data-d3="reset">
                <Xmark size={18} />
                <span className="sr-only">Sluiten</span>
            </button>
        </div>
    )
}

export default NetworkGraphPopup
