import { Hyperlink, Text } from '@pzh-ui/components'
import { Xmark } from '@pzh-ui/icons'
import classNames from 'clsx'
import { Link } from 'react-router-dom'

import { ModelType } from '@/config/objects/types'
import useNetworkStore from '@/store/networkStore'
import { generateObjectPath } from '@/utils/dynamicObject'

interface NetworkGraphPopupProps {
    resetGraph: () => void
}

const NetworkGraphPopup = ({ resetGraph }: NetworkGraphPopupProps) => {
    const activeNode = useNetworkStore(state => state.activeNode)

    return (
        <div
            className={classNames(
                'bg-pzh-white shadow-card absolute top-4 left-4 min-w-[300px] rounded px-3 pt-2 pb-1',
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
            <button
                className="absolute top-2 right-3"
                data-d3="reset"
                onClick={resetGraph}>
                <Xmark size={18} />
                <span className="sr-only">Sluiten</span>
            </button>
        </div>
    )
}

export default NetworkGraphPopup
