import { Eye, Spinner } from '@pzh-ui/icons'

import Indicator from '@/components/Indicator'

interface ObjectRelationPartProps {
    /** Title */
    title: string
    /** Is data loading */
    isLoading?: boolean
    /** User can edit relation */
    canEdit?: boolean
    /** Amount of relations */
    amount?: number
    /** Has notification */
    hasNotification?: boolean
    /** Handle click event */
    onClick: () => void
}

const ObjectRelationPart = ({
    title,
    isLoading,
    canEdit,
    amount = 0,
    hasNotification,
    onClick,
}: ObjectRelationPartProps) => (
    <div className="border-pzh-gray-300 relative mt-4 flex items-center justify-between border-b pb-4">
        <div className="flex items-center">
            <Indicator amount={amount} hasNotification={hasNotification} />
            <span className="ml-3">{title}</span>
        </div>

        <button
            data-testid="object-relation-view"
            type="button"
            className="after:content-[' '] after:absolute after:top-0 after:left-0 after:h-full after:w-full"
            onClick={onClick}
            disabled={!canEdit}>
            {canEdit &&
                (isLoading ? (
                    <Spinner
                        size={14}
                        className="text-pzh-gray-600 animate-spin"
                    />
                ) : (
                    <Eye size={18} className="text-pzh-green-500" />
                ))}
            <span className="sr-only">Bekijken</span>
        </button>
    </div>
)

export default ObjectRelationPart
