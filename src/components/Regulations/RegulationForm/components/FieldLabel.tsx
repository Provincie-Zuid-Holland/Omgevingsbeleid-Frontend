import { Text } from '@pzh-ui/components'
import { GripDotsVertical, Xmark } from '@pzh-ui/icons'
import classNames from 'clsx'

import { RegulationFieldProps } from './types'

const FieldLabel = ({
    name,
    label,
    handleRemove,
    isGroup,
    isDraggable,
    dragOptions,
}: Omit<RegulationFieldProps, 'index' | 'name'> & { name?: string }) => (
    <div
        className={classNames('flex justify-between', {
            'active:animate-pulse active:cursor-grabbing active:bg-pzh-blue-100/10':
                isDraggable,
        })}
        {...dragOptions}>
        <div className="flex items-center">
            {isDraggable && (
                <GripDotsVertical
                    size={16}
                    className="-mt-1 mr-2 w-2 cursor-grab text-pzh-blue-500 transition"
                />
            )}
            <Text as="label" htmlFor={name} bold>
                {label}
            </Text>
        </div>

        <button
            className="text-s text-pzh-green-500 underline"
            onClick={handleRemove}
            type="button">
            {isGroup ? (
                <Xmark className="text-pzh-blue-900" size={16} />
            ) : (
                `${label} verwijderen`
            )}
        </button>
    </div>
)

export default FieldLabel
