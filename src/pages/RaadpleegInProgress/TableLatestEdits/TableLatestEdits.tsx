import {
    faSortAmountDownAlt,
    faSortAmountUpAlt,
} from '@fortawesome/pro-regular-svg-icons'
import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tippy from '@tippyjs/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import 'tippy.js/dist/tippy.css'

import { GetEdits200Item } from '@/api/fetchers.schemas'
import { LoaderCard } from '@/components/Loader'
import getDimensionsConstants from '@/utils/getDimensionsConstants'

export interface TableLatestEditsProps {
    edits?: GetEdits200Item[]
    isLoading?: boolean
}
function TableLatestEdits({ edits = [], isLoading }: TableLatestEditsProps) {
    // ascending descending state
    const [ascending, setAscending] = useState(true)

    const sortedEdits = ascending
        ? edits.sort(
              (a, b) =>
                  (new Date(b.Modified_Date!) as any) -
                  (new Date(a.Modified_Date!) as any)
          )
        : edits
              .sort(
                  (a, b) =>
                      (new Date(b.Modified_Date!) as any) -
                      (new Date(a.Modified_Date!) as any)
              )
              .reverse()

    if (isLoading) {
        return (
            <div className="col-span-6 my-8">
                <LoaderCard mb="mb-2" height="30" />
                <LoaderCard mb="mb-2" height="60" />
                <LoaderCard mb="mb-2" height="60" />
                <LoaderCard mb="mb-2" height="60" />
            </div>
        )
    }

    const getLink = (item: GetEdits200Item) => {
        if (!item.Type) return '/'

        const constants = getDimensionsConstants(item.Type)

        const slug = constants.SLUG_OVERVIEW
        return `detail/${slug}/${item.UUID}`
    }

    return (
        <div className="flex flex-col col-span-6 pb-12 mt-4">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full py-2 align-middle">
                    <div className="overflow-hidden">
                        <table className="table-fixed">
                            <thead className="border-b border-gray-300">
                                <tr>
                                    <th
                                        scope="col"
                                        className="w-2/5 py-3 pr-6 font-bold text-left text-pzh-blue-dark">
                                        Titel
                                    </th>
                                    <th
                                        scope="col"
                                        className="w-1/5 px-6 py-3 font-bold text-left text-pzh-blue-dark">
                                        Type
                                    </th>
                                    <th
                                        scope="col"
                                        className="w-1/5 px-6 py-3 font-bold text-left text-pzh-blue-dark">
                                        Laatste Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="w-1/5 px-6 py-3 font-bold text-left cursor-pointer text-pzh-blue-dark">
                                        <button
                                            onClick={() =>
                                                setAscending(!ascending)
                                            }>
                                            Laatst bewerkt{' '}
                                            <FontAwesomeIcon
                                                className={`ml-2 text-base relative -mt-2`}
                                                icon={
                                                    ascending
                                                        ? faSortAmountDownAlt
                                                        : faSortAmountUpAlt
                                                }
                                            />
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedEdits.map(policyObject => (
                                    <tr
                                        key={policyObject.UUID}
                                        className="border-b border-gray-300">
                                        <td className="py-4 pr-6 text-gray-800">
                                            {policyObject.UUID ? (
                                                <Link
                                                    to={getLink(policyObject)}
                                                    className="underline text-pzh-green hover:text-pzh-green-dark">
                                                    {policyObject.Titel}
                                                </Link>
                                            ) : (
                                                policyObject.Titel
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-800">
                                            {policyObject.Type}
                                        </td>

                                        <td className="px-6 py-4 text-gray-800">
                                            <StatusComponent
                                                policyObject={policyObject}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-gray-800">
                                            {new Intl.DateTimeFormat('nl-NL', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            }).format(
                                                new Date(
                                                    policyObject.Modified_Date!
                                                )
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

const StatusComponent = ({
    policyObject,
}: {
    policyObject: GetEdits200Item
}) => {
    const [tippyOpen, setTippyOpen] = useState(false)

    return (
        <span onClick={() => setTippyOpen(!tippyOpen)}>
            {policyObject.Status}{' '}
            <Tippy
                visible={tippyOpen}
                content={
                    <a
                        onClick={() => setTippyOpen(false)}
                        className="text-sm pointer-events-auto"
                        href="#besluitvormingsproces">
                        <span className="block font-bold">
                            {policyObject.Status}
                        </span>
                        <span className="block">
                            Bekijk de uitleg en betekenis van statussen{' '}
                            <span className="underline">hier</span>
                        </span>
                    </a>
                }>
                <div className="inline-block ml-1 transition-colors duration-500 ease-in cursor-pointer text-pzh-dark-blue opacity-40 hover:opacity-80">
                    <FontAwesomeIcon icon={faInfoCircle} />
                </div>
            </Tippy>
        </span>
    )
}

export default TableLatestEdits
