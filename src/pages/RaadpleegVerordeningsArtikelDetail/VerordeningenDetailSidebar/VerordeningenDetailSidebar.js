import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import queryString from 'query-string'

import {
    faMinusSquare,
    faPlusSquare,
} from '@fortawesome/free-regular-svg-icons'
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Function to get Query string parameters from the URL and return them in an array
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

// Returns a title based on the item.Type
function ListItemIcon({ item, itemActive }) {
    return (
        <FontAwesomeIcon
            className={`${
                item.Type === 'Artikel' ? 'ml-1' : ''
            } absolute mt-1 left-0 -ml-5 text-gray-700 bg-gray-100 text-sm`}
            icon={
                item.Type === 'Artikel'
                    ? faAlignLeft
                    : itemActive
                    ? faMinusSquare
                    : faPlusSquare
            }
        />
    )
}

// Returns a title based on the item.Type
function ListItemTitle({ item, itemActive }) {
    let title = null

    if (item.Type === 'Hoofdstuk') {
        title = `${item.Titel}`
    } else if (item.Type === 'Afdeling') {
        title = `${item.Volgnummer} ${item.Titel}`
    } else if (item.Type === 'Paragraaf') {
        title = `§ ${item.Volgnummer} ${item.Titel}`
    } else if (item.Type === 'Artikel') {
        title = `Artikel ${item.Volgnummer} - ${item.Titel}`
    }

    return (
        <span
            className={`inline-block text-sm text-gray-800 
            ${item.Type === 'Artikel' ? 'hover:underline' : ''}
            ${itemActive && item.Type === 'Artikel' ? 'font-bold' : ''}
        `}
        >
            {title}
        </span>
    )
}

// Used in the ListItem component to turn article items into Links
function WrapInLinkOrSpan({ children, isArtikel, url, onClick }) {
    if (isArtikel) {
        return (
            <Link to={url} className="cursor-pointer" onClick={onClick}>
                {children}
            </Link>
        )
    } else {
        return (
            <span className="cursor-pointer" onClick={onClick}>
                {children}
            </span>
        )
    }
}
/**
 * @param {Object} item - Contains the list item from the VerordeningsStructuur
 * @param {Object} children - Contains potential nested list
 * @param {Number} hoofdstukIndex, nest_1, nest_2, nest_3 - Index positions from the map() function of the different nested levels
 * @param {Function} setActivePath - function that sets the active state (!REFACTOR! -> To local state)
 * @param {Number} arrayIndex - is a number from 0 <--> 3 to indicate the nested level of the ListItem
 * @param {Object} listIndex - contains the index position of the item from the mapped list
 */
function ListItem({
    item,
    children,
    hoofdstukIndex,
    nest_1,
    nest_2,
    nest_3,
    activePath,
    setActivePath,
    arrayIndex,
    listIndex,
}) {
    const itemActive = activePath[arrayIndex] === listIndex

    return (
        <li className="mt-2 relative">
            <WrapInLinkOrSpan
                isArtikel={item.Type === 'Artikel'}
                url={`/detail/verordeningen/1/${item.UUID}?hoofdstuk=${hoofdstukIndex}&nest_1=${nest_1}&nest_2=${nest_2}&nest_3=${nest_3}`}
                onClick={() => {
                    let newActivePath = [hoofdstukIndex, nest_1, nest_2, nest_3]

                    if (itemActive) {
                        // If user clicks on an item that is already open we reset that value to Null
                        newActivePath[arrayIndex] = null
                    } else {
                        // Else the item is closed (null) so we assign it the listIndex to open it
                        newActivePath[arrayIndex] = listIndex
                    }

                    setActivePath(newActivePath)
                }}
            >
                <ListItemIcon itemActive={itemActive} item={item} />
                <ListItemTitle itemActive={itemActive} item={item} />
            </WrapInLinkOrSpan>

            {itemActive ? children : null}
        </li>
    )
}

function VerordeningenDetailSidebar({ dataLoaded, lineage }) {
    let location = useLocation()

    const [activePath, setActivePath] = useState(
        getQueryStringValues(location.search)
    )

    console.log(activePath)

    return (
        <div className="w-full inline-block flex-grow">
            {dataLoaded ? (
                <div className="relative">
                    <h2 className="font-serif block text-gray-800 mt-4">
                        Inhoudsopgave verordening
                    </h2>
                    <ul className="relative pl-5 pr-5">
                        {lineage.Structuur.Children.map(
                            (hoofdstuk, hoofdstukIndex) => (
                                <ListItem
                                    setActivePath={setActivePath}
                                    activePath={activePath}
                                    arrayIndex={0}
                                    listIndex={hoofdstukIndex}
                                    hoofdstukIndex={hoofdstukIndex}
                                    nest_1={null}
                                    nest_2={null}
                                    nest_3={null}
                                    item={hoofdstuk}
                                    key={hoofdstuk.UUID}
                                >
                                    {hoofdstuk.Children.length > 0 ? (
                                        <ul className="pl-5 relative">
                                            {hoofdstuk.Children.map(
                                                (child, nest_1) => (
                                                    <ListItem
                                                        setActivePath={
                                                            setActivePath
                                                        }
                                                        activePath={activePath}
                                                        arrayIndex={1}
                                                        item={child}
                                                        listIndex={nest_1}
                                                        hoofdstukIndex={
                                                            hoofdstukIndex
                                                        }
                                                        nest_1={nest_1}
                                                        nest_2={null}
                                                        nest_3={null}
                                                        key={child.UUID}
                                                    >
                                                        {child.Children.length >
                                                            0 &&
                                                        child.Type !==
                                                            'Artikel' ? (
                                                            <ul className="pl-5 relative">
                                                                {child.Children.map(
                                                                    (
                                                                        childOfChild,
                                                                        nest_2
                                                                    ) => (
                                                                        <ListItem
                                                                            setActivePath={
                                                                                setActivePath
                                                                            }
                                                                            activePath={
                                                                                activePath
                                                                            }
                                                                            arrayIndex={
                                                                                2
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
                                                                            key={
                                                                                childOfChild.UUID
                                                                            }
                                                                        >
                                                                            {childOfChild
                                                                                .Children
                                                                                .length >
                                                                                0 &&
                                                                            childOfChild.Type !==
                                                                                'Artikel' ? (
                                                                                <ul className="pl-5 relative">
                                                                                    {childOfChild.Children.map(
                                                                                        (
                                                                                            childOfChildofChild,
                                                                                            nest_3
                                                                                        ) => (
                                                                                            <ListItem
                                                                                                setActivePath={
                                                                                                    setActivePath
                                                                                                }
                                                                                                activePath={
                                                                                                    activePath
                                                                                                }
                                                                                                arrayIndex={
                                                                                                    3
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
                                                                                                key={
                                                                                                    childOfChildofChild.UUID
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
