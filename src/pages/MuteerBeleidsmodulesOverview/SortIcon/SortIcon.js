import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSortAmountUp,
    faSortAmountDown,
} from '@fortawesome/pro-solid-svg-icons'

const SortIcon = ({ sorting, property }) => {
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
