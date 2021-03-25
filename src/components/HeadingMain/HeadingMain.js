import React from 'react'

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
                    className={`inline-block font-bold relative -mt-4 px-2 pt-2 pb-1 text-xs border rounded ${
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
