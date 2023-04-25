import { useMemo } from 'react'

import { useFullGraphGet } from '@/api/fetchers'
import { GraphResponse } from '@/api/fetchers.schemas'
import { ModelType } from '@/config/objects/types'
import useNetworkStore from '@/store/networkStore'
import { formatGraphData } from '@/utils/d3'

import NetworkFilter from '../NetworkFilter'
import NetworkVisual from '../NetworkVisual'

const NetworkGraph = () => {
    const selectedFilters = useNetworkStore(state => state.selectedFilters)

    const { data } = useFullGraphGet()

    /**
     * Filter data based on selected filters
     */
    const filteredData = useMemo(
        () => ({
            Edges: data?.Edges,
            Vertices: data?.Vertices.filter(vertice =>
                selectedFilters?.includes(vertice.Object_Type as ModelType)
            ),
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
            <NetworkFilter graph={{ links, nodes }} />
            <div className="relative min-h-[600px] h-[60vh] mt-3 overflow-hidden bg-pzh-white rounded-[4px] border border-pzh-gray-200">
                <NetworkVisual graph={{ links, nodes }} />
            </div>
        </div>
    )
}

export default NetworkGraph
