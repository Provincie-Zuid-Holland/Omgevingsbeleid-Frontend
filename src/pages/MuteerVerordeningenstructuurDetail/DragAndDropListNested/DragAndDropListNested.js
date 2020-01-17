import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

class DragAndDropListNested extends React.Component {
    render() {
        return (
            <Droppable droppableId={this.props.type} type={`droppableSubItem`}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        className={
                            snapshot.isDraggingOver ? 'bg-gray-200' : 'bg-white'
                        }
                    >
                        {this.props.subItems.map((item, index) => (
                            <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <div style={{ display: 'flex' }}>
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`w-full pl-8 p-5 bg-white ${
                                                snapshot.isDragging
                                                    ? 'shadow-lg'
                                                    : ''
                                            }`}
                                        >
                                            <h4 className="font-bold">
                                                {item.content}
                                            </h4>
                                            <p>{item.paragraph}</p>
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
        )
    }
}

export default DragAndDropListNested
