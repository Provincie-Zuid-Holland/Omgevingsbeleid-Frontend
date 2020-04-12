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

function VertakkingsItemRightOnLine() {
    return (
        <li className="relative vertakkings-item-right-on-line">
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
                    stroke="#d69e2e"
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
                    stroke="#d69e2e"
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
    // Reverse de array aangezien we niet de chronologische volgorde willen, willen beginnen bij de laatste versie
    dimensieHistorie = cloneDeep(dimensieHistorie).reverse()

    let isACheckedOutObject = false
    let checkedOutObject = null
    if (
        dimensieHistorie.length >= 1 &&
        dimensieHistorie[0].Status !== 'Vigerend'
    ) {
        console.log('1!!!')
        isACheckedOutObject = true
        checkedOutObject = dimensieHistorie[0]
        dimensieHistorie = dimensieHistorie.slice(1)
    } else if (
        dimensieHistorie.length === 1 &&
        dimensieHistorie[0].Status === 'Vigerend'
    ) {
        console.log('2!!!')
        dimensieHistorie = dimensieHistorie.slice(1)
    } else {
        console.log('ELSE!')
        console.log(dimensieHistorie.length)
        console.log(dimensieHistorie[0].Status)
    }

    console.log(isACheckedOutObject)
    console.log(checkedOutObject)

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

            {dimensieHistorie.length === 0 ? (
                <div className="relative w-8">
                    <div className="flex items-center justify-end h-6 pt-5 border-r-2 border-indigo-900"></div>
                    <div className="absolute bottom-0 inline-block bg-indigo-900 list-item-bolletje bolletje-right-min-7" />
                </div>
            ) : null}

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
                        dimensieHistorie[1].Status === 'Vastgesteld'
                    ) {
                        /* If item is vigerend and there is an item before it, but no item after it */
                        return <VertakkingsItemLeftOnLine showDot={true} />
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
                                    <div className="absolute top-0 inline-block w-full h-full border-l-2 border-yellow-600 status-yellow-border"></div>
                                    <div className="absolute left-0 inline-block bg-yellow-600 list-item-bolletje bolletje-left-min-10" />

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
            </ul>
        </div>
    )

    // return (
    //     <div>
    //         {/* Blauw koppelstuk tussen vigerend en gele */}
    //         {vigerendeDimensieObject && dimensieHistorie.length >= 2 ? (
    //             <div className="flex items-center justify-end w-8 h-6 pt-5 mr-2 border-r-2 border-indigo-900 " />
    //         ) : null}

    //         {dimensieHistorie[0] && vigerendeDimensieObjectIndex !== 0 ? (
    //             <ContainerDetail
    //                 patchStatus={patchStatus}
    //                 dataObject={dimensieHistorie[0]}
    //                 pageType={pageType}
    //                 overzichtSlug={overzichtSlug}
    //                 titelEnkelvoud={titelEnkelvoud}
    //                 dataReceived={dataReceived}
    //                 noMarginBottom={true}
    //                 dimensieHistorie={dimensieHistorie}
    //             />
    //         ) : null}

    //         <ul
    //             className={`relative ml-8 border-l-2 ${
    //                 dimensieHistorie[0] && vigerendeDimensieObject
    //                     ? 'border-indigo-900'
    //                     : 'border-transparent'
    //             }`}
    //         >
    //             {dimensieHistorie.map((dimensieObject, index) => {
    //                 {
    //                     /* Als de index 0 is willen we niks weergeven omdat we dat object in de containerDetail weergeven */
    //                 }
    //                 {
    //                     /* if (index === 0 && vigerendeDimensieObjectIndex !== index) {
    //                     return (
    //                         <VertakkingsItemRightOnLine hideBolletje={true} />
    //                     )
    //                 } */
    //                 }

    //                 if (vigerendeDimensieObjectIndex === index || index === 0) {
    //                     return null
    //                 }

    //                 if (
    //                     (dimensieObject.Status === 'Vigerend' ||
    //                         dimensieObject.Status === 'Gepubliceerd') &&
    //                     dimensieHistorie.length > 0
    //                 ) {
    //                     return null
    //                 } else if (dimensieObject.Status === 'Ontwerp GS Concept') {
    //                     {
    //                         /* 'Ontwerp GS Concept' is de eerste status, dus hierbij willen we een vertakkingsItemRight component plaatsen*/
    //                     }

    //                     {
    //                         /* !REFACTOR! Hier moet in de toekomst een check bij om te kijken of 'Ontwerp GS Concept' na een 'vigerende' beleidsbeslissing komt. Er kan namelijk vanaf status 'Definitief ontwerp PS' ook nog naar 'Ontwerp GS Concept' gegaan worden. */
    //                     }

    //                     return (
    //                         <React.Fragment key={dimensieObject.UUID}>
    //                             <li
    //                                 className={`relative flex items-center ml-8 relative ${
    //                                     index === 1 ? 'pt-6 pb-2' : 'py-2'
    //                                 }`}
    //                                 key={dimensieObject.UUID}
    //                             >
    //                                 <div className="absolute top-0 inline-block w-full h-full border-l-2 border-yellow-600 status-yellow-border"></div>
    //                                 <div className="absolute left-0 inline-block bg-yellow-600 list-item-bolletje bolletje-left-min-10" />

    //                                 <div className="ml-8">
    //                                     <div className="inline-block px-2 py-1 text-xs text-gray-700 border border-gray-700 rounded">
    //                                         {dimensieObject.Status}
    //                                     </div>
    //                                 </div>
    //                             </li>
    //                             <VertakkingsItemRight />
    //                         </React.Fragment>
    //                     )
    //                 } else if (dimensieHistorie.length !== 1) {
    //                     {
    //                         /* Als de status van een Vastgesteld naar vigerend gaat */
    //                     }
    //                     if (
    //                         dimensieHistorie[index - 1] &&
    //                         dimensieHistorie[index].Status === 'Vastgesteld' &&
    //                         dimensieHistorie[index - 1].Status === 'Vigerend'
    //                     ) {
    //                         return (
    //                             <React.Fragment key={dimensieObject.UUID}>
    //                                 <VertakkingsItemLeftOnLine />
    //                                 <li
    //                                     className={`relative flex items-center ml-8 relative ${
    //                                         index === 1 ? 'pt-6 pb-2' : 'py-2'
    //                                     }`}
    //                                     key={dimensieObject.UUID}
    //                                 >
    //                                     <div className="absolute top-0 inline-block w-full h-full border-l-2 border-yellow-600 status-yellow-border"></div>
    //                                     <div className="absolute left-0 inline-block bg-yellow-600 list-item-bolletje bolletje-left-min-10" />

    //                                     <div className="ml-8">
    //                                         <div className="inline-block px-2 py-1 text-xs text-gray-700 border border-gray-700 rounded">
    //                                             {dimensieObject.Status}
    //                                         </div>
    //                                     </div>
    //                                 </li>
    //                             </React.Fragment>
    //                         )
    //                     } else if (
    //                         dimensieHistorie[index - 1] &&
    //                         dimensieHistorie[index].Status ===
    //                             'Ontwerp GS Concept' &&
    //                         dimensieHistorie[index - 1].Status === 'Vigerend'
    //                     ) {
    //                         return (
    //                             <React.Fragment key={dimensieObject.UUID}>
    //                                 <VertakkingsItemLeftOnLine />
    //                                 <li
    //                                     className={`relative flex items-center ml-8 relative ${
    //                                         index === 1 ? 'pt-6 pb-2' : 'py-2'
    //                                     }`}
    //                                     key={dimensieObject.UUID}
    //                                 >
    //                                     <div className="absolute top-0 inline-block w-full h-full border-l-2 border-yellow-600 status-yellow-border"></div>
    //                                     <div className="absolute left-0 inline-block bg-yellow-600 list-item-bolletje bolletje-left-min-10" />

    //                                     <div className="ml-8">
    //                                         <div className="inline-block px-2 py-1 text-xs text-gray-700 border border-gray-700 rounded">
    //                                             {dimensieObject.Status}
    //                                         </div>
    //                                     </div>
    //                                 </li>
    //                             </React.Fragment>
    //                         )
    //                     } else {
    //                         {
    //                             /* Dit is het normale list item wat gereturned wordt */
    //                         }
    //                         return (
    //                             <li
    //                                 className={`relative flex items-center ml-8 relative ${
    //                                     index === 1 ? 'pt-6 pb-2' : 'py-2'
    //                                 }`}
    //                                 key={dimensieObject.UUID}
    //                             >
    //                                 <div className="absolute top-0 inline-block w-full h-full border-l-2 border-yellow-600 status-yellow-border"></div>
    //                                 <div className="absolute left-0 inline-block bg-yellow-600 list-item-bolletje bolletje-left-min-10" />

    //                                 <div className="ml-8">
    //                                     <div className="inline-block px-2 py-1 text-xs text-gray-700 border border-gray-700 rounded">
    //                                         {dimensieObject.Status}
    //                                     </div>
    //                                 </div>
    //                             </li>
    //                         )
    //                     }
    //                 }
    //             })}

    //             {dimensieHistorie.length === 0 ||
    //             dimensieHistorie.length === 1 ? (
    //                 <li className="relative flex items-center pt-8 pb-2 border-l border-transparent">
    //                     <div className="absolute left-0 inline-block bg-indigo-900 list-item-bolletje bolletje-left-min-10-bottom" />
    //                 </li>
    //             ) : null}

    //             {dimensieHistorie[0] && vigerendeDimensieObjectIndex !== 0 ? (
    //                 vigerendeDimensieObject ? null : (
    //                     <li
    //                         className={`relative flex items-center ml-8 relative pt-8 pb-2`}
    //                         key={dimensieHistorie[0].UUID}
    //                     >
    //                         <div className="absolute top-0 inline-block w-full h-full border-l-2 border-yellow-600 status-yellow-border"></div>
    //                         <div className="absolute left-0 inline-block bg-yellow-600 list-item-bolletje bolletje-left-min-10-bottom" />
    //                     </li>
    //                 )
    //             ) : null}
    //         </ul>
    //     </div>
    // )
}

StatusHistorie.propTypes = {}

StatusHistorie.defaultProps = {}

export default StatusHistorie
