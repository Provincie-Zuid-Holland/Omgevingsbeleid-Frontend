import React, { useState, useEffect } from 'react'

import { faFolder, faFileAlt } from '@fortawesome/free-regular-svg-icons'
import { faBook } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function ListItem({
    UUID,
    Titel,
    item,
    children,
    changeActiveHoofdstuk,
    activeHoofdstuk,
    listIndex,
    hoofdstukVolgnummer,
    hasChildren,
}) {
    const [display, setDisplay] = useState(false)

    return (
        <li
            key={UUID}
            className={`mt-2 relative sidebar-line-horizontal
            ${hasChildren ? '' : 'sidebar-line-left-full'}
            ${
                item.Type !== 'Artikel' && hasChildren
                    ? 'cursor-pointer'
                    : 'cursor-default'
            }
            `}
        >
            <FontAwesomeIcon
                className={`${
                    item.Type === 'Artikel' ? 'ml-1' : ''
                } absolute mt-1 left-0 -ml-6 text-gray-700 bg-gray-100`}
                icon={item.Type === 'Artikel' ? faFileAlt : faFolder}
            />
            <span
                onClick={() => {
                    if (
                        item.Type === 'Hoofdstuk' &&
                        activeHoofdstuk !== listIndex
                    ) {
                        changeActiveHoofdstuk(listIndex)
                    } else if (
                        item.Type === 'Hoofdstuk' &&
                        activeHoofdstuk === listIndex
                    ) {
                        changeActiveHoofdstuk(null)
                    } else if (item.Type !== 'Artikel' && hasChildren) {
                        setDisplay(!display)
                    }
                }}
                className={`inline-block text-sm text-gray-800 ${
                    (hasChildren &&
                        item.Type === 'Hoofdstuk' &&
                        activeHoofdstuk === listIndex) ||
                    (display && hasChildren)
                        ? 'sidebar-line-left-span'
                        : ''
                }`}
            >
                {item.Type === 'Afdeling'
                    ? `Afdeling ${hoofdstukVolgnummer}.${item.Volgnummer} - `
                    : ''}
                {item.Type === 'Paragraaf'
                    ? `§ ${hoofdstukVolgnummer}.${item.Volgnummer} `
                    : ''}
                {item.Type === 'Artikel'
                    ? `Artikel ${hoofdstukVolgnummer}.${item.Volgnummer} `
                    : ''}

                {Titel}
            </span>
            {(activeHoofdstuk === listIndex && item.Type === 'Hoofdstuk') ||
            display
                ? children
                : null}
        </li>
    )
}

function VerordeningenDetailSidebar({
    activeHoofdstuk,
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
                    <ul className="sidebar-line-left pl-6 relative">
                        {lineage.Structuur.Children.map((hoofdstuk, index) => (
                            <ListItem
                                activeHoofdstuk={activeHoofdstuk}
                                hasChildren={hoofdstuk.Children.length > 0}
                                hoofdstukVolgnummer={hoofdstuk.Volgnummer}
                                listIndex={index}
                                item={hoofdstuk}
                                changeActiveHoofdstuk={changeActiveHoofdstuk}
                                UUID={hoofdstuk.UUID}
                                key={hoofdstuk.UUID}
                                Titel={`Hoofdstuk ${hoofdstuk.Volgnummer} - 
                                    ${hoofdstuk.Titel}`}
                            >
                                {hoofdstuk.Children.length > 0 ? (
                                    <ul className="sidebar-line-left pl-6 relative">
                                        {hoofdstuk.Children.map(
                                            (child, index) => (
                                                <ListItem
                                                    activeHoofdstuk={
                                                        activeHoofdstuk
                                                    }
                                                    hasChildren={
                                                        child.Children.length >
                                                        0
                                                    }
                                                    hoofdstukVolgnummer={
                                                        hoofdstuk.Volgnummer
                                                    }
                                                    item={child}
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
                                                        <ul className="sidebar-line-left pl-6 relative sidebar-line-left">
                                                            {child.Children.map(
                                                                (
                                                                    childOfChild,
                                                                    index
                                                                ) => (
                                                                    <ListItem
                                                                        activeHoofdstuk={
                                                                            activeHoofdstuk
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
                                                                            <ul className="sidebar-line-left pl-6 relative">
                                                                                {childOfChild.Children.map(
                                                                                    (
                                                                                        childOfChildofChild,
                                                                                        index
                                                                                    ) => (
                                                                                        <ListItem
                                                                                            activeHoofdstuk={
                                                                                                activeHoofdstuk
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
