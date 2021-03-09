import React, { Component } from 'react'
import { toast } from 'react-toastify'
import { Link, useLocation } from 'react-router-dom'

import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import axios from './../../../API/axios'

const ViewFieldBelangen = ({ fieldValue }) => {
    const [belangen, setBelangen] = React.useState(fieldValue)
    const [nationaleBelangen, setNationaleBelangen] = React.useState([])
    const [wettelijkeTaken, setWettelijkeTaken] = React.useState([])
    const [dataLoaded, setDataLoaded] = React.useState(false)

    React.useEffect(() => {
        const promiseArray = belangen.map((item, index) =>
            axios
                .get(`/belangen/version/${item.UUID}`)
                .then((res) => {
                    belangen[index].data = res.data
                    belangen[index].Titel = res.data.Titel
                    belangen[index].Type = res.data.Type
                    belangen[index].ID = res.data.ID

                    setBelangen(belangen)
                })
                .catch((err) => {
                    console.log(err)
                    toast(process.env.REACT_APP_ERROR_MSG)
                })
        )

        Promise.all(promiseArray).then(() => {
            const nationaleBelangen = belangen.filter(
                (item) => item.Type === 'Nationaal Belang'
            )
            const wettelijkeTaken = belangen.filter(
                (item) => item.Type === 'Wettelijke Taak & Bevoegdheid'
            )

            setDataLoaded(true)
            setNationaleBelangen(nationaleBelangen)
            setWettelijkeTaken(wettelijkeTaken)
        })
    }, [])

    return dataLoaded ? (
        <div>
            {nationaleBelangen && nationaleBelangen.length > 0 ? (
                <div className="mb-6">
                    <h2 className="block mb-1 text-lg font-semibold tracking-wide text-gray-800">
                        Nationaal belang
                    </h2>
                    <ul className="mt-1">
                        {nationaleBelangen.map((item) => (
                            <BelangenListItem item={item} />
                        ))}
                    </ul>
                </div>
            ) : null}
            {wettelijkeTaken && wettelijkeTaken.length > 0 ? (
                <div className="mb-6">
                    <h2 className="block mb-1 text-lg font-semibold tracking-wide text-gray-800">
                        Wettelijke taak en bevoegdheid
                    </h2>
                    <ul className="mt-1">
                        {wettelijkeTaken.map((item) => (
                            <BelangenListItem item={item} />
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
