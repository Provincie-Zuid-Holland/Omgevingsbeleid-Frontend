import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import cloneDeep from 'lodash.clonedeep'

import ContainerDetail from '../ContainerDetail'

const secondaryColor = '#CC9900'

// Link naar detail pagina's van de revisies
function makeURLForRevisieObject(overzichtSlug, objectID, objectUUID, hash) {
    if (hash === '#mijn-beleid') {
        return `/muteer/${overzichtSlug}/${objectID}/${objectUUID}#mijn-beleid`
    } else {
        return `/muteer/${overzichtSlug}/${objectID}/${objectUUID}`
    }
}

function VertakkingsItemRightOnLine() {
    return (
        <li className="relative text-secondary vertakkings-item-right-on-line">
            <svg
                className="absolute svg-branch"
                width="34"
                height="40"
                // preserveAspectRatio="none"
                viewBox="0 0 39 42"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M37 0C37 21 2 18 2 39.5"
                    stroke={secondaryColor}
                    strokeWidth="2"
                />
            </svg>
            <div className="block h-12"></div>
        </li>
    )
}

function VertakkingsItemLeftOnLine({ showDot }) {
    return (
        <li className="relative vertakkings-item-left">
            {showDot ? (
                <div className="absolute top-0 left-0 z-10 inline-block bg-indigo-900 list-item-bolletje bolletje-left-min-7" />
            ) : null}
            <svg
                width="33"
                height="40"
                viewBox="0 0 39 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M2 0C2 21.2658 37 18.2278 37 40"
                    stroke={secondaryColor}
                    strokeWidth="2"
                />
            </svg>
        </li>
    )
}

function StatusBadge({ status }) {
    return (
        <div className="inline-block px-2 py-1 text-xs text-gray-700 border border-gray-700 rounded">
            {status}
        </div>
    )
}

function StatusHistorie({
    overzichtSlug,
    dimensieHistorie,
    patchStatus,
    pageType,
    titelEnkelvoud,
    dataReceived,
    vigerendeDimensieObject,
    vigerendeDimensieObjectIndex,
}) {
    // If there is a checked out, or an object with a Status of 'Vigerend' we want to remove it from the history
    const prepareHistorieForUI = () => {
        if (
            dimensieHistorie.length >= 1 &&
            dimensieHistorie[0].Status !== 'Vigerend'
        ) {
            dimensieHistorie = dimensieHistorie.slice(1)
        } else if (
            dimensieHistorie.length === 1 &&
            dimensieHistorie[0].Status === 'Vigerend'
        ) {
            dimensieHistorie = dimensieHistorie.slice(1)
        } else if (
            dimensieHistorie.length >= 1 &&
            dimensieHistorie[0].Status === 'Vigerend' &&
            dimensieHistorie[1].Status !== 'Vastgesteld'
        ) {
            // The object with a status of "Vigerend" hasn't been through the full status flow.
            // Instead it has been edited with `?modus=wijzig_vigerend`
            dimensieHistorie.splice(1, 1)
        }

        return dimensieHistorie
    }

    // Returns a boolean and if true the object
    const checkForCheckedOutObject = () => {
        let isACheckedOutObject = false
        let checkedOutObject = null

        if (
            dimensieHistorie.length > 1 &&
            dimensieHistorie[0].Status !== 'Vigerend'
        ) {
            isACheckedOutObject = true
            checkedOutObject = dimensieHistorie[0]
        } else if (
            dimensieHistorie.length > 1 &&
            dimensieHistorie[0] &&
            dimensieHistorie[0].Status === 'Vigerend' &&
            dimensieHistorie[1] &&
            dimensieHistorie[1].Status !== 'Vastgesteld'
        ) {
            // The object with a status of "Vigerend" hasn't been through the full status flow.
            // Instead it has been edited with `?modus=wijzig_vigerend`
            isACheckedOutObject = true
            checkedOutObject = dimensieHistorie[1]
        }

        return [isACheckedOutObject, checkedOutObject]
    }

    // The dimensieHistorie contains the old versions of the object
    // We reverse it to make it start at the last version (see the UI)
    dimensieHistorie = cloneDeep(dimensieHistorie).reverse()

    const [isACheckedOutObject, checkedOutObject] = checkForCheckedOutObject()

    // Remove any object that we don't want to display in the 'Status UI Flow'
    dimensieHistorie = prepareHistorieForUI()

    return (
        <div>
            {/* This is the blue line between the checked out object and the current 'vigerend' object */}
            {vigerendeDimensieObject ? (
                <div className="flex items-center justify-end w-8 h-6 pt-5 mr-2 border-r-2 border-indigo-900 " />
            ) : null}

            {/* Detail Container that always displays the latest object that is checked out */}
            {isACheckedOutObject &&
            checkedOutObject &&
            checkedOutObject.Status !== 'Vigerend' ? (
                <ContainerDetail
                    patchStatus={patchStatus}
                    dataObject={checkedOutObject}
                    pageType={pageType}
                    overzichtSlug={overzichtSlug}
                    titelEnkelvoud={titelEnkelvoud}
                    dataReceived={dataReceived}
                    noMarginBottom={true}
                    dimensieHistorie={dimensieHistorie}
                />
            ) : null}

            {/* Status UI Flow */}
            <ul
                className={`relative timeline-margin-left border-l-2 ${
                    vigerendeDimensieObject
                        ? 'border-indigo-900'
                        : 'border-transparent'
                }`}
            >
                {/* Map through historie of dimensies */}
                {dimensieHistorie.map((dimensieObject, index) => {
                    /* If item is vigerend and there is no item before it */
                    if (
                        dimensieObject.Status === 'Vigerend' &&
                        index === dimensieHistorie.length - 1
                    ) {
                        return (
                            <React.Fragment>
                                <VertakkingsItemRightOnLine />
                                <div className="absolute left-0 z-10 inline-block bg-indigo-900 list-item-bolletje bolletje-left-min-10" />
                                <div className="absolute ml-16 -mt-3">
                                    <StatusBadge
                                        status={dimensieObject.Status}
                                    />
                                </div>
                            </React.Fragment>
                        )
                    } else if (
                        dimensieObject.Status === 'Vigerend' &&
                        index === 0 &&
                        dimensieHistorie[1] &&
                        dimensieHistorie[1].Status === 'Vastgesteld' &&
                        isACheckedOutObject
                    ) {
                        /* If item is vigerend and there is an item before it, but no item after it */
                        return (
                            <React.Fragment>
                                <VertakkingsItemRightOnLine />
                                <VertakkingsItemLeftOnLine showDot={true} />
                            </React.Fragment>
                        )
                    } else if (
                        dimensieObject.Status === 'Vigerend' &&
                        index === 0 &&
                        dimensieHistorie[1] &&
                        dimensieHistorie[1].Status === 'Vastgesteld'
                    ) {
                        /* If item is vigerend and there is an item before it, but no item after it */
                        return <VertakkingsItemLeftOnLine showDot={true} />
                    } else if (
                        dimensieObject.Status === 'Vigerend' &&
                        dimensieHistorie[index + 1] &&
                        dimensieHistorie[index + 1].Status !== 'Vastgesteld'
                    ) {
                        /* If item is vigerend and hasn't been through the whole process of the statusses */
                        return (
                            <React.Fragment>
                                <li
                                    className={`relative flex items-center ml-8 ${
                                        index === 0 ? 'pt-12 pb-2' : 'pb-4 pt-5'
                                    }`}
                                    key={dimensieObject.UUID}
                                >
                                    <div
                                        style={{
                                            left: '-4px',
                                        }}
                                        className="absolute top-0 inline-block w-full h-full border-l-2 border-secondary"
                                    ></div>
                                </li>
                                <li
                                    className="absolute flex items-center py-2 -mt-10"
                                    key={dimensieObject.UUID}
                                >
                                    <div className="absolute left-0 z-10 inline-block bg-indigo-900 list-item-bolletje bolletje-left-min-10" />

                                    <div className="ml-16">
                                        <StatusBadge
                                            status={dimensieObject.Status}
                                        />
                                    </div>
                                </li>
                            </React.Fragment>
                        )
                    } else if (
                        dimensieObject.Status === 'Vigerend' &&
                        dimensieHistorie[index + 1]
                    ) {
                        /* If item is vigerend and there is an item before it and an item after it */
                        return (
                            <React.Fragment>
                                <VertakkingsItemRightOnLine />
                                <li
                                    className="absolute flex items-center py-2 -mt-5"
                                    key={dimensieObject.UUID}
                                >
                                    <div className="absolute left-0 z-10 inline-block bg-indigo-900 list-item-bolletje bolletje-left-min-10" />

                                    <div className="ml-16">
                                        <StatusBadge
                                            status={dimensieObject.Status}
                                        />
                                    </div>
                                </li>
                                <VertakkingsItemLeftOnLine />
                            </React.Fragment>
                        )
                    } else {
                        return (
                            <React.Fragment>
                                <li
                                    className={`relative flex items-center ml-8 relative ${
                                        index === 0 ? 'pt-6 pb-2' : 'py-2'
                                    }`}
                                    key={dimensieObject.UUID}
                                >
                                    <div
                                        style={{
                                            left: '-4px',
                                        }}
                                        className="absolute top-0 inline-block w-full h-full border-l-2 border-secondary"
                                    ></div>
                                    <div className="absolute left-0 inline-block bg-secondary list-item-bolletje bolletje-left-min-10" />

                                    <div className="ml-8">
                                        <StatusBadge
                                            status={dimensieObject.Status}
                                        />
                                    </div>
                                </li>
                            </React.Fragment>
                        )
                    }
                })}
                {/* Element to fade out the start, only show if the first item (last in dimensieHistorie) doesn't have a Status of 'Vigerend' */}
                {(dimensieHistorie &&
                    dimensieHistorie.length > 1 &&
                    dimensieHistorie[dimensieHistorie.length - 1].Status !==
                        'Vigerend') ||
                (dimensieHistorie &&
                    dimensieHistorie.length === 1 &&
                    dimensieHistorie[0].Status !== 'Vigerend') ? (
                    <div className="absolute bottom-0 left-0 block w-12 h-4 -ml-1 status-flow-gradient" />
                ) : null}
            </ul>
        </div>
    )
}

export default StatusHistorie
