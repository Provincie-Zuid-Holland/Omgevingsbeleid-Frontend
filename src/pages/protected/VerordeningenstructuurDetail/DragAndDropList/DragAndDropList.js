/* istanbul ignore file */
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import AddSection from '../AddSection'
// import DragAndDropListNested from './../DragAndDropListNested'
import VerordeningObjectContent from '../VerordeningObjectContent'

function DragAndDropList({
    onDragEnd,
    items,
    userIsEditingOrder,
    userIsEditingSections,
    hoofdstukIndex,
    // verordeningID,
    // hoofdstukVolgnummer,
}) {
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
                <Droppable droppableId="droppable" type="droppableItem">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            className={
                                snapshot.isDraggingOver
                                    ? 'bg-gray-200'
                                    : 'bg-white'
                            }>
                            {items.map((item, index) => (
                                <Draggable
                                    isDragDisabled={!userIsEditingOrder}
                                    key={item.UUID}
                                    draggableId={item.UUID}
                                    index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            id="dnd-container"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}>
                                            <VerordeningObjectContent
                                                userIsDragging={
                                                    snapshot.isDragging
                                                }
                                                userIsEditing={
                                                    userIsEditingSections ||
                                                    userIsEditingOrder
                                                }
                                                item={item}
                                            />
                                            {/*
                                            <DragAndDropListNested
                                                hoofdstukVolgnummer={
                                                    hoofdstukVolgnummer
                                                }
                                                subVolgnummer={item.Volgnummer}
                                                userIsEditingSections={
                                                    userIsEditingSections
                                                }
                                                verordeningID={verordeningID}
                                                userIsEditingOrder={
                                                    userIsEditingOrder
                                                }
                                                subItems={item.Children}
                                                UUID={item.UUID}
                                                type={item.Type}
                                                hoofdstukIndex={hoofdstukIndex}
                                                nest_1={index}
                                            />
                                            */}
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

export default DragAndDropList
