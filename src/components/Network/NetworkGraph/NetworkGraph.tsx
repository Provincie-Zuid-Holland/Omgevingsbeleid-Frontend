import { useMemo } from 'react'

import { useFullGraphGet } from '@/api/fetchers'
import { GraphResponse } from '@/api/fetchers.schemas'
import { ModelType } from '@/config/objects/types'
import useFilterStore from '@/store/filterStore'
import useNetworkStore from '@/store/networkStore'
import { formatGraphData } from '@/utils/d3'

import NetworkFilter from '../NetworkFilter'
import NetworkTextual from '../NetworkTextual'
import NetworkVisual from '../NetworkVisual'

const NetworkGraph = () => {
    const selectedFilters = useFilterStore(state => state.selectedFilters)
    const activeTab = useNetworkStore(state => state.activeTab)

    const { data } = useFullGraphGet()

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
                <div className="relative min-h-[600px] h-[60vh] mt-3 overflow-hidden bg-pzh-white rounded-[4px] border border-pzh-gray-200">
                    <NetworkVisual graph={{ links, nodes }} />
                </div>
            ) : (
                <NetworkTextual graph={{ links, nodes }} />
            )}
        </div>
    )
}

export default NetworkGraph
