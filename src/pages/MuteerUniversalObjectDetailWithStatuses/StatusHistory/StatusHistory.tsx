import cloneDeep from 'lodash.clonedeep'
import { Fragment } from 'react'

import { BeleidskeuzesRead } from '@/api/fetchers.schemas'

import ContainerDetail from '../ContainerDetail'

const secondaryColor = '#c6a410'

/**
 * Contains the visual flow of the past statusses and the container of the checked out object
 */

interface StatusHistoryProps {
    overzichtSlug: string
    titleSingular: string
    dimensionHistory: BeleidskeuzesRead[]
    setDimensionHistory: (dimensionHistory: BeleidskeuzesRead[]) => void
    patchStatus: (dataObject: any, value: string) => void
    pageType: string
    isLoading?: boolean
    vigerendeDimensieObject: any
}

function StatusHistory({
    overzichtSlug,
    setDimensionHistory,
    dimensionHistory,
    patchStatus,
    pageType,
    titleSingular,
    isLoading,
    vigerendeDimensieObject,
}: StatusHistoryProps) {
    const originalDimensionHistory = cloneDeep(dimensionHistory)

    // If there is a checked out, or an object with a Status of 'Vigerend' we want to remove it from the history
    const prepareHistorieForUI = () => {
        if (
            (dimensionHistory.length >= 1 &&
                dimensionHistory[0].Status !== 'Vigerend') ||
            (dimensionHistory.length === 1 &&
                dimensionHistory[0].Status === 'Vigerend')
        ) {
            dimensionHistory = dimensionHistory.slice(1)
        } else if (
            dimensionHistory.length >= 1 &&
            dimensionHistory[0].Status === 'Vigerend' &&
            dimensionHistory[1].Status !== 'Vastgesteld'
        ) {
            // The object with a status of "Vigerend" hasn't been through the full status flow.
            // Instead it has been edited with `?modus=wijzig_vigerend`
            dimensionHistory.splice(1, 1)
        }

        return dimensionHistory
    }

    // Returns a boolean and if true the object
    const checkForCheckedOutObject = () => {
        let isACheckedOutObject = false
        let checkedOutObject

        if (
            dimensionHistory.length > 1 &&
            dimensionHistory[0].Status !== 'Vigerend'
        ) {
            isACheckedOutObject = true
            checkedOutObject = dimensionHistory[0]
        } else if (
            dimensionHistory.length > 1 &&
            dimensionHistory[0]?.Status === 'Vigerend' &&
            dimensionHistory[1]?.Status !== 'Vastgesteld'
        ) {
            // The object with a status of "Vigerend" hasn't been through the full status flow.
            // Instead it has been edited with `?modus=wijzig_vigerend`
            isACheckedOutObject = true
            checkedOutObject = dimensionHistory[1]
        } else if (
            dimensionHistory.length === 1 &&
            dimensionHistory[0].Status !== 'Vigerend'
        ) {
            // Newly created object
            isACheckedOutObject = true
            checkedOutObject = dimensionHistory[0]
        }

        return { isACheckedOutObject, checkedOutObject }
    }

    // The dimensionHistory contains the old versions of the object
    // We reverse it to make it start at the last version (see the UI)
    dimensionHistory = cloneDeep(dimensionHistory)

    const { isACheckedOutObject, checkedOutObject } = checkForCheckedOutObject()

    // Remove any object that we don't want to display in the 'Status UI Flow'
    dimensionHistory = prepareHistorieForUI()

    return (
        <div>
            {/* This is the blue line between the checked out object and the current 'vigerend' object */}
            {vigerendeDimensieObject && (
                <div className="flex items-center justify-end w-8 h-6 pt-5 mr-2 border-r-2 border-pzh-blue" />
            )}

            {/* Detail Container that always displays the latest object that is checked out */}
            {isACheckedOutObject &&
                checkedOutObject &&
                checkedOutObject.Status !== 'Vigerend' && (
                    <ContainerDetail
                        dimensionHistory={originalDimensionHistory}
                        setDimensionHistory={setDimensionHistory}
                        patchStatus={patchStatus}
                        dataObject={checkedOutObject}
                        pageType={pageType}
                        overzichtSlug={overzichtSlug}
                        titleSingular={titleSingular}
                        isLoading={isLoading}
                        isHistory
                    />
                )}

            {/* Status UI Flow */}
            <ul
                className={`relative timeline-margin-left border-l-2 ${
                    vigerendeDimensieObject
                        ? 'border-pzh-blue'
                        : 'border-transparent'
                }`}>
                {/* Map through historie of dimensies */}
                {dimensionHistory.map((dimensieObject, index) => {
                    /* If item is vigerend and there is no item before it */
                    if (
                        dimensieObject.Status === 'Vigerend' &&
                        index === dimensionHistory.length - 1
                    ) {
                        return (
                            <Fragment key={dimensieObject.UUID}>
                                <VertakkingsItemRightOnLine />
                                <div className="absolute left-0 z-10 inline-block bg-pzh-blue list-item-bolletje bolletje-left-min-10" />
                                <div className="absolute ml-16 -mt-3">
                                    <StatusBadge
                                        status={dimensieObject.Status}
                                    />
                                </div>
                            </Fragment>
                        )
                    } else if (
                        dimensieObject.Status === 'Vigerend' &&
                        index === 0 &&
                        dimensionHistory[1]?.Status === 'Vastgesteld' &&
                        isACheckedOutObject
                    ) {
                        /* If item is vigerend and there is an item before it, but no item after it */
                        return (
                            <Fragment key={dimensieObject.UUID}>
                                <VertakkingsItemRightOnLine noMargin />
                                <VertakkingsItemLeftOnLine showDot />
                            </Fragment>
                        )
                    } else if (
                        dimensieObject.Status === 'Vigerend' &&
                        index === 0 &&
                        dimensionHistory[1]?.Status === 'Vastgesteld'
                    ) {
                        /* If item is vigerend and there is an item before it, but no item after it */
                        return (
                            <VertakkingsItemLeftOnLine
                                showDot
                                key={dimensieObject.UUID}
                            />
                        )
                    } else if (
                        dimensieObject.Status === 'Vigerend' &&
                        dimensionHistory[index + 1]?.Status !== 'Vastgesteld'
                    ) {
                        /* If item is vigerend and hasn't been through the whole process of the statusses */
                        return (
                            <Fragment key={dimensieObject.UUID}>
                                <li
                                    className={`relative flex items-center ml-8 ${
                                        index === 0 ? 'pt-12 pb-2' : 'pb-4 pt-5'
                                    }`}>
                                    <div className="absolute top-0 -left-[4px] inline-block w-full h-full border-l-2 border-pzh-yellow-dark" />
                                </li>
                                <li className="absolute flex items-center py-2 -mt-10">
                                    <div className="absolute left-0 z-10 inline-block bg-pzh-blue list-item-bolletje bolletje-left-min-10" />

                                    <div className="ml-16">
                                        <StatusBadge
                                            status={dimensieObject.Status}
                                        />
                                    </div>
                                </li>
                            </Fragment>
                        )
                    } else if (
                        dimensieObject.Status === 'Vigerend' &&
                        dimensionHistory[index + 1]
                    ) {
                        /* If item is vigerend and there is an item before it and an item after it */
                        return (
                            <Fragment key={dimensieObject.UUID}>
                                <VertakkingsItemRightOnLine />
                                <li className="absolute flex items-center py-2 -mt-5">
                                    <div className="absolute left-0 z-10 inline-block bg-pzh-blue list-item-bolletje bolletje-left-min-10" />

                                    <div className="ml-16">
                                        <StatusBadge
                                            status={dimensieObject.Status}
                                        />
                                    </div>
                                </li>
                                <VertakkingsItemLeftOnLine />
                            </Fragment>
                        )
                    } else {
                        if (!dimensieObject.Status) return

                        return (
                            <Fragment key={dimensieObject.UUID}>
                                <li
                                    className={`flex items-center ml-8 relative ${
                                        index === 0 ? 'pt-6 pb-2' : 'py-2'
                                    }`}>
                                    <div className="absolute top-0 -left-[4px] inline-block w-full h-full border-l-2 border-pzh-yellow-dark" />
                                    <div className="absolute left-0 inline-block bg-pzh-yellow-dark list-item-bolletje bolletje-left-min-10" />

                                    <div className="ml-8">
                                        <StatusBadge
                                            status={dimensieObject.Status}
                                        />
                                    </div>
                                </li>
                            </Fragment>
                        )
                    }
                })}
                {/* Element to fade out the start, only show if the first item (last in dimensionHistory) doesn't have a Status of 'Vigerend' */}
                {((dimensionHistory?.length > 1 &&
                    dimensionHistory[dimensionHistory.length - 1].Status !==
                        'Vigerend') ||
                    (dimensionHistory?.length === 1 &&
                        dimensionHistory[0].Status !== 'Vigerend')) && (
                    <li className="absolute bottom-0 left-0 block w-10 h-4 -ml-1 status-flow-gradient" />
                )}
            </ul>
        </div>
    )
}

const VertakkingsItemRightOnLine = ({ noMargin }: { noMargin?: boolean }) => (
    <li
        className={`relative text-pzh-yellow-dark ${
            noMargin
                ? 'vertakkings-item-right-on-line-no-margin'
                : 'vertakkings-item-right-on-line'
        }`}>
        <svg
            className="absolute svg-branch"
            width="46"
            height="40"
            viewBox="0 0 39 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M37 0C37 21 2 18 2 39.5"
                stroke={secondaryColor}
                strokeWidth="2"
            />
        </svg>
        <div className="block h-12" />
    </li>
)

const VertakkingsItemLeftOnLine = ({ showDot }: { showDot?: boolean }) => (
    <li className="relative vertakkings-item-left">
        {showDot && (
            <div className="absolute top-0 left-0 z-10 inline-block bg-pzh-blue list-item-bolletje bolletje-left-min-7" />
        )}
        <svg
            width="43"
            height="40"
            viewBox="0 0 39 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M2 0C2 21.2658 37 18.2278 37 40"
                stroke={secondaryColor}
                strokeWidth="2"
            />
        </svg>
    </li>
)

const StatusBadge = ({ status }: { status: string }) => (
    <div className="inline-block px-2 pt-1 text-xs text-gray-700 border border-gray-700 rounded">
        {status}
    </div>
)

export default StatusHistory
