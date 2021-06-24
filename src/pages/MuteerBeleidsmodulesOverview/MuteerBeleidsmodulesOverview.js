import React from 'react'
import { Link, useParams, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/pro-solid-svg-icons'

import allDimensies from './../../constants/dimensies'

import axios from '../../API/axios'

import ButtonBackToPage from './../../components/ButtonBackToPage'
import LoaderSpinner from './../../components/LoaderSpinner'

import handleError from './../../utils/handleError'

function MuteerBeleidsmodulesOverview({}) {
    const [currentBeleidsmodule, setCurrentBeleidsmodule] = React.useState([])
    const [policies, setPolicies] = React.useState([])
    const [dataLoaded, setDataLoaded] = React.useState(false)

    const params = useParams()
    const history = useHistory()

    /**
     * Function that gets and sets the beleidsmodules
     */
    const getAndSetBeleidsmodules = () => {
        axios
            .get(`/${allDimensies.BELEIDSMODULES.API_ENDPOINT}`)
            .then((res) => {
                const currentBeleidsmodule = findAndSetCurrentBeleidsmodule(
                    res.data
                )
                return currentBeleidsmodule
            })
            .then((currentBeleidsmodule) => {
                const policies = [
                    ...currentBeleidsmodule.Maatregelen,
                    ...currentBeleidsmodule.Beleidskeuzes,
                ]
                setPolicies(policies)
                setDataLoaded(true)
            })
            .catch((err) => {
                handleError(err)
            })
    }

    /**
     * Function to find the corresponding active beleidsmodule based on the single parameter from the URL and set it in state
     * @param {array} beleidsmodules - Contains the API response
     * @returns {null|object} currentBeleidsmodule or null if there is none found
     */
    const findAndSetCurrentBeleidsmodule = (beleidsmodules) => {
        const currentBeleidsmodule = beleidsmodules.find(
            (module) => module.ID === parseInt(params.single)
        )

        if (currentBeleidsmodule) {
            setCurrentBeleidsmodule(currentBeleidsmodule)
            return currentBeleidsmodule
        } else {
            toast('Deze beleidsmodule kon niet gevonden worden')
            history.push(`/muteer/${allDimensies.BELEIDSMODULES.SLUG_OVERVIEW}`)
            return null
        }
    }

    React.useEffect(() => {
        getAndSetBeleidsmodules()
    }, [])

    return (
        <div className="container flex flex-col pb-8 mx-auto sm:px-6 lg:px-8">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block w-full align-middle">
                    <ButtonBackToPage
                        terugNaar={'overzicht'}
                        url={`/muteer/${allDimensies.BELEIDSMODULES.SLUG_OVERVIEW}`}
                    />
                    <div className="pb-16 overflow-hidden rounded-md shadow-md sm:rounded-lg">
                        <div className="flex justify-between w-full px-6 pt-4">
                            <div>
                                <span className="text-lg font-bold text-gray-500">
                                    Module
                                </span>
                                <h1 className="mt-1 text-2xl text-pzh-blue-dark">
                                    {currentBeleidsmodule.Titel}
                                </h1>
                            </div>
                        </div>
                        {dataLoaded ? (
                            <div className="px-6">
                                <div
                                    className="block w-full px-3 py-2 my-4 rounded-md bg-pzh-blue-dark"
                                    style={{
                                        backgroundColor:
                                            'RGBA(39, 174, 96, 0.1)',
                                    }}
                                >
                                    In de module {currentBeleidsmodule.Titel}{' '}
                                    zitten{' '}
                                    <span className="font-bold">
                                        {policies.length} beleidsstukken
                                    </span>
                                </div>
                            </div>
                        ) : null}
                        <div className="px-4">
                            {dataLoaded ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-3 py-3 text-sm font-medium tracking-wider text-left text-gray-800"
                                            >
                                                Titel
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3 text-sm font-medium tracking-wider text-left text-gray-800"
                                            >
                                                Beleidsstuk
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3 text-sm font-medium tracking-wider text-left text-gray-800"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3 text-sm font-medium tracking-wider text-left text-gray-800"
                                            >
                                                UUID
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3 text-sm font-medium tracking-wider text-left text-gray-800"
                                            >
                                                Bewerkingsdatum
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {policies.length === 0 ? (
                                            <span className="block px-3 py-4 text-sm font-medium">
                                                U heeft nog geen beleid in de
                                                module.
                                            </span>
                                        ) : (
                                            policies.map((policy) => (
                                                <TableRow policy={policy} />
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex items-center justify-center w-full mt-12">
                                    <LoaderSpinner />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const TableRow = ({ policy }) => {
    return (
        <tr key={policy.Object.UUID}>
            <TableDataCell>{policy.Object.Titel}</TableDataCell>
            <TableDataCell>
                {policy.Object.hasOwnProperty('Aanpassing_Op')
                    ? 'Beleidskeuze'
                    : 'Maatregel'}
            </TableDataCell>
            <TableDataCell>{policy.Object.Status}</TableDataCell>
            <TableDataCell>{policy.Object.UUID}</TableDataCell>
            <TableDataCell>
                {new Intl.DateTimeFormat('nl-NL', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                }).format(new Date(policy.Object.Modified_Date))}
            </TableDataCell>
        </tr>
    )
}

const TableDataCell = ({ className, children }) => (
    <td
        className={`px-3 py-3 text-sm text-gray-800 whitespace-nowrap ${
            className ? className : ''
        }`}
    >
        {children}
    </td>
)

export default MuteerBeleidsmodulesOverview
