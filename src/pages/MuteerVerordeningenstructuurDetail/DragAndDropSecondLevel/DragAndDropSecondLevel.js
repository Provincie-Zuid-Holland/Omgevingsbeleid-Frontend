import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'

import DragAndDropThirdLevel from '../DragAndDropThirdLevel'
import AddSection from '../AddSection'
import VerordeningObjectContent from '../VerordeningObjectContent'

import VerordeningContext from './../VerordeningContext'

function DragAndDropSecondLevel({ subItems, UUID, type, nest_1 }) {
    const {
        userIsEditingOrder,
        userIsEditingSections,
        hoofdstukIndex,
        userIsAddingSections,
    } = React.useContext(VerordeningContext)
    return (
        <Droppable droppableId={UUID} type="secondLevel">
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    className={`transition-all px-0 ease-in duration-200
                                ${
                                    snapshot.isDraggingOver
                                        ? 'bg-gray-200'
                                        : 'bg-white'
                                }
                                ${userIsAddingSections ? 'px-5' : ''}
                            `}
                >
                    {subItems && subItems.length > 0
                        ? subItems
                              .filter((e) => e.Type !== 'Lid')
                              .map((item, index) => (
                                  <Draggable
                                      key={item.UUID}
                                      draggableId={item.UUID}
                                      index={index}
                                      isDragDisabled={!userIsEditingOrder}
                                  >
                                      {(provided, snapshot) => (
                                          <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                          >
                                              {index === 0 &&
                                              userIsEditingSections ? (
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
                                              <div
                                                  className={`bg-white ${
                                                      snapshot.isDragging
                                                          ? 'shadow-lg'
                                                          : ''
                                                  }`}
                                              >
                                                  <VerordeningObjectContent
                                                      item={item}
                                                      index={index}
                                                      pathToIndex={[
                                                          hoofdstukIndex,
                                                          nest_1,
                                                          index,
                                                      ]}
                                                      userIsEditingOrder={
                                                          userIsEditingOrder
                                                      }
                                                  />
                                                  <DragAndDropThirdLevel
                                                      subItems={item.Children}
                                                      UUID={item.UUID}
                                                      subVolgnummer={
                                                          item.Volgnummer
                                                      }
                                                      hoofdstukIndex={
                                                          hoofdstukIndex
                                                      }
                                                      nest_1={nest_1}
                                                      nest_2={index}
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
                              ))
                        : null}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    )
}

export default DragAndDropSecondLevel
