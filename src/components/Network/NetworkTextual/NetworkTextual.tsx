import { useUpdateEffect } from '@react-hookz/web'
import { useCallback, useMemo } from 'react'

import { OLDTable as Table } from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'

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
        state => ({
            ...state,
        })
    )
    const setActiveModal = useModalStore(state => state.setActiveModal)

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
            setActiveModal('objectDetails')
        },
        [graph, setActiveConnections, setActiveNode, setActiveModal]
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
            setActiveModal('objectDetails')
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

            <NetworkModal />
        </div>
    )
}

export default NetworkTextual
