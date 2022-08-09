import React from 'react'

export interface RevisionOverviewBelangenProps {
    label: string
    object: any
    type: string
    containsChanges?: boolean
    placeholder: string
}

/**
 * Objects can have connections
 */
const RevisionOverviewBelangen = ({
    label,
    object,
    type,
    containsChanges = false,
    placeholder,
}: RevisionOverviewBelangenProps) => {
    const getBelangen = (
        containsChanges: boolean,
        object: any,
        type: string
    ) => {
        if (!containsChanges) {
            return object.Belangen.filter(
                (e: any) => e.Object.Type === type
            ).map((e: any) => e.Object)
        } else {
            const belangen: any[] = []
            Object.keys(object.Belangen).forEach(key =>
                object.Belangen[key].forEach((belang: any) => {
                    belangen.push({ ...belang.Object, changeType: key })
                })
            )
            return belangen.filter(e => e.Type === type)
        }
    }

    const getContainerStyle = (object: any) =>
        object.changeType === 'removed'
            ? { backgroundColor: '#f4c9c6', textDecoration: 'line-through' } // Removed - Red
            : object.changeType === 'new'
            ? { backgroundColor: '#e5f0ef' } // New     - Green
            : { backgroundColor: '#f2f2f7' } // Default - Purple

    const belangenFromChangeObject = getBelangen(containsChanges, object, type)

    return (
        <div className="mb-8">
            {label ? (
                <h3 className="block mb-3 text-lg font-semibold tracking-wide text-gray-800">
                    {label}
                </h3>
            ) : null}
            {belangenFromChangeObject && belangenFromChangeObject.length > 0 ? (
                belangenFromChangeObject.map((belang: any, index: number) => {
                    const containerStyle = getContainerStyle(belang)
                    return (
                        <div
                            key={`belang-${index}`}
                            className={`p-5 mb-4 rounded-md`}
                            style={containerStyle}>
                            <span className="block mb-1 font-bold m-color-puple">
                                {belang.Titel}
                            </span>
                            <p className="w-full leading-6 text-gray-800 break-words whitespace-pre-line">
                                {belang.Omschrijving}
                            </p>
                        </div>
                    )
                })
            ) : (
                <span className="italic text-gray-700">{placeholder}</span>
            )}
        </div>
    )
}

export default RevisionOverviewBelangen
