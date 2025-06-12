import { Text } from '@pzh-ui/components'
import { Triangle } from '@pzh-ui/icons'
import classNames from 'clsx'
import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { ModelType } from '@/config/objects/types'
import useFilterStore from '@/store/filterStore'

const NetworkLegend = () => {
    const { filters, selectedFilters, setSelectedFilters } = useFilterStore(
        useShallow(state => ({
            setSelectedFilters: state.setSelectedFilters,
            selectedFilters: state.selectedFilters,
            filters: state.filters,
        }))
    )

    const transformedFilters = useMemo(
        () =>
            filters
                .map(filter => {
                    const options = filter.options.filter(
                        option => !option.exclude?.includes('network')
                    )
                    return { ...filter, options }
                })
                .filter(filter => filter.options.length > 0),
        [filters]
    )

    const handleClick = (val: ModelType) => {
        if (selectedFilters?.network.filter(e => e !== val).length === 0) {
            setSelectedFilters(
                'network',
                transformedFilters.flatMap(filter =>
                    filter.options.map(option => option.value)
                )
            )
        } else if (selectedFilters?.network.includes(val)) {
            setSelectedFilters(
                'network',
                selectedFilters.network.filter(e => e !== val)
            )
        } else {
            setSelectedFilters(
                'network',
                selectedFilters.network
                    ? [...selectedFilters.network, val]
                    : [val]
            )
        }
    }

    return (
        <div className="bg-pzh-white shadow-card absolute right-5 bottom-5 px-4 py-3">
            {transformedFilters.map((group, index) => (
                <div
                    key={group.label}
                    className={classNames({ 'mt-1': index !== 0 })}>
                    <Text bold className="text-pzh-blue-500 mb-1">
                        {group.label}
                    </Text>

                    {group.options.map(option => (
                        <button
                            key={option.value}
                            onClick={() => handleClick(option.value)}
                            className={classNames('flex items-baseline', {
                                'line-through opacity-40':
                                    !selectedFilters?.network.includes(
                                        option.value
                                    ),
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
            return <Triangle className="text-pzh-apple-green-500 mr-2" />
        case 'beleidsdoel':
            return (
                <div className="rounded-0.5 bg-pzh-orange-500 mr-[11px] h-3 w-3" />
            )
        case 'beleidskeuze':
            return (
                <div className="bg-pzh-yellow-500 mr-[11px] h-3 w-3 rounded-full" />
            )
        case 'maatregel':
            return (
                <div className="rounded-0.5 bg-pzh-green-500 mr-[11px] h-2.5 w-2.5 translate-x-px -translate-y-0.5 rotate-[45deg]" />
            )
        default:
            return <div />
    }
}

export default NetworkLegend
