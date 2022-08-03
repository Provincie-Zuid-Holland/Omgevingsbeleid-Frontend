/* istanbul ignore file */
/* eslint-disable */
// TODO: For now ESLint is disabled, because this file will be refactored in the future, based on a new data structure

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import DragAndDropSecondLevel from '../DragAndDropSecondLevel'
import AddSection from '../AddSection'
import VerordeningObjectContent from '../VerordeningObjectContent'
import AddObjectButton from '../AddObjectButton'

import VerordeningContext from '../VerordeningContext'
import { useContext } from 'react'

function DragAndDropFirstLevel({ itemsInHoofdstuk }) {
    const {
        onDragEnd,
        hoofdstukObject,
        items,
        userIsEditingOrder,
        userIsEditingSections,
        hoofdstukIndex,
        hoofdstukVolgnummer,
        addSectionType,
    } = useContext(VerordeningContext)

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
                            `}>
                            <div
                                className={`flex items-center font-bold pl-5 py-3 bg-pzh-blue-super-light text-gray-900 mb-2`}>
                                Hoofdstuk {hoofdstukVolgnummer} -{' '}
                                {hoofdstukObject.Titel}
                            </div>

                            <div className="pl-5">
                                <AddObjectButton
                                    nestType="childOfHoofdstuk"
                                    index={[hoofdstukIndex, 0]}
                                />
                            </div>

                            {itemsInHoofdstuk
                                .filter(e => e.Type !== 'Lid')
                                .map((item, index) => (
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
                                                <div
                                                    className={`bg-white pl-5 ${
                                                        snapshot.isDragging
                                                            ? 'shadow-lg'
                                                            : ''
                                                    }`}>
                                                    <VerordeningObjectContent
                                                        item={item}
                                                        index={index}
                                                        pathToIndex={[
                                                            hoofdstukIndex,
                                                            index,
                                                        ]}
                                                    />
                                                    <AddObjectButton
                                                        nestType="subitems"
                                                        item={item}
                                                        index={[
                                                            hoofdstukIndex,
                                                            index,
                                                            0,
                                                        ]}
                                                    />
                                                    <DragAndDropSecondLevel
                                                        parentType={item.Type}
                                                        subVolgnummer={
                                                            item.Volgnummer
                                                        }
                                                        subItems={item.Children}
                                                        UUID={item.UUID}
                                                        nest_1={index}
                                                    />
                                                    <AddObjectButton
                                                        nestType="parallel"
                                                        item={item}
                                                        index={[
                                                            hoofdstukIndex,
                                                            index + 1,
                                                        ]}
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
