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
        <div className="absolute bottom-5 right-5 bg-pzh-white px-4 py-3 shadow-card">
            {filters.map((group, index) => (
                <div
                    key={group.label}
                    className={classNames({ 'mt-1': index !== 0 })}>
                    <Text bold className="mb-1 text-pzh-blue-500">
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
            return <Triangle className="mr-2 text-pzh-apple-green-500" />
        case 'beleidsdoel':
            return (
                <div className="rounded-0.5 mr-[11px] h-3 w-3 bg-pzh-orange-500" />
            )
        case 'beleidskeuze':
            return (
                <div className="mr-[11px] h-3 w-3 rounded-full bg-pzh-yellow-500" />
            )
        case 'maatregel':
            return (
                <div className="rounded-0.5 mr-[11px] h-2.5 w-2.5 -translate-y-0.5 translate-x-px rotate-[45deg] bg-pzh-green-500" />
            )
        default:
            return <div />
    }
}

export default NetworkLegend
