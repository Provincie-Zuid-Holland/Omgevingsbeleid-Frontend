import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import DragAndDropSecondLevel from '../DragAndDropSecondLevel'
import AddSection from './../AddSection'
import VerordeningObjectContent from './../VerordeningObjectContent'

import VerordeningContext from './../VerordeningContext'

function DragAndDropFirstLevel({ itemsInHoofdstuk }) {
    const {
        onDragEnd,
        hoofdstukObject,
        items,
        userIsEditingOrder,
        userIsEditingSections,
        hoofdstukIndex,
        hoofdstukVolgnummer,
    } = React.useContext(VerordeningContext)

    return (
        <div className="p-3">
            <DragDropContext onDragEnd={onDragEnd}>
                {userIsEditingSections ? (
                    <AddSection
                        hoofdstukIndex={hoofdstukIndex}
                        nest_1={0}
                        nest_2={null}
                        nest_3={null}
                        type={'Bovenste'}
                    />
                ) : null}
                <Droppable droppableId={`0`} type={'firstLevel'}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            className={`
                                ${
                                    snapshot.isDraggingOver
                                        ? 'bg-gray-200'
                                        : 'bg-white'
                                }
                            `}
                        >
                            <div
                                className={`flex items-center font-semibold block pl-5 py-3 bg-primary-super-light text-gray-900 mb-2`}
                            >
                                Hoofdstuk {hoofdstukVolgnummer} -{' '}
                                {hoofdstukObject.Titel}
                            </div>
                            {itemsInHoofdstuk
                                .filter((e) => e.Type !== 'Lid')
                                .map((item, index) => (
                                    <Draggable
                                        isDragDisabled={!userIsEditingOrder}
                                        key={item.UUID}
                                        draggableId={item.UUID}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                id="dnd-container"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <div
                                                    className={`bg-white ${
                                                        snapshot.isDragging
                                                            ? 'shadow-lg'
                                                            : ''
                                                    }`}
                                                >
                                                    <VerordeningObjectContent
                                                        userIsEditingOrder={
                                                            userIsEditingOrder
                                                        }
                                                        item={item}
                                                        index={index}
                                                        pathToIndex={[
                                                            hoofdstukIndex,
                                                            index,
                                                        ]}
                                                    />
                                                    <DragAndDropSecondLevel
                                                        subVolgnummer={
                                                            item.Volgnummer
                                                        }
                                                        subItems={item.Children}
                                                        UUID={item.UUID}
                                                        type={item.Type}
                                                        nest_1={index}
                                                    />
                                                </div>
                                                {userIsEditingSections ? (
                                                    <AddSection
                                                        hoofdstukIndex={
                                                            hoofdstukIndex
                                                        }
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
        </div>
    )
}

export default DragAndDropFirstLevel
