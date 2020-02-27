import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import DragAndDropListNested from './../DragAndDropListNested'
import AddSection from './../AddSection'

function DragAndDropList({
    onDragEnd,
    items,
    dragBool,
    voegSectieToeMode,
    hoofdstukIndex,
    verordeningID,
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
                                            <Link
                                                to={`/muteer/verordeningen/${verordeningID}/${
                                                    item.UUID
                                                }?hoofdstuk=${hoofdstukIndex}&nest_1=${index}&nest_2=${null}&nest_3=${null}`}
                                                className={`py-3 px-5 font-semibold block
                                                ${
                                                    item.Type === 'Afdeling'
                                                        ? 'mbg-color text-white'
                                                        : ''
                                                } 
                                                ${
                                                    item.Type === 'Paragraaf'
                                                        ? 'text-blood-red'
                                                        : ''
                                                }`}
                                            >
                                                {item.Titel}
                                            </Link>
                                            <DragAndDropListNested
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
                                        </div>
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
