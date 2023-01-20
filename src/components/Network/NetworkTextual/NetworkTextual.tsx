import { faChevronRight } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Heading, Hyperlink, Modal, Text } from '@pzh-ui/components'
import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWindowSize } from 'react-use'

import { GetGraph200 } from '@/api/fetchers.schemas'
import networkGraphConnectionProperties from '@/constants/networkGraphConnectionProperties'
import networkGraphGenerateHref from '@/utils/networkGraphGenerateHref'

export interface NetworkTextualProps {
    graphData: GetGraph200 | null | undefined
    filters: any
    children?: React.ReactNode
}

function NetworkTextual({ graphData, filters, children }: NetworkTextualProps) {
    const { width } = useWindowSize()
    const isMobile = width <= 768

    const [filterQuery, setFilterQuery] = useState('')
    const [selectedRelations, setSelectedRelations] = useState<
        GetGraph200['nodes']
    >([])
    const [selectedObject, setSelectedObject] = useState<{
        UUID?: string
        Titel?: string
        Type?: string
    } | null>(null)

    const objectUUIDSWithARelation = graphData?.links?.reduce<string[]>(
        (acc, val) => {
            if (!acc.includes(val.source as string)) {
                acc.push(val.source as string)
            }
            if (!acc.includes(val.target as string)) {
                acc.push(val.target as string)
            }
            return acc
        },
        []
    )

    const objectsWithARelation = graphData?.nodes
        ?.filter(node =>
            objectUUIDSWithARelation?.includes(node.UUID as string)
        )
        .sort((a, b) => (a.Titel as string).localeCompare(b.Titel as string))

    const filteredObjects = objectsWithARelation
        ?.filter(obj => filters[obj.Type as string] === true)
        .filter(obj =>
            (obj.Titel?.toLowerCase() as string).includes(
                filterQuery.toLowerCase()
            )
        )

    const filteredObjectsLength = filteredObjects?.length

    useEffect(() => {
        // Get a list of the objects that have a relation with the selected object
        const objectsWithRelationUUIDS = graphData?.links
            ?.filter(
                link =>
                    link.source === selectedObject?.UUID ||
                    link.target === selectedObject?.UUID
            )
            .map(link => {
                if (link.source === selectedObject?.UUID) {
                    return link.target
                }
                return link.source
            })

        const objectsWithRelation = graphData?.nodes?.filter(node =>
            objectsWithRelationUUIDS?.includes(node.UUID as string)
        )

        setSelectedRelations(objectsWithRelation)
    }, [selectedObject, graphData])

    if (!graphData) return null

    return (
        <div className="pb-16">
            <SelectedObjModal
                selectedRelations={selectedRelations}
                setSelectedObject={setSelectedObject}
                selectedObject={selectedObject}
            />

            <div className="flex w-full mt-4 mb-2">
                <input
                    autoComplete="off"
                    className={`block w-full pl-4 pr-24 md:pr-4 pt-2 pb-1 text-gray-700 border border-pzh-gray-400 rounded appearance-none focus:outline-none`}
                    id="network-graph-search-query"
                    placeholder={
                        isMobile ? 'Filter' : 'Filter op titel van beleid'
                    }
                    type="text"
                    value={filterQuery}
                    onChange={event => setFilterQuery(event.target.value)}
                />
                {children}
            </div>
            <Text type="body-small">
                {filteredObjectsLength === 1
                    ? `Er is 1 resultaat gevonden`
                    : `Er zijn ${filteredObjectsLength} resultaten gevonden`}
            </Text>

            <div className="grid grid-cols-6 px-4 mt-6">
                <div className="col-span-4">
                    <Text type="body" className="bold">
                        Titel
                    </Text>
                </div>
                <div className="col-span-2">
                    <Text type="body" className="bold">
                        Type
                    </Text>
                </div>
            </div>

            {filteredObjects?.map(node => (
                <button
                    type="button"
                    className="grid block w-full grid-cols-6 px-4 py-2 text-left border-t border-gray-300 hover:bg-gray-200 focus:bg-gray-200"
                    key={node.UUID as string}
                    tabIndex={0}
                    onClick={() => setSelectedObject(node)}>
                    <div className="col-span-4">
                        <Text>{node.Titel as string}</Text>
                    </div>
                    <div className="flex items-center justify-between col-span-2">
                        <Text>{node.Type as string}</Text>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </div>
                </button>
            ))}
        </div>
    )
}

const SelectedObjModal = ({
    selectedObject,
    setSelectedObject,
    selectedRelations,
}: {
    selectedObject: any
    setSelectedObject: any
    selectedRelations: GetGraph200['nodes']
}) => {
    if (!selectedObject) return null

    const selectedObjectProperties =
        networkGraphConnectionProperties[
            selectedObject.Type as keyof typeof networkGraphConnectionProperties
        ]

    const modalText = `Een overzicht van de koppelingen van ${selectedObjectProperties?.prefix} ${selectedObjectProperties?.singular} '${selectedObject.Titel}'`
    const hrefSelectedObject =
        networkGraphGenerateHref({
            property:
                selectedObject.Type as keyof typeof networkGraphConnectionProperties,
            UUID: selectedObject.UUID as string,
        }) || ''
    return (
        <Modal
            closeButton
            open={selectedObject !== null}
            onClose={() => setSelectedObject(null)}
            ariaLabel={`Bekijk de koppelingen van ${selectedObject.Titel}`}>
            <Heading level="2">Details van object</Heading>
            <Text type="body">{modalText}</Text>

            <div className="my-4">
                {selectedRelations?.map(node => {
                    const hrefURL =
                        networkGraphGenerateHref({
                            property:
                                node.Type as keyof typeof networkGraphConnectionProperties,
                            UUID: node.UUID as string,
                        }) || ''

                    return (
                        <Link
                            className="grid block w-full grid-cols-6 px-4 py-2 border-t border-gray-300 hover:bg-gray-200 focus:bg-gray-200"
                            to={hrefURL}
                            key={node.UUID as string}>
                            <Text className="col-span-4 underline" type="body">
                                {node.Titel as string}
                            </Text>
                            <Text className="col-span-2" type="body">
                                {node.Type as string}
                            </Text>
                        </Link>
                    )
                })}
            </div>
            <Hyperlink
                text={`Bekijk de detailpagina van ${selectedObjectProperties.demonstrativePronoun} ${selectedObjectProperties.singular} in het digitaal omgevingsbeleid`}
                to={hrefSelectedObject}
            />
        </Modal>
    )
}

export default NetworkTextual
