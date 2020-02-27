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
                                                {/* {item.Titel} */}
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

{
    /* <ul className="py-5">
    {this.state.voegSectieToeMode ? (
        <AddSection
            hoofdstukIndex={0}
            nest_1={null}
            nest_2={null}
            nest_3={null}
            type={'Hoofdstuk'}
        />
    ) : null}
    {this.state.lineage.Structuur.Children.map(
        (hoofdstuk, index) => (
            <React.Fragment>
                <li
                    onClick={() =>
                        this.changeActiveHoofdstuk(
                            hoofdstuk.Volgnummer
                        )
                    }
                    className={`px-5 hover:bg-gray-100 py-2 cursor-pointer ${
                        index !== 0
                            ? 'border-t border-gray-100'
                            : ''
                    }`}
                >
                    <h3 className="font-semibold text-gray-800">
                        {console.log(
                            hoofdstuk
                        )}
                        {hoofdstuk.Titel}
                    </h3>
                </li>
                {this.state
                    .voegSectieToeMode ? (
                    <AddSection
                        hoofdstukIndex={
                            index + 1
                        }
                        nest_1={null}
                        nest_2={null}
                        nest_3={null}
                        type={
                            hoofdstuk.Type
                        }
                    />
                ) : null}
            </React.Fragment>
        )
    )}
</ul> */
}

export default DragAndDropHoofdstukken
