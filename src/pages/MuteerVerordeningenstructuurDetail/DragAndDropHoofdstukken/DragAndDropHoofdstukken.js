import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import AddSection from './../AddSection'

function DragAndDropHoofdstukken({
    onDragEnd,
    items,
    dragBool,
    voegSectieToeMode,
    hoofdstukIndex,
    changeActiveHoofdstuk,
}) {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            {voegSectieToeMode ? (
                <AddSection
                    hoofdstukIndex={0}
                    nest_1={null}
                    nest_2={null}
                    nest_3={null}
                    type={'Hoofdstuk'}
                />
            ) : null}
            <Droppable droppableId="droppable" type="hoofdstukItem">
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
                                            <div
                                                className={`py-3 px-5 font-semibold
                                                ${
                                                    snapshot.isDragging
                                                        ? ''
                                                        : 'hover:bg-gray-100 cursor-pointer'
                                                } 
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
                                                onClick={() => {
                                                    if (snapshot.isDragging)
                                                        return
                                                    changeActiveHoofdstuk(index)
                                                }}
                                            >
                                                {`Hoofdstuk ${item.Volgnummer} - ${item.Titel}`}
                                            </div>
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

export default DragAndDropHoofdstukken
