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
}

const ObjectRelationPart = ({
    title,
    isLoading,
    canEdit,
    amount = 0,
    hasNotification,
}: ObjectRelationPartProps) => (
    <div className="relative flex justify-between items-center mt-3 pb-4 border-b border-pzh-gray-300">
        <div className="flex items-center">
            <div
                className={classNames(
                    'relative flex justify-center items-center h-[24px] w-[24px] rounded-full',
                    {
                        'bg-pzh-blue text-pzh-white after:content-[" "] after:w-[12px] after:h-[12px] after:bg-pzh-red after:rounded-full after:absolute after:-top-[4px] after:-left-[4px] after:border after:border-pzh-white':
                            hasNotification,
                        'bg-pzh-blue-light/50 text-pzh-blue': !hasNotification,
                    }
                )}>
                <span className="-mb-[4px] text-[16px] font-bold">
                    {amount}
                </span>
            </div>
            <span className="-mb-[4px] ml-3">{title}</span>
        </div>

        <button
            type="button"
            className="after:content-[' '] after:absolute after:left-0 after:top-0 after:w-full after:h-full">
            {canEdit &&
                (isLoading ? (
                    <Spinner
                        size={14}
                        className="text-pzh-gray-600 animate-spin"
                    />
                ) : (
                    <Eye size={18} className="text-pzh-green" />
                ))}
            <span className="sr-only">Bekijken</span>
        </button>
    </div>
)

export default ObjectRelationPart
