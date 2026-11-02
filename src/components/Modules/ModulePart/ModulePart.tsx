import { Text, Tooltip } from '@pzh-ui/components'
import { TrashCan } from '@pzh-ui/icons'

import classNames from 'clsx'

import { ModelReturnTypeBasic } from '@/config/objects/types'
import { getObjectActionText } from '@/utils/dynamicObject'

interface ModulePartProps extends ModelReturnTypeBasic {
    /** Is last item */
    isLast?: boolean
    /** Gets called on click trash icon */
    handleRemove: () => void
}

const ModulePart = ({
    object_type,
    model,
    module_object_context: ModuleObjectContext,
    isLast,
    handleRemove,
}: ModulePartProps) => (
    <div
        className={classNames(
            'grid grid-cols-12 border-t border-pzh-gray-300 px-4 py-1',
            {
                'border-b': isLast,
            }
        )}
        data-testid="module-part">
        <span className="col-span-3 truncate capitalize">{object_type}</span>
        <Text bold className="col-span-7 truncate">
            {model.title}
        </Text>
        <span className="col-span-1 italic">
            {getObjectActionText(ModuleObjectContext?.action)}
        </span>
        <Tooltip label="Onderdeel niet (meer) meenemen in de module">
            <button
                type="button"
                onClick={handleRemove}
                className="col-span-1 ml-auto">
                <span className="sr-only">verwijderen</span>
                <TrashCan size={20} className="text-pzh-red-500" />
            </button>
        </Tooltip>
    </div>
)

export default ModulePart
