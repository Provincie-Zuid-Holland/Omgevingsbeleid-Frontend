import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Link } from 'react-router-dom'

import DragAndDropNestedNested from './../DragAndDropNestedNested'
import AddSection from './../AddSection'
import DndTitle from './../DndTitle'

function DragAndDropListNested({
    voegSectieToeMode,
    dragBool,
    subItems,
    verordeningID,
    hoofdstukVolgnummer,
    type,
    UUID,
    hoofdstukIndex,
    nest_1,
}) {
    return (
        <Droppable droppableId={UUID} type={`droppableSubItem`}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    className={
                        snapshot.isDraggingOver ? 'bg-gray-200' : 'bg-white'
                    }
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
                                                  nest_2={index}
                                                  nest_3={null}
                                                  type={item.Type}
                                              />
                                          ) : null}
                                          <Link
                                              to={`/muteer/verordeningen/${verordeningID}/${
                                                  item.Type
                                              }/${
                                                  item.UUID
                                              }?hoofdstuk=${hoofdstukIndex}&nest_1=${nest_1}&nest_2=${index}&nest_3=${null}`}
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              className={`w-full block bg-white hover:bg-gray-100 hover:border-b hover:border-t hover:border-gray-300
                                              ${
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
                                                  item={item}
                                                  hoofdstukVolgnummer={
                                                      hoofdstukVolgnummer
                                                  }
                                              />
                                              <DragAndDropNestedNested
                                                  hoofdstukVolgnummer={
                                                      hoofdstukVolgnummer
                                                  }
                                                  voegSectieToeMode={
                                                      voegSectieToeMode
                                                  }
                                                  verordeningID={verordeningID}
                                                  dragBool={dragBool}
                                                  subItems={item.Children}
                                                  UUID={item.UUID}
                                                  hoofdstukIndex={
                                                      hoofdstukIndex
                                                  }
                                                  nest_1={nest_1}
                                                  nest_2={index}
                                              />
                                          </Link>
                                          {voegSectieToeMode ? (
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

export default DragAndDropListNested
