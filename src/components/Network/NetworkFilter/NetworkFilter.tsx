import { FieldSelect, FieldSelectProps } from '@pzh-ui/components'
import { MagnifyingGlass, Xmark } from '@pzh-ui/icons'
import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'

import Filter from '@/components/Filter'
import { ModelType } from '@/config/objects/types'
import useFilterStore from '@/store/filterStore'
import useNetworkStore from '@/store/networkStore'
import {
    filterConnections,
    formatGraphData,
    highlightConnections,
    resetHighlightConnections,
} from '@/utils/d3'

interface NetworkFilterProps {
    graph: ReturnType<typeof formatGraphData>
    results?: number
}

const NetworkFilter = ({ graph, results }: NetworkFilterProps) => {
    const { setActiveNode, setActiveConnections } = useNetworkStore(
        useShallow(state => ({
            setActiveNode: state.setActiveNode,
            setActiveConnections: state.setActiveConnections,
        }))
    )
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

    const amountOfFilters = useMemo(
        () => selectedFilters?.network?.length || 0,
        [selectedFilters]
    )

    /**
     * Format options for search field
     */
    const options = useMemo(
        () =>
            graph.nodes.map(node => ({
                label: (
                    <div className="flex justify-between">
                        <span>{node.Title}</span>
                        <span className="capitalize opacity-50">
                            {node.Object_Type}
                        </span>
                    </div>
                ),
                value: node.Code,
            })),
        [graph.nodes]
    )

    /**
     * Set default value of object filter based on provided filters
     */
    const defaultValue = useMemo(
        () =>
            transformedFilters.flatMap(filter =>
                filter.options.filter(option =>
                    selectedFilters?.network.includes(option.value)
                )
            ),
        [transformedFilters, selectedFilters]
    )

    /**
     * Handle change of dropdown field
     */
    const handleDropdownChange = (
        val: { label: string; value: ModelType }[]
    ) => {
        if (val.length === 0) {
            setSelectedFilters(
                'network',
                filters.flatMap(filter =>
                    filter.options.map(option => option.value)
                )
            )
        } else {
            setSelectedFilters(
                'network',
                (val as { label: string; value: ModelType }[])?.map(
                    e => e.value
                )
            )
        }
    }

    /**
     * Handle change of select field
     */
    const handleChange = (e: (typeof options)[0]) => {
        if (!!e) {
            const node = graph.nodes.find(node => node.Code === e.value)

            if (!node) return

            const connectedLinks = filterConnections(graph.links, node)
            setActiveConnections(
                connectedLinks
                    .flatMap(connection => [
                        connection.source,
                        connection.target,
                    ])
                    .filter(connection => connection.Code !== node.Code)
            )

            highlightConnections(connectedLinks, node)
            setActiveNode(node)
        }
    }

    /**
     * Clear value of select field and reset connection higlight
     */
    const handleClear = (e: { clearValue: () => void }) => {
        e.clearValue()
        setActiveNode(undefined)
        resetHighlightConnections()
    }

    /**
     * Handle filtering of select field
     */
    const handleFilter: FieldSelectProps['filterOption'] = (
        option,
        inputValue
    ) => {
        const data = option.data as (typeof options)[0]
        const label = data.label.props.children[0].props.children as string

        if (
            label.toLowerCase().includes(inputValue.toLowerCase()) ||
            data.value.toLowerCase().includes(inputValue.toLowerCase())
        ) {
            return true
        }

        return false
    }

    return (
        <>
            <div className="flex flex-wrap sm:flex-nowrap">
                <div className="w-full">
                    <FieldSelect
                        name="Search"
                        placeholder="Zoek op titel van beleid"
                        options={options}
                        isClearable
                        components={{
                            DropdownIndicator: () => (
                                <div className="mr-4">
                                    <MagnifyingGlass
                                        size={18}
                                        className="text-pzh-blue-900"
                                    />
                                </div>
                            ),
                            ClearIndicator: e => (
                                <button onClick={() => handleClear(e)}>
                                    <Xmark className="m-2 text-pzh-gray-600" />
                                </button>
                            ),
                        }}
                        onChange={e => handleChange(e as (typeof options)[0])}
                        filterOption={handleFilter}
                    />
                </div>
                <Filter
                    filters={transformedFilters}
                    activeFilters={amountOfFilters}
                    defaultValue={defaultValue}
                    handleChange={val => handleDropdownChange(val)}
                    className="mt-2 w-full min-w-[250px] sm:ml-3 sm:mt-0 sm:w-1/5"
                />
            </div>
            {typeof results === 'number' && (
                <span className="mt-2 block text-s">
                    Er {results === 1 ? 'is' : 'zijn'} {results}{' '}
                    {results === 1 ? 'resultaat' : 'resultaten'} gevonden
                </span>
            )}
        </>
    )
}

export default NetworkFilter
