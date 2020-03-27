import React, { useState, useEffect, Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
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
    item,
    children,
    activeHoofdstuk,
    listIndex,

    hoofdstukIndex,
    nest_1,
    nest_2,
    nest_3,
    setPathToActiveSidebarElement,
    arrayIndex,
    activeSidebarElementPath,
}) {
    // const [display, setDisplay] = useState(listIndex === indexOpen)
    const display =
        activeSidebarElementPath[arrayIndex] === listIndex &&
        item.Type !== 'Hoofdstuk'
    const UUID = item.UUID

    return (
        <li key={UUID} className={`mt-2 relative`}>
            <Link
                to={
                    item.Type === 'Artikel'
                        ? `/detail/verordeningen/1/${item.UUID}?hoofdstuk=${hoofdstukIndex}&nest_1=${nest_1}&nest_2=${nest_2}&nest_3=${nest_3}`
                        : `?hoofdstuk=${activeSidebarElementPath[0]}&nest_1=${activeSidebarElementPath[1]}&nest_2=${activeSidebarElementPath[2]}&nest_3=${activeSidebarElementPath[3]}`
                }
                className="cursor-pointer"
                onClick={() => {
                    // !REFACTOR! Onduidelijke rommel
                    if (
                        activeSidebarElementPath[arrayIndex] === listIndex &&
                        item.Type === 'Artikel'
                    ) {
                        return
                    }

                    if (
                        item.Type === 'Hoofdstuk' &&
                        activeHoofdstuk !== listIndex
                    ) {
                        setPathToActiveSidebarElement([
                            listIndex,
                            null,
                            null,
                            null,
                        ])
                    } else if (
                        item.Type === 'Hoofdstuk' &&
                        activeHoofdstuk === listIndex
                    ) {
                        let newArray = activeSidebarElementPath
                        newArray[0] = null
                        setPathToActiveSidebarElement(newArray)
                    } else if (
                        item.Type === 'Artikel' &&
                        activeSidebarElementPath[arrayIndex] !== listIndex
                    ) {
                        let newArray = activeSidebarElementPath
                        newArray[arrayIndex] = listIndex

                        setPathToActiveSidebarElement(newArray)
                    } else {
                        let newArray = activeSidebarElementPath
                        let newValue = null
                        if (activeSidebarElementPath[arrayIndex] === null) {
                            newValue = listIndex
                        }
                        newArray[arrayIndex] = newValue
                        setPathToActiveSidebarElement(newArray)
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
                <span
                    className={`inline-block text-sm text-gray-800 
                    ${item.Type === 'Artikel' ? 'hover:underline' : ''}
                    ${
                        activeSidebarElementPath[arrayIndex] === listIndex &&
                        item.Type === 'Artikel'
                            ? 'font-bold'
                            : ''
                    }
                    `}
                >
                    {/* {item.Type === 'Afdeling'
                        ? `${hoofdstukVolgnummer}.${item.Volgnummer} ${item.Titel} `
                        : ''}
                    {item.Type === 'Paragraaf'
                        ? `§ ${hoofdstukVolgnummer}.${item.Volgnummer} ${item.Titel}`
                        : ''}
                    {item.Type === 'Artikel'
                        ? `Artikel ${hoofdstukVolgnummer}.${item.Volgnummer} - ${item.Titel}`
                        : ''}

                    {item.Type === 'Hoofdstuk' ? item.Titel : ''} */}
                    {item.Titel}
                </span>
            </Link>

            {(activeHoofdstuk === listIndex && item.Type === 'Hoofdstuk') ||
            display
                ? children
                : null}
        </li>
    )
}

class VerordeningenDetailSidebar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activeSidebarElementPath: null,
        }
        this.setPathToActiveSidebarElement = this.setPathToActiveSidebarElement.bind(
            this
        )
    }

    setPathToActiveSidebarElement(activeSidebarElementPath) {
        this.setState(
            {
                activeSidebarElementPath: activeSidebarElementPath,
            },
            () => console.log(this.state)
        )
    }

    componentDidMount() {
        // Set Active Artikel if URL params are provided
        const urlParams = this.props.location.search
        if (urlParams) {
            let [hoofdstukIndex, nest1, nest2, nest3] = getQueryStringValues(
                urlParams
            )
            this.setPathToActiveSidebarElement([
                hoofdstukIndex,
                nest1,
                nest2,
                nest3,
            ])
        } else {
            this.setPathToActiveSidebarElement([null, null, null, null])
        }
    }

    render() {
        const dataLoaded = this.props.dataLoaded
        const lineage = this.props.lineage

        const activeSidebarElementPath = this.state.activeSidebarElementPath
        const setPathToActiveSidebarElement = this.setPathToActiveSidebarElement

        let activeHoofdstuk = null

        if (dataLoaded) {
            activeHoofdstuk = this.state.activeSidebarElementPath[0]
        }

        return (
            <div className="w-full inline-block flex-grow">
                {dataLoaded ? (
                    <div className="relative">
                        <h2 className="font-serif block text-gray-800 mt-4">
                            Inhoudsopgave verordening
                        </h2>
                        <ul className="relative pl-6 pr-5">
                            {lineage.Structuur.Children.map(
                                (hoofdstuk, hoofdstukIndex) => (
                                    <ListItem
                                        activeSidebarElementPath={
                                            activeSidebarElementPath
                                        }
                                        arrayIndex={0}
                                        setPathToActiveSidebarElement={
                                            setPathToActiveSidebarElement
                                        }
                                        activeHoofdstuk={activeHoofdstuk}
                                        hasChildren={
                                            hoofdstuk.Children.length > 0
                                        }
                                        hoofdstukVolgnummer={
                                            hoofdstuk.Volgnummer
                                        }
                                        listIndex={hoofdstukIndex}
                                        hoofdstukIndex={hoofdstukIndex}
                                        nest_1={null}
                                        nest_2={null}
                                        nest_3={null}
                                        item={hoofdstuk}
                                        key={hoofdstuk.UUID}
                                    >
                                        {hoofdstuk.Children.length > 0 ? (
                                            <ul className="pl-6 relative">
                                                {hoofdstuk.Children.map(
                                                    (child, nest_1) => (
                                                        <ListItem
                                                            activeSidebarElementPath={
                                                                activeSidebarElementPath
                                                            }
                                                            arrayIndex={1}
                                                            setPathToActiveSidebarElement={
                                                                setPathToActiveSidebarElement
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
                                                            key={child.UUID}
                                                        >
                                                            {child.Children
                                                                .length > 0 &&
                                                            child.Type !==
                                                                'Artikel' ? (
                                                                <ul className="pl-6 relative">
                                                                    {child.Children.map(
                                                                        (
                                                                            childOfChild,
                                                                            nest_2
                                                                        ) => (
                                                                            <ListItem
                                                                                activeSidebarElementPath={
                                                                                    activeSidebarElementPath
                                                                                }
                                                                                arrayIndex={
                                                                                    2
                                                                                }
                                                                                setPathToActiveSidebarElement={
                                                                                    setPathToActiveSidebarElement
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
                                                                                    <ul className="pl-6 relative">
                                                                                        {childOfChild.Children.map(
                                                                                            (
                                                                                                childOfChildofChild,
                                                                                                nest_3
                                                                                            ) => (
                                                                                                <ListItem
                                                                                                    activeSidebarElementPath={
                                                                                                        activeSidebarElementPath
                                                                                                    }
                                                                                                    arrayIndex={
                                                                                                        3
                                                                                                    }
                                                                                                    setPathToActiveSidebarElement={
                                                                                                        setPathToActiveSidebarElement
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
}

export default withRouter(VerordeningenDetailSidebar)
