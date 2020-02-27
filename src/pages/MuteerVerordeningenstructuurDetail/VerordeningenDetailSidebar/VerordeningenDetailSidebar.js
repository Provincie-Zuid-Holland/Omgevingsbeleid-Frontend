import React, { Component } from 'react'

import { faFolder } from '@fortawesome/free-regular-svg-icons'
import { faBook } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function ListItem({ UUID, Titel, children, changeActiveHoofdstuk, listIndex }) {
    return (
        <li
            key={UUID}
            className="mt-2 cursor-pointer"
            onClick={() => changeActiveHoofdstuk(listIndex)}
        >
            <FontAwesomeIcon
                className="absolute mt-1 left-0 text-gray-700"
                icon={faFolder}
            />
            <span className="text-sm text-gray-800 mb-4">{Titel}</span>
            {children}
        </li>
    )
}

function VerordeningenDetailSidebar({
    changeActiveHoofdstuk,
    dataLoaded,
    lineage,
}) {
    return (
        <div className="w-1/4 inline-block flex-grow">
            {dataLoaded ? (
                <div className="pl-6 relative">
                    <h1
                        className="text-sm text-gray-800 mb-4 cursor-pointer block"
                        onClick={() => changeActiveHoofdstuk(null)}
                    >
                        <FontAwesomeIcon
                            className="absolute mt-1 left-0  text-gray-700"
                            icon={faBook}
                        />
                        {lineage.Titel}
                    </h1>
                    <ul className="pl-6 relative">
                        {lineage.Structuur.Children.map((hoofdstuk, index) => (
                            <ListItem
                                listIndex={index}
                                changeActiveHoofdstuk={changeActiveHoofdstuk}
                                UUID={hoofdstuk.UUID}
                                key={hoofdstuk.UUID}
                                Titel={`Hoofdstuk ${hoofdstuk.Volgnummer} - 
                                    ${hoofdstuk.Titel}`}
                            >
                                {hoofdstuk.Children.length > 0 ? (
                                    <ul className="pl-6 relative">
                                        {hoofdstuk.Children.map(
                                            (child, index) => (
                                                <ListItem
                                                    listIndex={index}
                                                    changeActiveHoofdstuk={
                                                        changeActiveHoofdstuk
                                                    }
                                                    key={child.UUID}
                                                    UUID={child.UUID}
                                                    Titel={child.Titel}
                                                >
                                                    {child.Children.length >
                                                    0 ? (
                                                        <ul className="pl-6 relative">
                                                            {child.Children.map(
                                                                (
                                                                    childOfChild,
                                                                    index
                                                                ) => (
                                                                    <ListItem
                                                                        listIndex={
                                                                            index
                                                                        }
                                                                        changeActiveHoofdstuk={
                                                                            changeActiveHoofdstuk
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
                                                                            <ul className="pl-6 relative">
                                                                                {childOfChild.Children.map(
                                                                                    (
                                                                                        childOfChildofChild,
                                                                                        index
                                                                                    ) => (
                                                                                        <ListItem
                                                                                            listIndex={
                                                                                                index
                                                                                            }
                                                                                            changeActiveHoofdstuk={
                                                                                                changeActiveHoofdstuk
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
                                            )
                                        )}
                                    </ul>
                                ) : null}
                            </ListItem>
                        ))}
                    </ul>
                </div>
            ) : null}
        </div>
    )
}

export default VerordeningenDetailSidebar
