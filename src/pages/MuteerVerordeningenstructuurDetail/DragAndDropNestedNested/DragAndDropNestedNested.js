import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Link } from 'react-router-dom'

import AddSection from './../AddSection'
import DndTitle from './../DndTitle'

function DragAndDropNestedNested({
    voegSectieToeMode,
    dragBool,
    subItems,
    verordeningID,
    hoofdstukVolgnummer,
    type,
    UUID,
    hoofdstukIndex,
    nest_1,
    nest_2,
}) {
    return (
        <Droppable
            className="h-10"
            droppableId={UUID}
            type={`droppableSubSubItem`}
        >
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    className={`droppable-height
                            ${
                                snapshot.isDraggingOver
                                    ? 'bg-gray-200'
                                    : 'bg-white'
                            }
                            `}
                >
                    {subItems && subItems.length > 0
                        ? subItems.map((item, index) => (
                              <Draggable
                                  key={item.UUID}
                                  draggableId={item.UUID}
                                  index={index}
                                  isDragDisabled={!dragBool}
                              >
                                  {(provided, snapshot) => (
                                      <div>
                                          {index === 0 && voegSectieToeMode ? (
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
                                          <Link
                                              to={`/muteer/verordeningen/${verordeningID}/${item.Type}/${item.UUID}?hoofdstuk=${hoofdstukIndex}&nest_1=${nest_1}&nest_2=${nest_2}&nest_3=${index}`}
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              className={`w-full block bg-white hover:bg-gray-100 ${
                                                  snapshot.isDragging
                                                      ? 'shadow-lg'
                                                      : ''
                                              } ${
                                                  item.Type === 'Artikel'
                                                      ? 'pl-5'
                                                      : ''
                                              } p-5`}
                                          >
                                              <DndTitle
                                                  href={`/muteer/verordeningen/${verordeningID}/${item.Type}/${item.UUID}?hoofdstuk=${hoofdstukIndex}&nest_1=${nest_1}&nest_2=${nest_2}&nest_3=${index}`}
                                                  item={item}
                                                  hoofdstukVolgnummer={
                                                      hoofdstukVolgnummer
                                                  }
                                              />
                                          </Link>
                                          {index !== subItems.length - 1 &&
                                          voegSectieToeMode ? (
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

export default DragAndDropNestedNested
