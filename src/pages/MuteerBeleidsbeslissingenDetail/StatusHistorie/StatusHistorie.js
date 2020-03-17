import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

import cloneDeep from 'lodash.clonedeep'

import ContainerDetail from '../ContainerDetail'

// Link naar detail pagina's van de revisies
function makeURLForRevisieObject(overzichtSlug, objectID, objectUUID, hash) {
    if (hash === '#mijn-beleid') {
        return `/muteer/${overzichtSlug}/${objectID}/${objectUUID}#mijn-beleid`
    } else {
        return `/muteer/${overzichtSlug}/${objectID}/${objectUUID}`
    }
}

function VertakkingsItemRightOnLine({ hideBolletje }) {
    return (
        <li className="relative vertakkings-item-right-on-line">
            {hideBolletje ? null : (
                <div className="list-item-bolletje-branching inline-block bg-indigo-900 left-0 absolute" />
            )}
            <svg
                className="absolute svg-branch"
                width="36"
                height="41"
                // preserveAspectRatio="none"
                viewBox="0 0 39 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M37 0C37 21 2 18 2 39.5"
                    stroke="#d69e2e"
                    strokeWidth="2"
                />
            </svg>
            <div className="block h-12"></div>
        </li>
    )
}

function VertakkingsItemRight({ hideBolletje }) {
    return (
        <li className="relative">
            {hideBolletje ? null : (
                <div className="list-item-bolletje-branching inline-block bg-indigo-900 left-0 absolute" />
            )}
            <svg
                className="absolute svg-branch"
                width="33"
                height="41"
                // preserveAspectRatio="none"
                viewBox="0 0 39 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M37 0C37 21 2 18 2 39.5"
                    stroke="#d69e2e"
                    strokeWidth="2"
                />
            </svg>
            <div className="block h-12"></div>
        </li>
    )
}

function VertakkingsItemLeft() {
    return (
        <li className="relative vertakkings-item-left">
            <div className="list-item-bolletje-on-line inline-block bg-indigo-900 left-0 absolute" />
            <svg
                width="33"
                height="40"
                viewBox="0 0 39 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M2 0C2 21.2658 37 18.2278 37 40"
                    stroke="#d69e2e"
                    strokeWidth="2"
                />
            </svg>
        </li>
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
}) {
    // Reverse de array aangezien we niet de chronologische volgorde willen, willen beginnen bij de laatste versie
    dimensieHistorie = cloneDeep(dimensieHistorie).reverse()

    let vigerendeDimensieObjectIndex = null
    // forEach loop om te kijken of er een vigerend object is en zo ja, welke index deze heeft
    dimensieHistorie.forEach((dimensieObject, index) => {
        if (
            dimensieObject.Status === 'Vigerend' ||
            (dimensieObject.Status === 'Gepubliceerd' &&
                vigerendeDimensieObjectIndex === null)
        ) {
            vigerendeDimensieObjectIndex = index
        }
    })

    return (
        <div>
            {/* Blauw koppelstuk tussen vigerend en gele */}
            {vigerendeDimensieObject && dimensieHistorie.length >= 2 ? (
                <div className="w-8 h-6 border-r-2 border-indigo-900 flex items-center justify-end pt-5 mr-2 " />
            ) : null}

            {dimensieHistorie[0] && vigerendeDimensieObjectIndex !== 0 ? (
                <ContainerDetail
                    patchStatus={patchStatus}
                    dataObject={dimensieHistorie[0]}
                    pageType={pageType}
                    overzichtSlug={overzichtSlug}
                    titelEnkelvoud={titelEnkelvoud}
                    dataReceived={dataReceived}
                    noMarginBottom={true}
                    dimensieHistorie={dimensieHistorie}
                />
            ) : null}

            <ul
                className={`relative ml-8 border-l-2 ${
                    dimensieHistorie[0] && vigerendeDimensieObject
                        ? 'border-indigo-900'
                        : 'border-transparent'
                }`}
            >
                {dimensieHistorie.map((dimensieObject, index) => {
                    {
                        /* Als de index 0 is willen we niks weergeven omdat we dat object in de containerDetail weergeven */
                    }
                    {
                        /* if (index === 0 && vigerendeDimensieObjectIndex !== index) {
                        return (
                            <VertakkingsItemRightOnLine hideBolletje={true} />
                        )
                    } */
                    }

                    if (vigerendeDimensieObjectIndex === index || index === 0) {
                        return null
                    }

                    if (
                        (dimensieObject.Status === 'Vigerend' ||
                            dimensieObject.Status === 'Gepubliceerd') &&
                        dimensieHistorie.length > 0
                    ) {
                        return null
                    } else if (dimensieObject.Status === 'Ontwerp GS Concept') {
                        {
                            /* 'Ontwerp GS Concept' is de eerste status, dus hierbij willen we een vertakkingsItemRight component plaatsen*/
                        }

                        {
                            /* !REFACTOR! Hier moet in de toekomst een check bij om te kijken of 'Ontwerp GS Concept' na een 'vigerende' beleidsbeslissing komt. Er kan namelijk vanaf status 'Definitief ontwerp PS' ook nog naar 'Ontwerp GS Concept' gegaan worden. */
                        }

                        return (
                            <React.Fragment key={dimensieObject.UUID}>
                                <li
                                    className={`relative flex items-center ml-8 relative ${
                                        index === 1 ? 'pt-6 pb-2' : 'py-2'
                                    }`}
                                    key={dimensieObject.UUID}
                                >
                                    <div className="absolute inline-block h-full w-full status-yellow-border top-0 border-l-2 border-yellow-600"></div>
                                    <div className="list-item-bolletje inline-block bg-yellow-600 left-0 absolute" />

                                    <div className="ml-8">
                                        <div className="px-2 py-1 border inline-block text-xs text-gray-700 rounded border-gray-700">
                                            {dimensieObject.Status}
                                        </div>
                                    </div>
                                </li>
                                <VertakkingsItemRight />
                            </React.Fragment>
                        )
                    } else if (dimensieHistorie.length !== 1) {
                        {
                            /* Als de status van een Vastgesteld naar vigerend gaat */
                        }
                        if (
                            dimensieHistorie[index - 1] &&
                            dimensieHistorie[index].Status === 'Vastgesteld' &&
                            dimensieHistorie[index - 1].Status === 'Vigerend'
                        ) {
                            return (
                                <React.Fragment key={dimensieObject.UUID}>
                                    <VertakkingsItemLeft />
                                    <li
                                        className={`relative flex items-center ml-8 relative ${
                                            index === 1 ? 'pt-6 pb-2' : 'py-2'
                                        }`}
                                        key={dimensieObject.UUID}
                                    >
                                        <div className="absolute inline-block h-full w-full status-yellow-border top-0 border-l-2 border-yellow-600"></div>
                                        <div className="list-item-bolletje inline-block bg-yellow-600 left-0 absolute" />

                                        <div className="ml-8">
                                            <div className="px-2 py-1 border inline-block text-xs text-gray-700 rounded border-gray-700">
                                                {dimensieObject.Status}
                                            </div>
                                        </div>
                                    </li>
                                </React.Fragment>
                            )
                        } else if (
                            dimensieHistorie[index - 1] &&
                            dimensieHistorie[index].Status ===
                                'Ontwerp GS Concept' &&
                            dimensieHistorie[index - 1].Status === 'Vigerend'
                        ) {
                            return (
                                <React.Fragment key={dimensieObject.UUID}>
                                    <VertakkingsItemLeft />
                                    <li
                                        className={`relative flex items-center ml-8 relative ${
                                            index === 1 ? 'pt-6 pb-2' : 'py-2'
                                        }`}
                                        key={dimensieObject.UUID}
                                    >
                                        <div className="absolute inline-block h-full w-full status-yellow-border top-0 border-l-2 border-yellow-600"></div>
                                        <div className="list-item-bolletje inline-block bg-yellow-600 left-0 absolute" />

                                        <div className="ml-8">
                                            <div className="px-2 py-1 border inline-block text-xs text-gray-700 rounded border-gray-700">
                                                {dimensieObject.Status}
                                            </div>
                                        </div>
                                    </li>
                                </React.Fragment>
                            )
                        } else {
                            {
                                /* Dit is het normale list item wat gereturned wordt */
                            }
                            return (
                                <li
                                    className={`relative flex items-center ml-8 relative ${
                                        index === 1 ? 'pt-6 pb-2' : 'py-2'
                                    }`}
                                    key={dimensieObject.UUID}
                                >
                                    <div className="absolute inline-block h-full w-full status-yellow-border top-0 border-l-2 border-yellow-600"></div>
                                    <div className="list-item-bolletje inline-block bg-yellow-600 left-0 absolute" />

                                    <div className="ml-8">
                                        <div className="px-2 py-1 border inline-block text-xs text-gray-700 rounded border-gray-700">
                                            {dimensieObject.Status}
                                        </div>
                                    </div>
                                </li>
                            )
                        }
                    }
                })}

                {dimensieHistorie.length === 0 ||
                dimensieHistorie.length === 1 ? (
                    <li className="relative flex items-center  relative pt-8 pb-2 border-l border-transparent">
                        <div className="list-item-bolletje-bottom inline-block bg-indigo-900 left-0 absolute" />
                    </li>
                ) : null}

                {dimensieHistorie[0] && vigerendeDimensieObjectIndex !== 0 ? (
                    vigerendeDimensieObject ? null : (
                        <li
                            className={`relative flex items-center ml-8 relative pt-8 pb-2`}
                            key={dimensieHistorie[0].UUID}
                        >
                            <div className="absolute inline-block h-full w-full status-yellow-border top-0 border-l-2 border-yellow-600"></div>
                            <div className="list-item-bolletje-bottom inline-block bg-yellow-600 left-0 absolute" />
                        </li>
                    )
                ) : null}
            </ul>
        </div>
    )
}

StatusHistorie.propTypes = {}

StatusHistorie.defaultProps = {}

export default StatusHistorie
