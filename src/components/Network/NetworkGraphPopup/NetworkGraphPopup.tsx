import { Hyperlink, Text } from '@pzh-ui/components'
import { Xmark } from '@pzh-ui/icons'
import classNames from 'classnames'

import { GraphVertice } from '@/api/fetchers.schemas'
import { ModelType } from '@/config/objects/types'
import { generateObjectPath } from '@/utils/dynamicObject'

interface NetworkGraphPopupProps {
    activeNode?: GraphVertice
}

const NetworkGraphPopup = ({ activeNode }: NetworkGraphPopupProps) => (
    <div
        className={classNames(
            'absolute left-4 top-4 pt-2 pb-1 px-3 min-w-[300px] bg-pzh-white rounded-[4px] shadow-card',
            {
                hidden: !!!activeNode,
            }
        )}>
        <Text type="body-small" className="block capitalize">
            {activeNode?.Object_Type}
        </Text>
        <Hyperlink
            to={
                (activeNode &&
                    generateObjectPath(
                        activeNode.Object_Type as ModelType,
                        activeNode.UUID
                    )) ||
                ''
            }
            text={activeNode?.Title || ''}
        />
        <button className="absolute right-3 top-2" data-d3="reset">
            <Xmark size={18} />
            <span className="sr-only">Sluiten</span>
        </button>
    </div>
)

export default NetworkGraphPopup
