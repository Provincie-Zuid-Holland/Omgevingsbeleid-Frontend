import {
    FieldInput,
    getHeadingStyles,
    ListLink,
    Text,
} from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMedia } from 'react-use'

import { LoaderCard, LoaderSpinner } from '@/components/Loader'

interface ObjectListProps {
    objectType: string
    objectSlug: string
    data?: {
        Titel?: string
        UUID?: string
    }[]
    isLoading?: boolean
    hasFilter?: boolean
    title?: string
    advancedSearch?: boolean
}

const ObjectList = ({
    data,
    objectType,
    objectSlug,
    isLoading,
    hasFilter = true,
    title,
    advancedSearch = true,
}: ObjectListProps) => {
    const isMobile = useMedia('(max-width: 640px)')
    const [filterQuery, setFilterQuery] = useState('')

    const filteredLength = useMemo(() => {
        if (!data) {
            return 0
        } else if (filterQuery === '') {
            return data.length
        } else {
            return data.filter(item =>
                item.Titel?.toLowerCase().includes(filterQuery.toLowerCase())
            ).length
        }
    }, [data, filterQuery])

    const sortedData = useMemo(
        () => data?.sort((a, b) => a.Titel!.localeCompare(b.Titel!)),
        [data]
    )

    return (
        <div>
            <div>
                <div className="flex flex-col justify-between sm:flex-row">
                    <h2
                        style={getHeadingStyles('3', isMobile)}
                        className="break-words text-pzh-blue">
                        {title
                            ? title
                            : isLoading
                            ? `De ${objectType} worden geladen`
                            : `De ${filteredLength} ${objectType}`}
                        {isLoading && <LoaderSpinner className="ml-2" />}
                    </h2>
                    {advancedSearch && (
                        <Link
                            className="block mt-2 mb-1 sm:mb-0 sm:mt-0"
                            to="/zoekresultaten">
                            <Text
                                className="underline"
                                color="text-pzh-green hover:text-pzh-green-dark">
                                uitgebreid zoeken
                            </Text>
                        </Link>
                    )}
                </div>

                {hasFilter && !isLoading && data && data?.length > 20 && (
                    <div className="my-4">
                        <FieldInput
                            name="search"
                            value={filterQuery}
                            onChange={e => setFilterQuery(e.target.value)}
                            placeholder={`Filter op titel binnen de ${objectType}`}
                            icon={MagnifyingGlass}
                        />
                    </div>
                )}
            </div>
            <ul className="mt-2">
                {isLoading ? (
                    <li className="mt-6">
                        <LoaderCard height="25" />
                        <LoaderCard height="25" />
                        <LoaderCard height="25" />
                    </li>
                ) : (
                    sortedData
                        ?.filter((item: any) =>
                            item.Titel.toLowerCase().includes(
                                filterQuery.toLowerCase()
                            )
                        )
                        ?.map((obj, index) => (
                            <li key={index} className="py-0.5">
                                <ListLink
                                    text={obj.Titel || ''}
                                    to={`/${objectSlug}/${obj.UUID}`}
                                />
                            </li>
                        ))
                )}
            </ul>
        </div>
    )
}

export default ObjectList
