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

function VertakkingsItem() {
    return (
        <li className="absolute">
            <div className="list-item-bolletje-branching inline-block bg-indigo-900 left-0 absolute" />
            {console.log('JA!!')}
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

    return (
        <div>
            {vigerendeDimensieObject && dimensieHistorie[0] ? (
                <div className="w-8 h-6 border-r-2 border-indigo-900 flex items-center justify-end pt-5 mr-2 " />
            ) : null}

            {dimensieHistorie[0] ? (
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
                    if (index === 0) {
                        return null
                    }

                    if (
                        dimensieObject.Status === 'Vigerend' ||
                        dimensieObject.Status === 'Gepubliceerd'
                    ) {
                        return (
                            <li className="pl-8 pt-6" key={dimensieObject.UUID}>
                                <div className="ml-8 px-2 py-1 border inline-block text-xs text-gray-700 rounded border-gray-700">
                                    {dimensieObject.Status}
                                </div>
                            </li>
                        )
                    } else if (dimensieObject.Status === 'Ontwerp GS Concept') {
                        return (
                            <React.Fragment>
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
                                <VertakkingsItem />
                            </React.Fragment>
                        )
                    } else if (dimensieHistorie.length !== 1) {
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
                                        <div className=g"revisie-list-bolletje relative w-3 h-3 text-center bg-gray-300 rounded-full" />
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
                        <React.Fragment>
                            <VertakkingsItem />
                            <li
                                className={`relative flex items-center relative pt-8 pb-2 border-l-2 border-transparent h-12`}
                            ></li>
                            {/* <React.Fragment>
                                <li
                                    className={`relative flex items-center relative pt-8 pb-2 border-l-2 border-transparent h-12`}
                                    key={dimensieHistorie[0].UUID}
                                >
                                    <div className="list-item-bolletje-bottom inline-block bg-indigo-900 left-0 absolute" />
                                </li>
                                <VertakkingsItem />
                            </React.Fragment> */}
                        </React.Fragment>
                    ) : (
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
