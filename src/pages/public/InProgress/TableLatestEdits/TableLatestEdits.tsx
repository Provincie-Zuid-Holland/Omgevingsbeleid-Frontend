import { Tooltip } from '@pzh-ui/components'
import { ArrowDownWideShort, ArrowUpWideShort, CircleInfo } from '@pzh-ui/icons'
import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'

import { LoaderCard } from '@/components/Loader'

export interface TableLatestEditsProps {
    edits?: any[]
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

    const getLink = (item: any) => {
        if (!item.Type) return '/'

        const slug = ''
        return `/${slug}/${item.UUID}`
    }

    return (
        <div className="col-span-6 mt-4 flex flex-col pb-12">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full py-2 align-middle">
                    <div className="overflow-hidden">
                        <table className="table-fixed">
                            <thead className="border-b border-gray-300">
                                <tr>
                                    <th
                                        scope="col"
                                        className="w-2/5 py-3 pr-6 text-left font-bold text-pzh-blue-dark">
                                        Titel
                                    </th>
                                    <th
                                        scope="col"
                                        className="w-1/5 px-6 py-3 text-left font-bold text-pzh-blue-dark">
                                        Type
                                    </th>
                                    <th
                                        scope="col"
                                        className="w-1/5 px-6 py-3 text-left font-bold text-pzh-blue-dark">
                                        Laatste Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="w-1/5 cursor-pointer px-6 py-3 text-left font-bold text-pzh-blue-dark">
                                        <button
                                            onClick={() =>
                                                setAscending(!ascending)
                                            }>
                                            Laatst bewerkt{' '}
                                            {ascending ? (
                                                <Fragment>
                                                    <span className="sr-only">
                                                        (oplopend)
                                                    </span>
                                                    <ArrowDownWideShort
                                                        size={16}
                                                        className="-mt-0.5 ml-2 inline-block"
                                                    />
                                                </Fragment>
                                            ) : (
                                                <Fragment>
                                                    <span className="sr-only">
                                                        (aflopend)
                                                    </span>
                                                    <ArrowUpWideShort
                                                        size={16}
                                                        className="-mt-0.5 ml-2 inline-block"
                                                    />
                                                </Fragment>
                                            )}
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
                                                    className="text-pzh-green underline hover:text-pzh-green-dark">
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

const StatusComponent = ({ policyObject }: { policyObject: any }) => (
    <span>
        {policyObject.Status}{' '}
        <Tooltip
            label={
                <div className="text-pzh-dark-blue ml-1 inline-block cursor-pointer opacity-40 transition-colors duration-500 ease-in hover:opacity-80">
                    <CircleInfo aria-hidden="true" />
                </div>
            }>
            <a
                className="pointer-events-auto text-sm"
                href="#besluitvormingsproces">
                <span className="block font-bold">{policyObject.Status}</span>
                <span className="block">
                    Bekijk de uitleg en betekenis van statussen{' '}
                    <span className="underline">hier</span>
                </span>
            </a>
        </Tooltip>
    </span>
)

export default TableLatestEdits
