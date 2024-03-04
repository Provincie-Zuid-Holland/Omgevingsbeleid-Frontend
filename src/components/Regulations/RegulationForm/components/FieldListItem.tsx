import { FieldInputProps, FormikInput, Text } from '@pzh-ui/components'
import { GripDotsVertical, Xmark } from '@pzh-ui/icons'
import classNames from 'clsx'

import { ORDERED_LIST } from '../../constants'
import { RegulationFieldProps } from './types'

const FieldListItem = ({
    name,
    isDraggable,
    handleRemove,
    dragOptions,
    ...props
}: FieldInputProps & RegulationFieldProps) => (
    <div
        className={classNames('flex items-center gap-4', {
            'active:animate-pulse active:cursor-grabbing active:bg-pzh-blue-light/10':
                isDraggable,
        })}
        {...dragOptions}>
        {isDraggable && (
            <GripDotsVertical
                size={16}
                className="-mt-1 w-2 cursor-grab text-pzh-blue transition"
            />
        )}
        <Text
            as="label"
            bold
            htmlFor={`${name}.item`}
            className={classNames(
                'w-4 min-w-[16px] [counter-increment:list] before:font-bold',
                'numbering' in props &&
                    ORDERED_LIST[props.numbering as keyof typeof ORDERED_LIST]
            )}
        />
        <div className="w-full">
            <FormikInput name={`${name}.item`} {...props} />
        </div>
        <button
            className="text-s text-pzh-green underline"
            onClick={handleRemove}
            type="button">
            <Xmark className="text-pzh-blue-dark" size={16} />
        </button>
    </div>
)

export default FieldListItem
