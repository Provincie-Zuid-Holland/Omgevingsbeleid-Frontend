import {
    faSortAmountUp,
    faSortAmountDown,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Properties = 'date' | 'title' | 'type'

interface SortIconProps {
    sorting: {
        title: boolean
        type: boolean
        status: boolean
        date: boolean
        activeSorting: Properties
    }
    property: Properties
}

/**
 *
 * @param {object} props
 * @param {object} props.sorting - Contains booleans on properties indicating state of the sorting, and the currently active filter
 * @param {object} props.property - Contains the property name of a sorting, so we can check if it is active or not
 * @returns An active/inactive sorting icon
 */
const SortIcon = ({ sorting, property }: SortIconProps) => {
    if (!sorting) return null

    return (
        <FontAwesomeIcon
            className={`ml-2 ${
                sorting.activeSorting === property
                    ? 'text-gray-700'
                    : 'text-gray-400'
            }`}
            icon={sorting[property] ? faSortAmountUp : faSortAmountDown}
        />
    )
}

export default SortIcon
