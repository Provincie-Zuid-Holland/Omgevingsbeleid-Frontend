import { Text } from '@pzh-ui/components'
import { Triangle } from '@pzh-ui/icons'
import classNames from 'classnames'

import { ModelType } from '@/config/objects/types'
import useNetworkStore from '@/store/networkStore'

const NetworkLegend = () => {
    const filters = useNetworkStore(state => state.filters)
    const selectedFilters = useNetworkStore(state => state.selectedFilters)
    const setSelectedFilters = useNetworkStore(
        state => state.setSelectedFilters
    )

    const handleClick = (val: ModelType) => {
        if (selectedFilters?.filter(e => e !== val).length === 0) {
            setSelectedFilters(
                filters.flatMap(filter =>
                    filter.options.map(option => option.value)
                )
            )
        } else if (selectedFilters?.includes(val)) {
            setSelectedFilters(selectedFilters.filter(e => e !== val))
        } else {
            setSelectedFilters(
                selectedFilters ? [...selectedFilters, val] : [val]
            )
        }
    }

    return (
        <div className="absolute right-5 bottom-5 py-3 px-4 bg-pzh-white shadow-card">
            {filters.map((group, index) => (
                <div
                    key={group.label}
                    className={classNames({ 'mt-1': index !== 0 })}>
                    <Text type="body-bold" className="mb-1 text-pzh-blue">
                        {group.label}
                    </Text>

                    {group.options.map(option => (
                        <button
                            key={option.value}
                            onClick={() => handleClick(option.value)}
                            className={classNames('flex items-baseline', {
                                'opacity-40 line-through':
                                    !selectedFilters?.includes(option.value),
                            })}>
                            {getIcon(option.value)}
                            <span>{option.label}</span>
                        </button>
                    ))}
                </div>
            ))}
        </div>
    )
}

const getIcon = (type: ModelType) => {
    switch (type) {
        case 'ambitie':
            return <Triangle className="text-pzh-apple-green mr-2" />
        case 'beleidsdoel':
            return (
                <div className="w-[12px] h-[12px] rounded-[2px] bg-pzh-orange mr-[11px]" />
            )
        case 'beleidskeuze':
            return (
                <div className="w-[12px] h-[12px] rounded-full bg-pzh-yellow mr-[11px]" />
            )
        case 'maatregel':
            return (
                <div className="w-[10px] h-[10px] rounded-[2px] rotate-[45deg] -translate-y-[2px] translate-x-[1px] bg-pzh-green mr-[11px]" />
            )
        default:
            return <div />
    }
}

export default NetworkLegend
