/* istanbul ignore file */
/* eslint-disable */
// TODO: For now ESLint is disabled, because this file will be refactored in the future, based on a new data structure

import { Droppable, Draggable } from 'react-beautiful-dnd'

import DragAndDropThirdLevel from '../DragAndDropThirdLevel'
import AddSection from '../AddSection'
import VerordeningObjectContent from '../VerordeningObjectContent'
import AddObjectButton from '../AddObjectButton'

import VerordeningContext from '../VerordeningContext'
import { useContext } from 'react'

function DragAndDropSecondLevel({ subItems, UUID, nest_1 }) {
    const { userIsEditingOrder, userIsEditingSections, hoofdstukIndex } =
        useContext(VerordeningContext)

    const hasSubItems = subItems && subItems.length > 0
    if (!hasSubItems) return null

    return (
        <Droppable droppableId={UUID} type="secondLevel">
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    className={`transition-all ease-in duration-200 pl-5 
                                ${
                                    snapshot.isDraggingOver
                                        ? 'bg-gray-200'
                                        : 'bg-white'
                                }
                            `}>
                    {subItems
                        .filter(e => e.Type !== 'Lid')
                        .map((item, index) => (
                            <Draggable
                                key={item.UUID}
                                draggableId={item.UUID}
                                index={index}
                                isDragDisabled={!userIsEditingOrder}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}>
                                        {index === 0 &&
                                        userIsEditingSections ? (
                                            <AddSection
                                                hoofdstukIndex={hoofdstukIndex}
                                                nest_1={nest_1}
                                                nest_2={index}
                                                nest_3={null}
                                                type={item.Type}
                                            />
                                        ) : null}
                                        <div
                                            className={`bg-white ${
                                                snapshot.isDragging
                                                    ? 'shadow-lg'
                                                    : ''
                                            }`}>
                                            <VerordeningObjectContent
                                                item={item}
                                                index={index}
                                                pathToIndex={[
                                                    hoofdstukIndex,
                                                    nest_1,
                                                    index,
                                                ]}
                                            />
                                            <AddObjectButton
                                                nestType="subitems"
                                                item={item}
                                                index={[
                                                    hoofdstukIndex,
                                                    nest_1,
                                                    index,
                                                    0,
                                                ]}
                                            />
                                            <DragAndDropThirdLevel
                                                subItems={item.Children}
                                                UUID={item.UUID}
                                                subVolgnummer={item.Volgnummer}
                                                hoofdstukIndex={hoofdstukIndex}
                                                nest_1={nest_1}
                                                nest_2={index}
                                            />
                                            <AddObjectButton
                                                nestType="parallel"
                                                item={item}
                                                index={[
                                                    hoofdstukIndex,
                                                    nest_1,
                                                    index + 1,
                                                ]}
                                            />
                                            {userIsEditingSections ? (
                                                <AddSection
                                                    hoofdstukIndex={
                                                        hoofdstukIndex
                                                    }
                                                    nest_1={nest_1}
                                                    nest_2={index}
                                                    nest_3={null}
                                                    type={item.Type}
                                                />
                                            ) : null}
                                            {provided.placeholder}
                                        </div>
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

export default DragAndDropSecondLevel
