import {
    faSortAmountUp,
    faSortAmountDown,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface SortIconProps {
    sorting?: {
        activeSorting: string
    }
    property: string
}

const SortIcon = ({ sorting, property }: SortIconProps) => {
    if (!sorting) return null

    return (
        <FontAwesomeIcon
            className={`ml-2 ${
                sorting.activeSorting === property
                    ? 'text-gray-700'
                    : 'text-gray-400'
            }`}
            icon={
                sorting[property as keyof typeof sorting]
                    ? faSortAmountUp
                    : faSortAmountDown
            }
        />
    )
}

export default SortIcon
