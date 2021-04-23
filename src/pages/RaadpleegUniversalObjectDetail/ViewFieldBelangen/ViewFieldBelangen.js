import React from 'react'
import { Link, useLocation } from 'react-router-dom'

// import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { faAngleRight } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ViewFieldBelangen = ({ fieldValue }) => {
    const [nationaleBelangen, setNationaleBelangen] = React.useState([])
    const [wettelijkeTaken, setWettelijkeTaken] = React.useState([])
    const [dataLoaded, setDataLoaded] = React.useState(false)

    React.useEffect(() => {
        setNationaleBelangen(
            fieldValue.filter((item) => item.Object.Type === 'Nationaal Belang')
        )
        setWettelijkeTaken(
            fieldValue.filter(
                (item) => item.Object.Type === 'Wettelijke Taak & Bevoegdheid'
            )
        )
        setDataLoaded(true)
    }, [fieldValue])

    return dataLoaded ? (
        <div>
            {nationaleBelangen && nationaleBelangen.length > 0 ? (
                <div className="mb-6">
                    <h2 className="block mb-1 text-lg font-bold tracking-wide text-pzh-blue">
                        Nationaal belang
                    </h2>
                    <ul className="mt-1">
                        {nationaleBelangen.map((item) => (
                            <BelangenListItem item={item.Object} />
                        ))}
                    </ul>
                </div>
            ) : null}
            {wettelijkeTaken && wettelijkeTaken.length > 0 ? (
                <div className="mb-6">
                    <h2 className="block mb-1 text-lg font-bold tracking-wide text-pzh-blue">
                        Wettelijke taak en bevoegdheid
                    </h2>
                    <ul className="mt-1">
                        {wettelijkeTaken.map((item) => (
                            <BelangenListItem item={item.Object} />
                        ))}
                    </ul>
                </div>
            ) : null}
        </div>
    ) : null
}

const BelangenListItem = ({ item }) => {
    const location = useLocation()

    return (
        <li
            className="w-full leading-7 text-gray-800 break-words whitespace-pre-line group"
            key={item.UUID}
        >
            <Link
                className="relative cursor-pointer"
                to={`/detail/belangen/${item.UUID}?fromPage=${location.pathname}`}
            >
                <FontAwesomeIcon
                    className="relative ml-0 text-base"
                    icon={faAngleRight}
                />
                <span className="inline-block pl-2 ml-0 group-hover:underline">
                    {item.Titel}
                </span>
            </Link>
        </li>
    )
}

export default ViewFieldBelangen
