import React, { Component } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Link } from 'react-router-dom'

import DragAndDropListNested from './../DragAndDropListNested'
import AddSection from './../AddSection'
import DndTitle from './../DndTitle'

function DragAndDropList({
    onDragEnd,
    items,
    dragBool,
    voegSectieToeMode,
    hoofdstukIndex,
    verordeningID,
    hoofdstukVolgnummer,
}) {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            {voegSectieToeMode ? (
                <AddSection
                    hoofdstukIndex={hoofdstukIndex}
                    nest_1={0}
                    nest_2={null}
                    nest_3={null}
                    type={'Bovenste'}
                />
            ) : null}
            <Droppable droppableId="droppable" type="droppableItem">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        className={
                            snapshot.isDraggingOver ? 'bg-gray-200' : 'bg-white'
                        }
                    >
                        {items.map((item, index) => (
                            <Draggable
                                isDragDisabled={!dragBool}
                                key={item.UUID}
                                draggableId={item.UUID}
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <div id="dnd-container">
                                        <Link
                                            to={`/muteer/verordeningen/${verordeningID}/${
                                                item.Type
                                            }/${
                                                item.UUID
                                            }?hoofdstuk=${hoofdstukIndex}&nest_1=${index}&nest_2=${null}&nest_3=${null}`}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`w-full block bg-white hover:bg-gray-100 border-none hover:border-t hover:border-b hover:border-gray-300 ${
                                                snapshot.isDragging
                                                    ? 'shadow-lg'
                                                    : ''
                                            }`}
                                        >
                                            <DndTitle
                                                item={item}
                                                hoofdstukVolgnummer={
                                                    hoofdstukVolgnummer
                                                }
                                            />
                                            <DragAndDropListNested
                                                hoofdstukVolgnummer={
                                                    hoofdstukVolgnummer
                                                }
                                                voegSectieToeMode={
                                                    voegSectieToeMode
                                                }
                                                verordeningID={verordeningID}
                                                dragBool={dragBool}
                                                subItems={item.Children}
                                                UUID={item.UUID}
                                                type={item.Type}
                                                hoofdstukIndex={hoofdstukIndex}
                                                nest_1={index}
                                            />
                                        </Link>
                                        {voegSectieToeMode ? (
                                            <AddSection
                                                hoofdstukIndex={hoofdstukIndex}
                                                nest_1={index}
                                                nest_2={0}
                                                nest_3={null}
                                                type={item.Type}
                                            />
                                        ) : null}
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

export default DragAndDropList
