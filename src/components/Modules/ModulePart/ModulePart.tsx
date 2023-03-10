import { Text, Tooltip } from '@pzh-ui/components'
import { TrashCan } from '@pzh-ui/icons'
import classNames from 'classnames'

import { ModuleObjectShort } from '@/api/fetchers.schemas'
import getModuleActionText from '@/utils/getModuleActionText'

interface ModulePartProps extends ModuleObjectShort {
    isLast?: boolean
    handleRemove: () => void
}

const ModulePart = ({
    Object_Type,
    Title,
    Action,
    isLast,
    handleRemove,
}: ModulePartProps) => (
    <div
        className={classNames(
            'grid grid-cols-12 px-4 py-1 border-t border-pzh-gray-300',
            {
                'border-b': isLast,
            }
        )}>
        <span className="col-span-2 capitalize truncate">{Object_Type}</span>
        <Text type="body" className="font-bold col-span-8 truncate">
            {Title}
        </Text>
        <span className="col-span-1 italic">{getModuleActionText(Action)}</span>
        <Tooltip label="Onderdeel niet (meer) meenemen in de module">
            <button
                type="button"
                onClick={handleRemove}
                className="col-span-1 ml-auto">
                <span className="sr-only">verwijderen</span>
                <TrashCan size={20} className="text-pzh-red" />
            </button>
        </Tooltip>
    </div>
)

export default ModulePart
