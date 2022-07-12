import { ArrowDownWideShort, ArrowUpWideShort } from '@pzh-ui/icons'

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

    const className = `ml-2 -mt-0.5 inline-block ${
        sorting.activeSorting === property ? 'text-gray-700' : 'text-gray-400'
    }`

    if (sorting[property as keyof typeof sorting]) {
        return <ArrowUpWideShort size={16} className={className} />
    }

    return <ArrowDownWideShort size={16} className={className} />
}

export default SortIcon
