import { Eye, Spinner } from '@pzh-ui/icons'
import classNames from 'classnames'

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
    <div className="relative mt-3 flex items-center justify-between border-b border-pzh-gray-300 pb-4">
        <div className="flex items-center">
            <div
                className={classNames(
                    'size-6 relative flex items-center justify-center rounded-full',
                    {
                        'after:content-[" "] after:size-3 bg-pzh-blue text-pzh-white after:absolute after:-left-1 after:-top-1 after:rounded-full after:border after:border-pzh-white after:bg-pzh-red':
                            hasNotification,
                        'bg-pzh-blue-light/50 text-pzh-blue': !hasNotification,
                    }
                )}>
                <span className="-mb-1 text-s font-bold">{amount}</span>
            </div>
            <span className="-mb-1 ml-3">{title}</span>
        </div>

        <button
            data-testid="object-relation-view"
            type="button"
            className="after:content-[' '] after:absolute after:left-0 after:top-0 after:h-full after:w-full"
            onClick={onClick}
            disabled={!canEdit}>
            {canEdit &&
                (isLoading ? (
                    <Spinner
                        size={14}
                        className="animate-spin text-pzh-gray-600"
                    />
                ) : (
                    <Eye size={18} className="text-pzh-green" />
                ))}
            <span className="sr-only">Bekijken</span>
        </button>
    </div>
)

export default ObjectRelationPart
