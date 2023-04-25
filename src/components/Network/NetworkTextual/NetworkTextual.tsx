import { Table } from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'
import { useCallback, useMemo, useState } from 'react'
import { useUpdateEffect } from 'react-use'

import { GraphVertice } from '@/api/fetchers.schemas'
import NetworkModal from '@/components/Modals/NetworkModal'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import useNetworkStore from '@/store/networkStore'
import { filterConnections, formatGraphData } from '@/utils/d3'

interface NetworkTextualProps {
    graph: ReturnType<typeof formatGraphData>
}

const NetworkTextual = ({ graph }: NetworkTextualProps) => {
    const activeNode = useNetworkStore(state => state.activeNode)
    const setActiveNode = useNetworkStore(state => state.setActiveNode)
    const setActiveConnections = useNetworkStore(
        state => state.setActiveConnections
    )

    const [open, setOpen] = useState(false)

    /**
     * Function to sort column by Object_Type
     */
    const customSortType = (rowA: any, rowB: any, columnId: string) => {
        let [a, b] = [rowA.values[columnId], rowB.values[columnId]]

        a = a ? a.props['data-value'] : null
        b = b ? b.props['data-value'] : null

        return a === b ? 0 : a > b ? 1 : -1
    }

    /**
     * Handle click on row
     */
    const handleClick = useCallback(
        (node: GraphVertice) => {
            const connectedLinks = filterConnections(graph.links, node)
            const connections = [
                ...new Set(
                    connectedLinks
                        .flatMap(connection => [
                            connection.source,
                            connection.target,
                        ])
                        .filter(connection => connection !== node.Code)
                ),
            ]
            const nodes = connections.map(connection =>
                graph.nodes.find(node => node.Code === connection)
            ) as GraphVertice[]

            setActiveConnections(nodes)

            setActiveNode(node)
            setOpen(true)
        },
        [graph, setActiveConnections, setActiveNode]
    )

    /**
     * If activeNode is changed by Search input, find connected links and open modal.
     */
    useUpdateEffect(() => {
        if (!open && activeNode) {
            const connectedLinks = filterConnections(graph.links, activeNode)
            const connections = [
                ...new Set(
                    connectedLinks
                        .flatMap(connection => [
                            connection.source,
                            connection.target,
                        ])
                        .filter(connection => connection !== activeNode.Code)
                ),
            ]
            const nodes = connections.map(connection =>
                graph.nodes.find(node => node.Code === connection)
            ) as GraphVertice[]

            setActiveConnections(nodes)
            setOpen(true)
        }
    }, [activeNode])

    const columns = useMemo(
        () => [
            {
                Header: 'Titel',
                accessor: 'Title',
            },
            {
                Header: 'Type',
                accessor: 'Object_Type',
                sortType: customSortType,
            },
        ],
        []
    )

    const formattedData = useMemo(
        () =>
            graph.nodes?.map(node => ({
                Title: node.Title,
                Object_Type: (
                    <span
                        data-value={node.Object_Type}
                        className="flex items-center justify-between">
                        {
                            models[node.Object_Type as ModelType].defaults
                                .singularCapitalize
                        }
                        <AngleRight />
                    </span>
                ),
                onClick: () => handleClick(node),
            })) || [],
        [graph, handleClick]
    )

    return (
        <div className="mt-5">
            <Table
                columns={columns}
                data={formattedData}
                // @ts-ignore
                disableSortRemove
                disableMultiSort
                initialState={{
                    // @ts-ignore
                    sortBy: [{ id: 'Title' }],
                }}
            />

            <NetworkModal isOpen={open} onClose={() => setOpen(false)} />
        </div>
    )
}

export default NetworkTextual
