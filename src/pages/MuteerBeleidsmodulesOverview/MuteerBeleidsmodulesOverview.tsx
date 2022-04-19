import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { getBeleidsmodules } from '@/api/fetchers'
import {
    BeleidsmodulesRead,
    BeleidsmodulesReadBeleidskeuzesItem,
    BeleidsmodulesReadMaatregelenItem,
} from '@/api/fetchers.schemas'
import ButtonBackToPage from '@/components/ButtonBackToPage'
import { LoaderSpinner } from '@/components/Loader'
import allDimensies from '@/constants/dimensies'
import useModuleFilter from '@/hooks/useModuleFilter'
import useModuleSort from '@/hooks/useModuleSort'
import handleError from '@/utils/handleError'

import ModuleAmount from './ModuleAmount'
import ModuleFilters from './ModuleFilters'
import SortIcon from './SortIcon'
import TableHeading from './TableHeading'
import TableRow from './TableRow'

type ModuleParams = {
    single: string
}

/**
 * @returns A component that renders an overview of a specific Beleidsmodule
 */
function MuteerBeleidsmodulesOverview() {
    const [currentBeleidsmodule, setCurrentBeleidsmodule] =
        useState<BeleidsmodulesRead>()
    const [policies, setPolicies] = useState<
        (
            | BeleidsmodulesReadBeleidskeuzesItem
            | BeleidsmodulesReadMaatregelenItem
        )[]
    >([])
    const [dataLoaded, setDataLoaded] = useState(false)

    const [sorting, setSorting, sortPolicies] = useModuleSort()
    const [filters, setFilters, filterPolicies] = useModuleFilter()

    const params = useParams<ModuleParams>()
    const navigate = useNavigate()

    /**
     * Effect to init the component:
     * 1. Get and set all the beleidsmodules in state
     * 2. Get and set the currently active beleidsmodule in state
     */
    useEffect(() => {
        /**
         * Function to find the corresponding active beleidsmodule based on the single parameter from the URL and set it in state
         */
        const findAndSetCurrentBeleidsmodule = (
            beleidsmodules: BeleidsmodulesRead[]
        ) => {
            const currentBeleidsmodule = beleidsmodules.find(
                module => module.ID === parseInt(params.single!)
            )

            if (currentBeleidsmodule) {
                setCurrentBeleidsmodule(currentBeleidsmodule)
                return currentBeleidsmodule
            } else {
                toast('Deze beleidsmodule kon niet gevonden worden')
                navigate(
                    `/muteer/${allDimensies.BELEIDSMODULES.SLUG_OVERVIEW}`,
                    { replace: true }
                )
            }
        }

        /**
         * Function that gets and sets the beleidsmodules
         */
        const getAndSetBeleidsmodules = async () => {
            try {
                const beleidsmodules = await getBeleidsmodules()
                const currentBeleidsmodule =
                    findAndSetCurrentBeleidsmodule(beleidsmodules)
                if (!currentBeleidsmodule) {
                    throw 'no current beleidsmodule'
                }
                const policies = [
                    ...(currentBeleidsmodule.Maatregelen || []),
                    ...(currentBeleidsmodule.Beleidskeuzes || []),
                ]
                setPolicies(policies)
                setFilters({ type: 'init', policies: policies })
                setDataLoaded(true)
            } catch (err: any) {
                handleError(err)
            }
        }

        getAndSetBeleidsmodules()
    }, [navigate, params, setFilters])

    return (
        <div className="container flex flex-col pb-8 mx-auto sm:px-6 lg:px-8">
            <div className="mt-5">
                <div className="inline-block w-full align-middle">
                    <ButtonBackToPage
                        terugNaar={'overzicht'}
                        url={`/muteer/${allDimensies.BELEIDSMODULES.SLUG_OVERVIEW}`}
                    />
                    <div className="pb-16 bg-white rounded-md shadow-md">
                        <div className="flex items-end justify-between w-full px-6 pt-4">
                            <div>
                                <span className="text-lg font-bold text-gray-500">
                                    Module
                                </span>
                                <h1 className="mt-1 text-2xl text-pzh-blue-dark">
                                    {currentBeleidsmodule?.Titel}
                                </h1>
                            </div>
                            <ModuleFilters
                                filters={filters}
                                setFilters={setFilters}
                            />
                        </div>
                        {dataLoaded && currentBeleidsmodule ? (
                            <ModuleAmount
                                currentBeleidsmodule={currentBeleidsmodule}
                                policies={policies}
                            />
                        ) : null}
                        <div className="px-4 pb-4 overflow-x-auto">
                            {dataLoaded ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <TableHeading
                                                property={'title'}
                                                sorting={sorting}
                                                setSorting={setSorting}
                                                label="Titel">
                                                <SortIcon
                                                    sorting={sorting}
                                                    property="title"
                                                />
                                            </TableHeading>

                                            <TableHeading
                                                property={'type'}
                                                sorting={sorting}
                                                setSorting={setSorting}
                                                label="Type beleid">
                                                <SortIcon
                                                    sorting={sorting}
                                                    property="type"
                                                />
                                            </TableHeading>

                                            <TableHeading
                                                label="Status"
                                                noIcon
                                            />

                                            <TableHeading label="UUID" noIcon />

                                            <TableHeading
                                                property={'date'}
                                                sorting={sorting}
                                                setSorting={setSorting}
                                                label="Bewerkingsdatum">
                                                <SortIcon
                                                    sorting={sorting}
                                                    property="date"
                                                />
                                            </TableHeading>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {policies.length === 0 ? (
                                            <span className="block px-3 py-4 text-sm font-medium text-gray-700">
                                                Je hebt nog geen beleid in de
                                                module.
                                            </span>
                                        ) : (
                                            policies
                                                .sort((a, b) => {
                                                    return sortPolicies(
                                                        a,
                                                        b,
                                                        sorting
                                                    )
                                                })
                                                .filter(policy => {
                                                    return filterPolicies(
                                                        policy,
                                                        filters
                                                    )
                                                })
                                                .map((policy, index) => (
                                                    <TableRow
                                                        key={`policy-${index}`}
                                                        policy={policy}
                                                    />
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

export default MuteerBeleidsmodulesOverview
