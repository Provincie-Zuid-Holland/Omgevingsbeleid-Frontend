import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import DragAndDropListNested from './../DragAndDropListNested'

const static_items = [
    {
        id: '1',
        content: '§ Paragraaf 1',
        subItems: [
            {
                id: '10',
                content: 'Artikel 1.1',
                paragraph:
                    'Irure amet deserunt tempor occaecat laboris aliqua aute. Tempor anim do quis adipisicing cillum occaecat non. Reprehenderit Lorem consectetur consequat reprehenderit adipisicing. Dolor eiusmod enim id labore. Nulla commodo incididunt pariatur nisi eu labore consectetur in officia commodo laborum irure. Aliqua proident mollit Lorem qui incididunt occaecat elit.',
            },
            {
                id: '11',
                content: 'Artikel 1.2',
                paragraph:
                    'Ex tempor sint commodo consectetur. Officia eu consectetur dolor minim labore veniam mollit et anim mollit. Reprehenderit velit voluptate nulla fugiat proident velit amet commodo. Laborum ut Lorem esse officia nostrud aute adipisicing occaecat quis sunt.',
            },
        ],
    },
    {
        id: '2',
        content: '§ Paragraaf 2',
        subItems: [
            {
                id: '20',
                content: 'Artikel 2.1',
                paragraph:
                    'Aliqua exercitation adipisicing excepteur adipisicing reprehenderit sunt. Eiusmod irure est ipsum sint voluptate ex. Do tempor laborum nulla qui et qui commodo qui labore magna mollit sunt. Labore in ut nisi dolore officia. Sint sunt in eiusmod velit.',
            },
            {
                id: '21',
                content: 'Artikel 2.2',
                paragraph:
                    'Magna nisi qui Lorem tempor nostrud ipsum sint sit officia ex dolor deserunt. Anim labore voluptate pariatur nisi ipsum do fugiat ea consequat adipisicing voluptate pariatur cillum sit. Proident minim irure aliquip duis. Eu proident veniam elit aliqua. Ipsum ullamco ad nulla adipisicing aliquip occaecat ea cillum fugiat.',
            },
            {
                id: '22',
                content: 'Artikel 2.3',
                paragraph:
                    'JOEEE Anim labore voluptate pariatur nisi ipsum do fugiat ea consequat adipisicing voluptate pariatur cillum sit. Proident minim irure aliquip duis. Eu proident veniam elit aliqua. Ipsum ullamco ad nulla adipisicing aliquip occaecat ea cillum fugiat.',
            },
        ],
    },
]

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
}

class DragAndDropList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: static_items,
        }
        this.onDragEnd = this.onDragEnd.bind(this)
    }

    onDragEnd(result) {
        console.log(result)
        if (!result.destination) {
            return
        }

        const sourceIndex = result.source.index
        const destIndex = result.destination.index

        if (result.type === 'droppableItem') {
            console.log('Niveau 1')
            const items = reorder(this.state.items, sourceIndex, destIndex)

            this.setState({
                items,
            })
        } else if (result.type === 'droppableSubItem') {
            console.log('Niveau 2')
            const itemSubItemMap = this.state.items.reduce((acc, item) => {
                acc[item.id] = item.subItems
                return acc
            }, {})

            const sourceParentId = parseInt(result.source.droppableId)
            const destParentId = parseInt(result.destination.droppableId)

            const sourceSubItems = itemSubItemMap[sourceParentId]
            const destSubItems = itemSubItemMap[destParentId]

            let newItems = [...this.state.items]

            if (sourceParentId === destParentId) {
                const reorderedSubItems = reorder(
                    sourceSubItems,
                    sourceIndex,
                    destIndex
                )
                console.log('reorderedSubItems')
                console.log(reorderedSubItems)
                newItems = newItems.map(item => {
                    if (parseInt(item.id) === sourceParentId) {
                        item.subItems = reorderedSubItems
                    }
                    return item
                })
                this.setState({
                    items: newItems,
                })
            } else {
                let newSourceSubItems = [...sourceSubItems]
                const [draggedItem] = newSourceSubItems.splice(sourceIndex, 1)

                let newDestSubItems = [...destSubItems]
                newDestSubItems.splice(destIndex, 0, draggedItem)
                newItems = newItems.map(item => {
                    if (parseInt(item.id) === sourceParentId) {
                        item.subItems = newSourceSubItems
                    } else if (parseInt(item.id) === destParentId) {
                        item.subItems = newDestSubItems
                    }
                    return item
                })
                this.setState({
                    items: newItems,
                })
            }
        }
    }

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable" type="droppableItem">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            className={
                                snapshot.isDraggingOver
                                    ? 'bg-gray-200'
                                    : 'bg-white'
                            }
                        >
                            {this.state.items.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div>
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`w-full bg-white ${
                                                    snapshot.isDragging
                                                        ? 'shadow-lg'
                                                        : ''
                                                }`}
                                            >
                                                <div className="pb-2 pt-8 px-5 text-red-700 font-semibold">
                                                    {item.content}
                                                </div>
                                                <DragAndDropListNested
                                                    subItems={item.subItems}
                                                    type={item.id}
                                                />
                                            </div>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        )
    }
}

export default DragAndDropList
