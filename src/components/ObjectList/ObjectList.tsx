import { Heading, ListLink, Pagination } from '@pzh-ui/components'
import { Link } from 'react-router-dom'

import { LoaderCard, LoaderSpinner } from '@/components/Loader'
import SearchBar from '../SearchBar'

interface ObjectListProps {
    /** Type of the object */
    objectType: string
    /** Slug of the object */
    objectSlug: string
    /** Singular of the object */
    objectSingular?: string
    /** Key of object */
    objectKey?: 'uuid' | 'id'
    /** Array of objects */
    data?: {
        Title?: string | null
        UUID?: string
        Object_ID?: number
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
    objectKey = 'uuid',
    isLoading,
    hasSearch = true,
    title,
    total = 0,
    limit = 20,
    currPage,
    onPageChange,
}: ObjectListProps) => (
    <>
        <div className="flex flex-col justify-between sm:flex-row">
            <Heading size="m" level="2" className="mb-3">
                {title
                    ? title
                    : isLoading
                      ? `De ${objectType} worden geladen`
                      : `De ${total} ${objectType}`}
                {isLoading && <LoaderSpinner className="ml-2" />}
            </Heading>
        </div>

        {hasSearch &&
            objectSingular &&
            !isLoading &&
            !!total &&
            total > limit && (
                <div className="my-4">
                    <SearchBar
                        placeholder={`Zoek in ${objectType}`}
                        filter={objectSingular}
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
                        <ListLink asChild>
                            <Link
                                to={`/${objectSlug}/${
                                    objectKey === 'uuid'
                                        ? obj.UUID
                                        : obj.Object_ID
                                }`}>
                                {obj.Title}
                            </Link>
                        </ListLink>
                    </li>
                ))
            )}
        </ul>
        {onPageChange && total > limit && (
            <div className="mt-8 flex justify-center">
                <Pagination
                    onPageChange={onPageChange}
                    total={total}
                    limit={limit}
                    current={currPage || 1}
                />
            </div>
        )}
    </>
)

export default ObjectList
