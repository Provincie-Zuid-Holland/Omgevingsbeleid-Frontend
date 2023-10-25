import { Text } from '@pzh-ui/components'
import { Xmark } from '@pzh-ui/icons'
import { RegulationFieldProps } from './types'

const FieldLabel = ({
    name,
    label,
    handleRemove,
    isGroup,
}: Omit<RegulationFieldProps, 'index'>) => (
    <div className="flex justify-between">
        <Text as="label" htmlFor={name} bold>
            {label}
        </Text>
        <button
            className="text-s text-pzh-green underline"
            onClick={handleRemove}
            type="button">
            {isGroup ? (
                <Xmark className="text-pzh-blue-dark" size={16} />
            ) : (
                `${label} verwijderen`
            )}
        </button>
    </div>
)

export default FieldLabel
