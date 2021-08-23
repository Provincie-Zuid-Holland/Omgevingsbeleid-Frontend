/* istanbul ignore file */
import React, { useState, useEffect } from "react"

import {
    faFolder,
    faFileAlt,
    faFolderOpen,
} from "@fortawesome/pro-regular-svg-icons"
import { faBook } from "@fortawesome/pro-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function ListItem({
    UUID,
    Titel,
    item,
    children,
    changeActiveChapter,
    activeChapter,
    listIndex,
    hoofdstukVolgnummer,
    hasChildren,
}) {
    const [display, setDisplay] = useState(false)
    return (
        <li
            key={UUID}
            className={`mt-2 relative sidebar-line-horizontal
            ${hasChildren ? "" : "sidebar-line-left-full"}
            ${
                item.Type !== "Artikel" && hasChildren
                    ? "cursor-pointer"
                    : "cursor-default"
            }
            `}
        >
            <FontAwesomeIcon
                className={`${
                    item.Type === "Artikel" ? "ml-1" : ""
                } absolute mt-1 left-0 -ml-6 text-gray-700 bg-gray-100`}
                icon={
                    item.Type === "Artikel"
                        ? faFileAlt
                        : display ||
                          (item.Type === "Hoofdstuk" &&
                              activeChapter === listIndex)
                        ? faFolderOpen
                        : faFolder
                }
            />
            <span
                onClick={() => {
                    if (
                        item.Type === "Hoofdstuk" &&
                        activeChapter !== listIndex
                    ) {
                        changeActiveChapter(listIndex)
                    } else if (
                        item.Type === "Hoofdstuk" &&
                        activeChapter === listIndex
                    ) {
                        changeActiveChapter(null)
                    } else if (item.Type !== "Artikel" && hasChildren) {
                        setDisplay(!display)
                    }
                }}
                className={`inline-block text-sm text-gray-800 ${
                    (hasChildren &&
                        item.Type === "Hoofdstuk" &&
                        activeChapter === listIndex) ||
                    (display && hasChildren)
                        ? "sidebar-line-left-span"
                        : ""
                }`}
            >
                {item.Type === "Afdeling"
                    ? `Afdeling ${item.Volgnummer} - `
                    : ""}
                {item.Type === "Paragraaf" ? `§ ${item.Volgnummer} ` : ""}
                {item.Type === "Artikel" ? `Artikel ${item.Volgnummer} ` : ""}

                {Titel}
            </span>
            {(activeChapter === listIndex && item.Type === "Hoofdstuk") ||
            display
                ? children
                : null}
        </li>
    )
}

function VerordeningenDetailSidebar({
    activeChapter,
    changeActiveChapter,
    lineage,
}) {
    return (
        <div className="flex-grow inline-block w-1/4">
            <div className="relative pl-6">
                <h1
                    className="block mb-4 text-sm text-gray-800 cursor-pointer"
                    onClick={() => changeActiveChapter(null)}
                >
                    <FontAwesomeIcon
                        className="absolute left-0 mt-1 text-gray-700"
                        icon={faBook}
                    />
                    {lineage.Titel}
                </h1>
                <ul className="relative pl-6 sidebar-line-left">
                    {lineage.Structuur.Children.map((hoofdstuk, index) => (
                        <ListItem
                            activeChapter={activeChapter}
                            hasChildren={hoofdstuk.Children.length > 0}
                            hoofdstukVolgnummer={hoofdstuk.Volgnummer}
                            listIndex={index}
                            item={hoofdstuk}
                            changeActiveChapter={changeActiveChapter}
                            UUID={hoofdstuk.UUID}
                            key={hoofdstuk.UUID}
                            Titel={`Hoofdstuk ${hoofdstuk.Volgnummer} - 
                                    ${hoofdstuk.Titel}`}
                        >
                            {hoofdstuk.Children.length > 0 ? (
                                <ul className="relative pl-6 sidebar-line-left">
                                    {hoofdstuk.Children.map((child, index) => (
                                        <ListItem
                                            activeChapter={activeChapter}
                                            hasChildren={
                                                child.Children.length > 0
                                            }
                                            hoofdstukVolgnummer={
                                                hoofdstuk.Volgnummer
                                            }
                                            item={child}
                                            listIndex={index}
                                            changeActiveChapter={
                                                changeActiveChapter
                                            }
                                            key={child.UUID}
                                            UUID={child.UUID}
                                            Titel={child.Titel}
                                        >
                                            {child.Children.length > 0 ? (
                                                <ul className="relative pl-6 sidebar-line-left">
                                                    {child.Children.map(
                                                        (
                                                            childOfChild,
                                                            index
                                                        ) => (
                                                            <ListItem
                                                                activeChapter={
                                                                    activeChapter
                                                                }
                                                                hasChildren={
                                                                    childOfChild
                                                                        .Children
                                                                        .length >
                                                                    0
                                                                }
                                                                hoofdstukVolgnummer={
                                                                    hoofdstuk.Volgnummer
                                                                }
                                                                item={
                                                                    childOfChild
                                                                }
                                                                listIndex={
                                                                    index
                                                                }
                                                                changeActiveChapter={
                                                                    changeActiveChapter
                                                                }
                                                                key={
                                                                    childOfChild.UUID
                                                                }
                                                                UUID={
                                                                    childOfChild.UUID
                                                                }
                                                                Titel={
                                                                    childOfChild.Titel
                                                                }
                                                            >
                                                                {childOfChild
                                                                    .Children
                                                                    .length >
                                                                0 ? (
                                                                    <ul className="relative pl-6 sidebar-line-left">
                                                                        {childOfChild.Children.map(
                                                                            (
                                                                                childOfChildofChild,
                                                                                index
                                                                            ) => (
                                                                                <ListItem
                                                                                    activeChapter={
                                                                                        activeChapter
                                                                                    }
                                                                                    hasChildren={
                                                                                        childOfChildofChild
                                                                                            .Children
                                                                                            .length >
                                                                                        0
                                                                                    }
                                                                                    hoofdstukVolgnummer={
                                                                                        hoofdstuk.Volgnummer
                                                                                    }
                                                                                    listIndex={
                                                                                        index
                                                                                    }
                                                                                    item={
                                                                                        childOfChildofChild
                                                                                    }
                                                                                    changeActiveChapter={
                                                                                        changeActiveChapter
                                                                                    }
                                                                                    key={
                                                                                        childOfChildofChild.UUID
                                                                                    }
                                                                                    UUID={
                                                                                        childOfChildofChild.UUID
                                                                                    }
                                                                                    Titel={
                                                                                        childOfChildofChild.Titel
                                                                                    }
                                                                                />
                                                                            )
                                                                        )}
                                                                    </ul>
                                                                ) : null}
                                                            </ListItem>
                                                        )
                                                    )}
                                                </ul>
                                            ) : null}
                                        </ListItem>
                                    ))}
                                </ul>
                            ) : null}
                        </ListItem>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default VerordeningenDetailSidebar
