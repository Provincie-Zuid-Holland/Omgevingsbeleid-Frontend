import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

import ContainerDetailMain from './../../../components/ContainerDetailMain'

// Link naar detail pagina's van de revisies
function makeURLForRevisieObject(overzichtSlug, objectID, objectUUID, hash) {
    if (hash === '#mijn-beleid') {
        return `/muteer/${overzichtSlug}/${objectID}/${objectUUID}#mijn-beleid`
    } else {
        return `/muteer/${overzichtSlug}/${objectID}/${objectUUID}`
    }
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
    dimensieHistorie = dimensieHistorie.reverse()
    return (
        <div>
            {vigerendeDimensieObject ? (
                <div className="w-8 h-6 border-r-2 border-indigo-900 flex items-center justify-end pt-5 mr-2 " />
            ) : null}

            {dimensieHistorie[0] ? (
                <ContainerDetailMain
                    patchStatus={patchStatus}
                    dataObject={dimensieHistorie[0]}
                    pageType={pageType}
                    overzichtSlug={overzichtSlug}
                    titelEnkelvoud={titelEnkelvoud}
                    dataReceived={dataReceived}
                    noMarginBottom={true}
                />
            ) : null}

            <ul className="relative ml-8 border-l-2 border-indigo-900">
                {dimensieHistorie.map((dimensieObject, index) => {
                    if (index === 0) {
                        return null
                    }

                    if (
                        dimensieObject.Status === 'Vigerend' ||
                        dimensieObject.Status === 'Gepubliceerd'
                    ) {
                        return (
                            <li className="pl-8 py-2" key={dimensieObject.UUID}>
                                <div className="ml-4 px-2 py-1 border inline-block text-xs text-gray-700 rounded border-gray-700">
                                    {dimensieObject.Status}
                                </div>
                            </li>
                        )
                    } else {
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

                    {
                        /* return (
                        <li key={dimensieObject.UUID}>
                            <div className="flex justify-between">
                                <Link
                                    id={`revisie-item-${index}`}
                                    to={'#'}
                                    className="flex items-end h-6 relative mr-2 hover:underline"
                                >
                                    <span className="text-xs text-gray-600 pr-5 border border-gray-600 rounded">
                                        {dimensieObject.Status}
                                    </span>
                                    <div className="revisie-list-bolletje relative w-3 h-3 text-center bg-gray-300 rounded-full" />
                                    <span className="text-xs text-gray-600 pr-5 w-8 pl-4">
                                        Revisie
                                    </span>
                                </Link>
                            </div>
                        </li>
                    ) */
                    }
                })}
                {dimensieHistorie[0] ? (
                    vigerendeDimensieObject ? (
                        <li className="relative">
                            <div className="list-item-bolletje-branching inline-block bg-indigo-900 left-0 absolute" />
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
                                    stroke-width="2"
                                />
                            </svg>
                            <div className="block h-12"></div>
                        </li>
                    ) : (
                        <li className="">
                            <div className="ml-8">
                                <div className="px-2 py-1 border inline-block text-xs text-gray-700 rounded border-gray-700">
                                    {dimensieHistorie[0].Status}
                                </div>
                            </div>
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
