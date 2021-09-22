/* istanbul ignore file */
import React from "react"

import {
    faSpinner,
    faChevronDown,
    faChevronUp,
} from "@fortawesome/pro-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Transition } from "@headlessui/react"

import FixedSidebarContainer from "./../FixedSidebarContainer"
import Werkingsgebied from "../ContainerCrudFields/Werkingsgebied"
import Artikel from "../ContainerCrudFields/Artikel"

const EditContentSidebar = ({
    verordeningsLedenFromGET,
    setVerordeningsLedenFromGET,
    users,
    setVerordeningsObjectFromGET,
    verordeningsObjectFromGET,
    verordeningsObjectIsLoading,
    UUIDBeingEdited,
    volgnummerBeingEdited,
}) => {
    const [
        inheritWerkingsgebiedenFromArtikel,
        setInheritWerkingsgebiedenFromArtikel,
    ] = React.useState(false)

    const hasLeden =
        verordeningsLedenFromGET && verordeningsLedenFromGET.length > 0

    const verordeningsObjectIsLoaded =
        UUIDBeingEdited &&
        !verordeningsObjectIsLoading &&
        verordeningsObjectFromGET !== null &&
        verordeningsObjectFromGET.Type === "Artikel"

    React.useEffect(() => {
        if (!verordeningsObjectIsLoaded) return

        // If leden all have a werkingsgebied and they are the same
        if (
            verordeningsLedenFromGET &&
            verordeningsLedenFromGET.every((e) => e.Gebied)
        ) {
            const werkingsgebiedLid = verordeningsLedenFromGET[0].Gebied
            const allLedenHaveSameGebied = verordeningsLedenFromGET.every(
                (e) => e.Gebied === werkingsgebiedLid
            )

            if (
                allLedenHaveSameGebied &&
                verordeningsObjectFromGET.Gebied === werkingsgebiedLid
            ) {
                setInheritWerkingsgebiedenFromArtikel(true)
            } else {
                setInheritWerkingsgebiedenFromArtikel(false)
            }
        }
    }, [
        verordeningsObjectIsLoaded,
        verordeningsLedenFromGET,
        verordeningsObjectFromGET,
    ])

    const getType = () => {
        if (verordeningsObjectIsLoaded) {
            return verordeningsObjectFromGET.Type
        } else {
            return null
        }
    }

    const currentType = getType()

    return (
        <FixedSidebarContainer
            elementID={"fixed-container-edit-content-sidebar"}
            show={verordeningsObjectIsLoaded}
        >
            <div className="relative">
                {verordeningsObjectIsLoading && verordeningsObjectFromGET ? (
                    <div className="absolute flex items-center justify-center w-full h-64">
                        <FontAwesomeIcon
                            className="text-gray-500 rotate-icon"
                            icon={faSpinner}
                        />
                    </div>
                ) : null}
                <Transition
                    show={!!verordeningsObjectIsLoaded}
                    enter="transition ease-out duration-100"
                    enterFrom="opacity-0 transform translate-x-2"
                    enterTo="opacity-100 transform translate-x-0"
                    leave="transition ease-in duration-75"
                    leaveFrom="opacity-100 transform translate-x-0"
                    leaveTo="opacity-0 transform translate-x-2"
                >
                    <React.Fragment>
                        {/* Return Artikel Edit Container */}
                        <ContentSidebarContainer
                            currentType={currentType}
                            volgnummerBeingEdited={volgnummerBeingEdited}
                        >
                            <Artikel
                                users={users}
                                setVerordeningsObjectFromGET={
                                    setVerordeningsObjectFromGET
                                }
                                verordeningsObjectFromGET={
                                    verordeningsObjectFromGET
                                }
                                setVerordeningsLedenFromGET={
                                    setVerordeningsLedenFromGET
                                }
                                hasLeden={hasLeden}
                                inheritWerkingsgebiedenFromArtikel={
                                    inheritWerkingsgebiedenFromArtikel
                                }
                                setInheritWerkingsgebiedenFromArtikel={
                                    setInheritWerkingsgebiedenFromArtikel
                                }
                            />
                        </ContentSidebarContainer>

                        {/* Return Leden  Edit Containers */}
                        {hasLeden && !inheritWerkingsgebiedenFromArtikel
                            ? verordeningsLedenFromGET.map((lid, index) => (
                                  <ContentSidebarContainer
                                      marginTop={true}
                                      currentType={"lid"}
                                      volgnummerBeingEdited={index + 1}
                                  >
                                      <div className="flex-grow inline-block w-full">
                                          <Werkingsgebied
                                              werkingsgebiedInParentState={
                                                  verordeningsLedenFromGET[
                                                      index
                                                  ].Gebied
                                              }
                                              setWerkingsgebiedInParentState={(
                                                  UUID
                                              ) =>
                                                  setVerordeningsLedenFromGET({
                                                      type: "changeValue",
                                                      value: UUID,
                                                      name: "Gebied",
                                                      index: index,
                                                  })
                                              }
                                          />
                                      </div>
                                  </ContentSidebarContainer>
                              ))
                            : null}
                    </React.Fragment>
                </Transition>
            </div>
        </FixedSidebarContainer>
    )
}

const ContentSidebarContainer = ({
    currentType,
    volgnummerBeingEdited,
    children,
    marginTop,
}) => {
    const [open, setOpen] = React.useState(true)

    return (
        <div className={`mb-5 rounded-b shadow-md ${marginTop ? "mt-5" : ""}`}>
            <div
                className={`flex items-center justify-between w-full p-4 font-bold text-white cursor-pointer bg-pzh-blue ${
                    open ? "rounded-t" : "rounded"
                }`}
                onClick={() => setOpen(!open)}
            >
                <span>
                    Eigenschappen
                    {" " + currentType + " " + volgnummerBeingEdited}
                </span>
                <FontAwesomeIcon
                    className="text-white"
                    icon={open ? faChevronDown : faChevronUp}
                />
            </div>
            <div
                className={`p-4 bg-white rounded-b ${
                    open ? "block" : "hidden"
                }`}
            >
                {children}
            </div>
        </div>
    )
}

export default EditContentSidebar
