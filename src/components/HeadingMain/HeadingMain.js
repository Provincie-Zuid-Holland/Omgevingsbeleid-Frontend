import React from 'react'

/**
 * Component that renders the HeadingMain component displaying a titel and status Vigerend or Gepubliceerd.
 *
 * @component
 *
 * @param {string} titel - Parameter containing a titel displayed in h1 tag.
 * @param {string} status - Parameter containing the status Vigerend or Gepubliceerd.
 */
const HeadingMain = ({ titel, status }) => {
    const isVigerend = status === 'Vigerend' || status === 'Gepubliceerd'

    return (
        <div className="relative">
            <h1 className="inline-block text-xl font-bold text-gray-800">
                <span className="mr-4">{titel}</span>
            </h1>
            {status ? (
                <span
                    id="object-status"
                    className={`inline-block font-bold relative -mt-4 px-2 pt-1 pb-1 text-xs border rounded ${
                        isVigerend
                            ? 'text-pzh-blue border-pzh-blue'
                            : 'text-pzh-yellow-dark border-pzh-yellow-dark'
                    }`}
                >
                    {status}
                </span>
            ) : null}
        </div>
    )
}

export default HeadingMain
