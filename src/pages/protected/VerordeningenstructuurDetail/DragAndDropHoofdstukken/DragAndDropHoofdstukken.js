/* istanbul ignore file */

import { FloppyDisk, Xmark } from '@pzh-ui/icons'
import { useContext } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import AddObjectButton from '../AddObjectButton'
import AddSection from '../AddSection'
import CrudDropdown from '../CrudDropdown'
import VerordeningContext from '../VerordeningContext'

function DragAndDropHoofdstukken({ hoofdstukItems, changeActiveChapter }) {
    const {
        patchRegulationObject,
        setVerordeningsObjectFromGET,
        verordeningsObjectFromGET,
        UUIDBeingEdited,
        setUUIDBeingEdited,
        setVolgnummerBeingEdited,
        setIndexArrayToUUIDBeingEdited,
        userIsEditingOrder,
        userIsEditingSections,
        onDragEnd,
    } = useContext(VerordeningContext)

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            {userIsEditingSections ? (
                <AddSection
                    hoofdstukIndex={0}
                    nest_1={null}
                    nest_2={null}
                    nest_3={null}
                    type={'Hoofdstuk'}
                />
            ) : null}
            <Droppable type="hoofdstukItem" droppableId="droppable">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        className={`py-1 
                            ${
                                snapshot.isDraggingOver
                                    ? 'bg-gray-200'
                                    : 'bg-white'
                            }
                        `}>
                        <div className="px-2 py-1">
                            <AddObjectButton nestType="Hoofdstuk" index={[0]} />
                        </div>
                        {hoofdstukItems.map((item, index) => (
                            <Draggable
                                isDragDisabled={!userIsEditingOrder}
                                key={item.UUID}
                                draggableId={item.UUID}
                                index={index}>
                                {(provided, snapshot) => (
                                    <div id="dnd-container">
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`w-full bg-white relative px-2 py-1 ${
                                                snapshot.isDragging
                                                    ? 'shadow-lg'
                                                    : ''
                                            }`}>
                                            <div className="relative">
                                                {verordeningsObjectFromGET &&
                                                verordeningsObjectFromGET.UUID ===
                                                    item.UUID ? (
                                                    <HoofdstukTitleEditing
                                                        patchRegulationObject={
                                                            patchRegulationObject
                                                        }
                                                        setUUIDBeingEdited={
                                                            setUUIDBeingEdited
                                                        }
                                                        setVerordeningsObjectFromGET={
                                                            setVerordeningsObjectFromGET
                                                        }
                                                        verordeningsObjectFromGET={
                                                            verordeningsObjectFromGET
                                                        }
                                                        snapshot={snapshot}
                                                        itemIndex={index}
                                                        item={item}
                                                    />
                                                ) : (
                                                    <HoofdstukTitle
                                                        snapshot={snapshot}
                                                        changeActiveChapter={
                                                            changeActiveChapter
                                                        }
                                                        itemIndex={index}
                                                        item={item}
                                                    />
                                                )}

                                                <CrudDropdown
                                                    UUIDBeingEdited={
                                                        UUIDBeingEdited
                                                    }
                                                    verordeningsObjectFromGET={
                                                        verordeningsObjectFromGET
                                                    }
                                                    item={item}
                                                    setUUIDBeingEdited={
                                                        setUUIDBeingEdited
                                                    }
                                                    setVolgnummerBeingEdited={
                                                        setVolgnummerBeingEdited
                                                    }
                                                    setIndexArrayToUUIDBeingEdited={
                                                        setIndexArrayToUUIDBeingEdited
                                                    }
                                                    pathToIndex={[index]}
                                                />
                                            </div>

                                            <AddObjectButton
                                                nestType="Hoofdstuk"
                                                index={[index + 1]}
                                            />
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

const HoofdstukTitleEditing = ({
    snapshot,
    patchRegulationObject,
    verordeningsObjectFromGET,
    setVerordeningsObjectFromGET,
    setUUIDBeingEdited,
}) => {
    return (
        <div
            className={`py-1 pl-5 font-bold rounded hover:bg-pzh-blue-super-light pr-1 bg-pzh-blue-super-light 
            ${snapshot.isDragging ? '' : 'hover:bg-gray-100 cursor-pointer'}`}>
            <div className="flex items-center">
                <span>Hoofdstuk</span>
                <input
                    type="text"
                    value={verordeningsObjectFromGET.Volgnummer}
                    onChange={e => {
                        setVerordeningsObjectFromGET({
                            type: 'changeValue',
                            value: e.target.value,
                            name: 'Volgnummer',
                        })
                    }}
                    id="form-inline-volgnummer"
                    className="inline-block w-12 mx-2 font-bold text-center form-input "
                />
                <span>-</span>
                <input
                    placeholder="Titel"
                    type="text"
                    id="form-inline-title"
                    value={verordeningsObjectFromGET.Titel}
                    onChange={e => {
                        setVerordeningsObjectFromGET({
                            type: 'changeValue',
                            value: e.target.value,
                            name: 'Titel',
                        })
                    }}
                    className="inline-block w-full ml-2 font-bold form-input "
                />
                <button
                    onClick={() => patchRegulationObject()}
                    className="flex items-center self-stretch justify-center px-3 ml-1 text-lg text-white bg-green-500 rounded hover:bg-pzh-green">
                    <FloppyDisk />
                </button>
                <button
                    className="flex items-center self-stretch justify-center px-3 ml-1 text-lg text-white rounded bg-pzh-blue hover:bg-pzh-blue-dark"
                    onClick={() => {
                        setUUIDBeingEdited(null)
                        setVerordeningsObjectFromGET({
                            type: 'cancel',
                        })
                    }}>
                    <Xmark />
                </button>
            </div>
        </div>
    )
}

const HoofdstukTitle = ({ snapshot, item, itemIndex, changeActiveChapter }) => {
    return (
        <div
            className={`py-3 pl-5 font-bold hover:bg-pzh-blue-super-light pr-12 bg-pzh-blue-super-light rounded 
            ${snapshot.isDragging ? '' : 'hover:bg-gray-100 cursor-pointer'} 
            `}
            onClick={() => {
                if (snapshot.isDragging) return
                changeActiveChapter(itemIndex)
                window.scrollTo(0, 0)
            }}>
            {`Hoofdstuk ${item.Volgnummer ? item.Volgnummer : ''} - ${
                item.Titel ? item.Titel : ''
            }`}
        </div>
    )
}

export default DragAndDropHoofdstukken
