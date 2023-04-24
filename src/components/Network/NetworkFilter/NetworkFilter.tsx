import { FieldSelect } from '@pzh-ui/components'
import { MagnifyingGlass, Xmark } from '@pzh-ui/icons'
import { useMemo } from 'react'
import { ClearIndicatorProps, GroupBase } from 'react-select'

import { GraphVertice } from '@/api/fetchers.schemas'
import { ModelType } from '@/config/objects/types'
import useNetworkStore from '@/store/networkStore'
import {
    filterConnections,
    formatGraphData,
    highlightConnections,
    resetHighlightConnections,
} from '@/utils/d3'

interface NetworkFilterProps {
    containerRef: SVGSVGElement | null
    graph: ReturnType<typeof formatGraphData>
    setActiveNode: (node?: GraphVertice) => void
}

const NetworkFilter = ({
    containerRef,
    graph,
    setActiveNode,
}: NetworkFilterProps) => {
    const filters = useNetworkStore(state => state.filters)
    const selectedFilters = useNetworkStore(state => state.selectedFilters)
    const setSelectedFilters = useNetworkStore(
        state => state.setSelectedFilters
    )
    const amountOfFilters = useNetworkStore(
        state => state.selectedFilters?.length || 0
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
            filters.flatMap(filter =>
                filter.options.filter(option =>
                    selectedFilters?.includes(option.value)
                )
            ),
        [filters, selectedFilters]
    )

    /**
     * Handle change of select field
     */
    const handleChange = (e: typeof options[0]) => {
        if (!!e) {
            const node = graph.nodes.find(node => node.Code === e.value)

            if (!node || !containerRef) return

            const connectedLinks = filterConnections(graph.links, node)

            highlightConnections(containerRef, connectedLinks, node)
            setActiveNode(node)
        }
    }

    /**
     * Clear value of select field and reset connection higlight
     */
    const handleClear = (
        e: React.PropsWithChildren<
            ClearIndicatorProps<unknown, boolean, GroupBase<unknown>>
        >
    ) => {
        e.clearValue()
        setActiveNode(undefined)
        containerRef && resetHighlightConnections(containerRef)
    }

    return (
        <div className="flex">
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
                                    className="text-pzh-blue-dark"
                                />
                            </div>
                        ),
                        ClearIndicator: e => (
                            <button onClick={() => handleClear(e)}>
                                <Xmark className="m-2 text-pzh-gray-600" />
                            </button>
                        ),
                    }}
                    onChange={e => handleChange(e as typeof options[0])}
                />
            </div>
            <div className="relative ml-3 w-1/5 min-w-[250px]">
                <span className="absolute flex items-center justify-center z-1 pt-[4px] w-[24px] h-[24px] top-[-12px] right-[-12px] bg-pzh-blue-dark text-pzh-white rounded-full text-sm font-bold">
                    {amountOfFilters}
                </span>
                <FieldSelect
                    name="Filter"
                    placeholder="Filter op type"
                    options={filters}
                    value={defaultValue}
                    onChange={val =>
                        setSelectedFilters(
                            (val as { label: string; value: ModelType }[])?.map(
                                e => e.value
                            )
                        )
                    }
                    isMulti
                    isClearable={false}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                />
            </div>
        </div>
    )
}

export default NetworkFilter
