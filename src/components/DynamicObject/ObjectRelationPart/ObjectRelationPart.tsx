import { Text } from '@pzh-ui/components'
import { PenToSquare } from '@pzh-ui/icons'
import classNames from 'classnames'

import { RelationShort } from '@/api/fetchers.schemas'

interface ObjectRelationPartProps extends RelationShort {
    /** Title of item */
    Title?: string
    /** Is last item */
    isLast?: boolean
    /** Gets called on click edit icon */
    handleEdit: () => void
}

const ObjectRelationPart = ({
    isLast,
    Object_Type,
    handleEdit,
    Title,
}: ObjectRelationPartProps) => (
    <div
        className={classNames(
            'grid grid-cols-8 px-4 py-1 border-t border-pzh-gray-300',
            {
                'border-b': isLast,
            }
        )}>
        <span className="col-span-2 capitalize truncate">{Object_Type}</span>
        <Text type="body-bold" className="col-span-5 truncate">
            {Title}
        </Text>
        <button
            type="button"
            onClick={handleEdit}
            className="col-span-1 ml-auto">
            <span className="sr-only">wijzigen</span>
            <PenToSquare size={20} />
        </button>
    </div>
)

export default ObjectRelationPart
