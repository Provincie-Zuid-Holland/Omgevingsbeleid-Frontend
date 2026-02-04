import { Table } from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'
import { useCallback, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { GraphVertice } from '@/api/fetchers.schemas'
import NetworkModal from '@/components/Modals/NetworkModal'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import useModalStore from '@/store/modalStore'
import useNetworkStore from '@/store/networkStore'
import { filterConnections, formatGraphData } from '@/utils/d3'

interface NetworkTextualProps {
    graph: ReturnType<typeof formatGraphData>
}

const NetworkTextual = ({ graph }: NetworkTextualProps) => {
    const { activeNode, setActiveNode, setActiveConnections } = useNetworkStore(
        useShallow(state => ({
            activeNode: state.activeNode,
            setActiveNode: state.setActiveNode,
            setActiveConnections: state.setActiveConnections,
        }))
    )
    const setActiveModal = useModalStore(state => state.setActiveModal)

    /**
     * Function to sort column by Object_Type
     */
    const customSortType = (rowA: any, rowB: any, columnId: string) => {
        let [a, b] = [rowA.getValue(columnId), rowB.getValue(columnId)]

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
            setActiveModal('objectDetails')
        },
        [graph, setActiveConnections, setActiveNode, setActiveModal]
    )

    const [sortBy, setSortBy] = useState([
        {
            id: 'Title',
            desc: false,
        },
    ])

    /**
     * Setup Table columns
     */
    const columns = useMemo(
        () => [
            {
                header: 'Titel',
                accessorKey: 'Title',
            },
            {
                header: 'Type',
                accessorKey: 'Object_Type',
                sortingFn: customSortType,
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
                        <AngleRight className="ml-8" />
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
                state={{
                    sorting: sortBy,
                }}
                enableSortingRemoval={false}
                enableMultiSort={false}
                onSortingChange={setSortBy}
            />

            <NetworkModal />
        </div>
    )
}

export default NetworkTextual
