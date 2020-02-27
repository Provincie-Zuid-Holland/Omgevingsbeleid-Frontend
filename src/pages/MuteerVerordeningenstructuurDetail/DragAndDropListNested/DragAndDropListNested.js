import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Link } from 'react-router-dom'

import DragAndDropNestedNested from './../DragAndDropNestedNested'
import AddSection from './../AddSection'

function DragAndDropListNested({
    voegSectieToeMode,
    dragBool,
    subItems,
    verordeningID,
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
                                          <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              className={`w-full bg-white ${
                                                  snapshot.isDragging
                                                      ? 'shadow-lg'
                                                      : ''
                                              } ${
                                                  item.Type === 'Artikel'
                                                      ? 'pl-10'
                                                      : ''
                                              } p-5`}
                                          >
                                              <Link
                                                  to={`/muteer/verordeningen/${verordeningID}/${
                                                      item.UUID
                                                  }?hoofdstuk=${hoofdstukIndex}&nest_1=${nest_1}&nest_2=${index}&nest_3=${null}`}
                                                  className={`font-bold ${
                                                      item.Type === 'Paragraaf'
                                                          ? 'text-blood-red'
                                                          : ''
                                                  }`}
                                              >
                                                  {item.Type === 'Paragraaf'
                                                      ? `§ ${item.Volgnummer} `
                                                      : ''}
                                                  {item.Type === 'Artikel'
                                                      ? `Artikel ${item.Volgnummer} `
                                                      : ''}
                                                  {item.Titel}
                                              </Link>
                                              <p>{item.Inhoud}</p>
                                              <DragAndDropNestedNested
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
                                          </div>
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
