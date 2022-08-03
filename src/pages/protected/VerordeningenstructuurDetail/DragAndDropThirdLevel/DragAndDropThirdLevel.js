/* istanbul ignore file */
/* eslint-disable */
// TODO: For now ESLint is disabled, because this file will be refactored in the future, based on a new data structure

import { Droppable, Draggable } from 'react-beautiful-dnd'

import AddSection from '../AddSection'
import VerordeningObjectContent from '../VerordeningObjectContent'
import AddObjectButton from '../AddObjectButton'

import VerordeningContext from '../VerordeningContext'
import { useContext } from 'react'

function DragAndDropThirdLevel({ subItems, UUID, nest_1, nest_2 }) {
    const { userIsEditingOrder, userIsEditingSections, hoofdstukIndex } =
        useContext(VerordeningContext)

    return (
        <Droppable className="h-10" droppableId={UUID} type="thirdLevel">
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    className={`droppable-height pl-5
                            ${
                                snapshot.isDraggingOver
                                    ? 'bg-gray-200'
                                    : 'bg-white'
                            }
                            `}>
                    {subItems && subItems.length > 0
                        ? subItems
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
                                                      hoofdstukIndex={
                                                          hoofdstukIndex
                                                      }
                                                      nest_1={nest_1}
                                                      nest_2={nest_2}
                                                      nest_3={index}
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
                                                          nest_2,
                                                          index,
                                                      ]}
                                                  />
                                                  <AddObjectButton
                                                      nestType="parallel"
                                                      item={item}
                                                      index={[
                                                          hoofdstukIndex,
                                                          nest_1,
                                                          nest_2,
                                                          index + 1,
                                                      ]}
                                                  />
                                              </div>
                                              {index !== subItems.length - 1 &&
                                              userIsEditingSections ? (
                                                  <AddSection
                                                      hoofdstukIndex={
                                                          hoofdstukIndex
                                                      }
                                                      nest_1={nest_1}
                                                      nest_2={nest_2}
                                                      nest_3={index}
                                                      type={item.Type}
                                                  />
                                              ) : null}
                                              {provided.placeholder}
                                          </div>
                                      )}
                                  </Draggable>
                              ))
                        : null}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    )
}

export default DragAndDropThirdLevel
