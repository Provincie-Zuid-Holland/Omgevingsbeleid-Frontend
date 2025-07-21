import { useMemo } from 'react'

import { useGraphGetFullGraph } from '@/api/fetchers'
import { GraphResponse } from '@/api/fetchers.schemas'
import { ModelType } from '@/config/objects/types'
import useFilterStore from '@/store/filterStore'
import useNetworkStore from '@/store/networkStore'
import { formatGraphData } from '@/utils/d3'

import NetworkFilter from '../NetworkFilter'
import NetworkTextual from '../NetworkTextual'
import NetworkVisual from '../NetworkVisual'

const NetworkGraph = () => {
    const selectedFilters = useFilterStore(
        state => state.selectedFilters.network
    )
    const activeTab = useNetworkStore(state => state.activeTab)

    const { data } = useGraphGetFullGraph()

    /**
     * Filter data based on selected filters
     */
    const filteredData = useMemo(
        () => ({
            Edges: data?.Edges,
            Vertices:
                selectedFilters && selectedFilters.length > 0
                    ? data?.Vertices.filter(vertice =>
                          selectedFilters?.includes(
                              vertice.Object_Type as ModelType
                          )
                      )
                    : data?.Vertices,
        }),
        [data, selectedFilters]
    ) as GraphResponse

    /**
     * Format connections for D3
     */
    const { links, nodes } = useMemo(
        () => formatGraphData(filteredData),
        [filteredData]
    )

    return (
        <div className="py-6">
            <NetworkFilter
                graph={{ links, nodes }}
                results={activeTab === 'textual' ? nodes.length : undefined}
            />
            {activeTab === 'visual' ? (
                <div className="border-pzh-gray-200 bg-pzh-white relative mt-3 h-[60vh] min-h-[600px] overflow-hidden rounded border">
                    <NetworkVisual graph={{ links, nodes }} />
                </div>
            ) : (
                <NetworkTextual graph={{ links, nodes }} />
            )}
        </div>
    )
}

export default NetworkGraph
