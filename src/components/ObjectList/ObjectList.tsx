import { FieldInput, Heading, ListLink, Pagination } from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'
import { KeyboardEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUpdateEffect } from 'react-use'

import { LoaderCard, LoaderSpinner } from '@/components/Loader'

interface ObjectListProps {
    /** Type of the object */
    objectType: string
    /** Slug of the object */
    objectSlug: string
    /** Singular of the object */
    objectSingular?: string
    /** Array of objects */
    data: {
        Title?: string
        UUID?: string
    }[]
    /** Is data loading */
    isLoading?: boolean
    /** Is data searchable */
    hasSearch?: boolean
    /** Title of list */
    title?: string
    /** Total number of items */
    total?: number
    /** Limit number per page */
    limit?: number
    /** Current page */
    currPage?: number
    /** On page change */
    onPageChange?: (page: number) => void
}

const ObjectList = ({
    data,
    objectType,
    objectSlug,
    objectSingular,
    isLoading,
    hasSearch = true,
    title,
    total = 0,
    limit = 20,
    currPage,
    onPageChange,
}: ObjectListProps) => {
    const navigate = useNavigate()

    const [pagination, setPagination] = useState({
        isLoaded: false,
        total,
        limit,
    })

    /**
     * Handle change of search field
     */
    const handleChange = (e: KeyboardEvent) => {
        const searchParams = new URLSearchParams(window.location.search)

        if (e.key === 'Enter' && objectSingular) {
            const value = (e.target as HTMLInputElement).value

            searchParams.delete('query')
            searchParams.append('query', value)

            searchParams.delete('filter')
            searchParams.append('filter', objectSingular)

            searchParams.delete('page')

            navigate({
                pathname: '/zoekresultaten',
                search: `?${searchParams}`,
            })
        }
    }

    useUpdateEffect(() => {
        if (!pagination.isLoaded && !!total) {
            setPagination({ isLoaded: true, total, limit })
        }
    }, [total, limit])

    useUpdateEffect(() => {
        if (pagination.isLoaded) {
            setPagination({ isLoaded: false, total, limit })
        }
    }, [objectType])

    return (
        <>
            <div className="flex flex-col justify-between sm:flex-row">
                <Heading as="2" level="3" className="mb-3">
                    {title
                        ? title
                        : !pagination.isLoaded && isLoading
                        ? `De ${objectType} worden geladen`
                        : `De ${pagination.total} ${objectType}`}
                    {isLoading && <LoaderSpinner className="ml-2" />}
                </Heading>
            </div>

            {hasSearch &&
                objectSingular &&
                !isLoading &&
                !!pagination.total &&
                pagination.total > pagination.limit && (
                    <div className="my-4">
                        <FieldInput
                            name="search"
                            placeholder={`Zoek in ${objectType}`}
                            icon={MagnifyingGlass}
                            onKeyDown={handleChange}
                        />
                    </div>
                )}
            <ul className="mt-2">
                {isLoading ? (
                    <li className="mt-6">
                        <LoaderCard height="25" />
                        <LoaderCard height="25" />
                        <LoaderCard height="25" />
                    </li>
                ) : (
                    data?.map((obj, index) => (
                        <li key={index} className="py-0.5">
                            <ListLink
                                text={obj.Title || ''}
                                to={`/${objectSlug}/${obj.UUID}`}
                            />
                        </li>
                    ))
                )}
            </ul>
            {onPageChange && pagination.total > pagination.limit && (
                <div className="mt-8 flex justify-center">
                    <Pagination
                        onChange={onPageChange}
                        total={pagination.total}
                        limit={pagination.limit}
                        forcePage={currPage}
                    />
                </div>
            )}
        </>
    )
}

export default ObjectList
