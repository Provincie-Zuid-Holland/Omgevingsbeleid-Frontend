import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'

import {
    faMinusSquare,
    faFileAlt,
    faPlusSquare,
} from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import useEventListener from './../../../utils/useEventListener'

function getQueryStringValues(urlParams) {
    function parseIntOrSetToNull(item) {
        if (item === 'null') {
            return null
        } else {
            return parseInt(item)
        }
    }
    const queryStringValues = queryString.parse(urlParams)
    let hoofdstukIndex = parseIntOrSetToNull(queryStringValues.hoofdstuk)
    let nest_1 = parseIntOrSetToNull(queryStringValues.nest_1)
    let nest_2 = parseIntOrSetToNull(queryStringValues.nest_2)
    let nest_3 = parseIntOrSetToNull(queryStringValues.nest_3)
    return [hoofdstukIndex, nest_1, nest_2, nest_3]
}

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
    setActiveArtikel,
    arrayIndex,
    activeArtikel,
}) {
    // const [display, setDisplay] = useState(listIndex === indexOpen)
    const display = activeArtikel[arrayIndex] === listIndex

    if (arrayIndex === 1) {
        console.log(Titel)
        console.log(display)
    }

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

                    console.log(activeArtikel)
                    let newArray = activeArtikel
                    let newValue = null
                    if (newArray[arrayIndex] !== null) {
                        newValue = null
                    } else {
                        newValue = listIndex
                    }
                    newArray[arrayIndex] = newValue
                    console.log(newArray)
                    setActiveArtikel(newArray)

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
    location,
}) {
    const [activeArtikel, setActiveArtikel] = useState([])

    useEffect(() => {
        // Set Active Artikel if URL params are provided
        const urlParams = location.search
        if (urlParams) {
            let [hoofdstukIndex, nest1, nest2, nest3] = getQueryStringValues(
                urlParams
            )
            setActiveArtikel([hoofdstukIndex, nest1, nest2, nest3])
        } else {
            setActiveArtikel([null, null, null, null])
        }
    }, [])

    return (
        <div className="w-full inline-block flex-grow">
            {dataLoaded ? (
                <div className="relative">
                    <h2
                        className="font-serif block text-gray-800 mt-4"
                        onClick={() => changeActiveHoofdstuk(null)}
                    >
                        Inhoudsopgave verordening
                    </h2>
                    <ul className="relative pl-6 pr-5">
                        {lineage.Structuur.Children.map(
                            (hoofdstuk, hoofdstukIndex) => (
                                <ListItem
                                    activeArtikel={activeArtikel}
                                    arrayIndex={0}
                                    setActiveArtikel={setActiveArtikel}
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
                                                        activeArtikel={
                                                            activeArtikel
                                                        }
                                                        arrayIndex={1}
                                                        setActiveArtikel={
                                                            setActiveArtikel
                                                        }
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
                                                                            activeArtikel={
                                                                                activeArtikel
                                                                            }
                                                                            arrayIndex={
                                                                                2
                                                                            }
                                                                            setActiveArtikel={
                                                                                setActiveArtikel
                                                                            }
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
                                                                                                activeArtikel={
                                                                                                    activeArtikel
                                                                                                }
                                                                                                arrayIndex={
                                                                                                    3
                                                                                                }
                                                                                                setActiveArtikel={
                                                                                                    setActiveArtikel
                                                                                                }
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

export default withRouter(VerordeningenDetailSidebar)
