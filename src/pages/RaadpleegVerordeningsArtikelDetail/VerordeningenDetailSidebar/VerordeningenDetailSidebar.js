import React, { useState } from 'react'

import {
    faMinusSquare,
    faFileAlt,
    faPlusSquare,
} from '@fortawesome/free-regular-svg-icons'
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
    selectArtikel,
    hoofdstukIndex,
    nest_1,
    nest_2,
    nest_3,
}) {
    const [display, setDisplay] = useState(false)
    return (
        <li key={UUID} className={`mt-2 relative`}>
            <div
                className="cursor-pointer"
                onClick={() => {
                    selectArtikel(
                        item.Type,
                        hoofdstukIndex,
                        nest_1,
                        nest_2,
                        nest_3
                    )

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
            >
                <FontAwesomeIcon
                    className={`${
                        item.Type === 'Artikel' ? 'ml-1' : ''
                    } absolute mt-1 left-0 -ml-6 text-gray-700 bg-gray-100`}
                    icon={
                        item.Type === 'Artikel'
                            ? faFileAlt
                            : display ||
                              (item.Type === 'Hoofdstuk' &&
                                  activeHoofdstuk === listIndex)
                            ? faMinusSquare
                            : faPlusSquare
                    }
                />
                <span className={`inline-block text-sm text-gray-800`}>
                    {item.Type === 'Afdeling'
                        ? `${hoofdstukVolgnummer}.${item.Volgnummer} ${Titel} `
                        : ''}
                    {item.Type === 'Paragraaf'
                        ? `§ ${hoofdstukVolgnummer}.${item.Volgnummer} ${Titel}`
                        : ''}
                    {item.Type === 'Artikel'
                        ? `Artikel ${hoofdstukVolgnummer}.${item.Volgnummer} - ${Titel}`
                        : ''}

                    {item.Type === 'Hoofdstuk' ? Titel : ''}
                </span>
            </div>
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
    selectArtikel,
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
                    <ul className="relative">
                        {lineage.Structuur.Children.map(
                            (hoofdstuk, hoofdstukIndex) => (
                                <ListItem
                                    selectArtikel={selectArtikel}
                                    activeHoofdstuk={activeHoofdstuk}
                                    hasChildren={hoofdstuk.Children.length > 0}
                                    hoofdstukVolgnummer={hoofdstuk.Volgnummer}
                                    listIndex={hoofdstukIndex}
                                    hoofdstukIndex={hoofdstukIndex}
                                    nest_1={null}
                                    nest_2={null}
                                    nest_3={null}
                                    item={hoofdstuk}
                                    changeActiveHoofdstuk={
                                        changeActiveHoofdstuk
                                    }
                                    UUID={hoofdstuk.UUID}
                                    key={hoofdstuk.UUID}
                                    Titel={`Hoofdstuk ${hoofdstuk.Volgnummer} - 
                                    ${hoofdstuk.Titel}`}
                                >
                                    {hoofdstuk.Children.length > 0 ? (
                                        <ul className="pl-6 relative">
                                            {hoofdstuk.Children.map(
                                                (child, nest_1) => (
                                                    <ListItem
                                                        selectArtikel={
                                                            selectArtikel
                                                        }
                                                        activeHoofdstuk={
                                                            activeHoofdstuk
                                                        }
                                                        hasChildren={
                                                            child.Children
                                                                .length > 0
                                                        }
                                                        hoofdstukVolgnummer={
                                                            hoofdstuk.Volgnummer
                                                        }
                                                        item={child}
                                                        listIndex={nest_1}
                                                        hoofdstukIndex={
                                                            hoofdstukIndex
                                                        }
                                                        nest_1={nest_1}
                                                        nest_2={null}
                                                        nest_3={null}
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
                                                                        nest_2
                                                                    ) => (
                                                                        <ListItem
                                                                            selectArtikel={
                                                                                selectArtikel
                                                                            }
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
                                                                                nest_2
                                                                            }
                                                                            hoofdstukIndex={
                                                                                hoofdstukIndex
                                                                            }
                                                                            nest_1={
                                                                                nest_1
                                                                            }
                                                                            nest_2={
                                                                                nest_2
                                                                            }
                                                                            nest_3={
                                                                                null
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
                                                                                            nest_3
                                                                                        ) => (
                                                                                            <ListItem
                                                                                                selectArtikel={
                                                                                                    selectArtikel
                                                                                                }
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
                                                                                                    nest_3
                                                                                                }
                                                                                                hoofdstukIndex={
                                                                                                    hoofdstukIndex
                                                                                                }
                                                                                                nest_1={
                                                                                                    nest_1
                                                                                                }
                                                                                                nest_2={
                                                                                                    nest_2
                                                                                                }
                                                                                                nest_3={
                                                                                                    nest_3
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
                            )
                        )}
                    </ul>
                </div>
            ) : null}
        </div>
    )
}

export default VerordeningenDetailSidebar
