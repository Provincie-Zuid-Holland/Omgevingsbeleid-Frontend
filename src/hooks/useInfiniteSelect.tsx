import { FieldSelectProps } from '@pzh-ui/components'
import { CSSProperties, useEffect, useMemo, useRef } from 'react'

import { LoaderSpinner } from '@/components/Loader'
import { QueryKey, useInfiniteQuery } from '@tanstack/react-query'

interface PagedResponse {
    offset?: number
    results: unknown[]
    total: number
}

interface InfiniteSelectQueryOptions<TPage extends PagedResponse> {
    queryKey: QueryKey
    queryFn: (offset: number, signal: AbortSignal) => Promise<TPage>
    enabled?: boolean
}

export const useInfiniteSelectQuery = <TPage extends PagedResponse>({
    queryKey,
    queryFn,
    enabled = true,
}: InfiniteSelectQueryOptions<TPage>) =>
    useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam, signal }) => queryFn(pageParam, signal),
        initialPageParam: 0,
        getNextPageParam: lastPage => {
            const nextOffset = (lastPage.offset ?? 0) + lastPage.results.length

            return nextOffset < lastPage.total ? nextOffset : undefined
        },
        enabled,
    })

interface InfiniteSelectComponentsOptions {
    fetchNextPage: () => unknown
    hasNextPage: boolean
    isFetchingNextPage: boolean
}

interface StableInfiniteOptionsOptions<
    TItem,
    TToOption extends (item: TItem) => object,
> {
    pages?: { results: TItem[] }[]
    getKey: (item: TItem) => string | number
    toOption: TToOption
    includeItem?: (item: TItem) => boolean
}

export const useStableInfiniteOptions = <
    TItem,
    TToOption extends (item: TItem) => object,
>({
    pages,
    getKey,
    toOption,
    includeItem = () => true,
}: StableInfiniteOptionsOptions<TItem, TToOption>) => {
    const optionCache = useRef(
        new Map<string | number, ReturnType<TToOption>>()
    )

    return useMemo(
        () =>
            pages?.flatMap(page =>
                page.results.filter(includeItem).map(item => {
                    const key = getKey(item)
                    const nextOption = toOption(item) as ReturnType<TToOption>
                    const cachedOption = optionCache.current.get(key)

                    if (cachedOption) {
                        Object.assign(cachedOption, nextOption)
                        return cachedOption
                    }

                    optionCache.current.set(key, nextOption)
                    return nextOption
                })
            ),
        [getKey, includeItem, pages, toOption]
    )
}

export const useInfiniteSelectComponents = ({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
}: InfiniteSelectComponentsOptions) => {
    const fetchNextPageRef = useRef(fetchNextPage)
    const hasNextPageRef = useRef(hasNextPage)
    const isFetchingNextPageRef = useRef(isFetchingNextPage)

    fetchNextPageRef.current = fetchNextPage
    hasNextPageRef.current = hasNextPage
    isFetchingNextPageRef.current = isFetchingNextPage

    return useMemo<FieldSelectProps['components']>(
        () => ({
            MenuList: function MenuList(props) {
                const loadMoreRef = useRef<HTMLDivElement>(null)

                useEffect(() => {
                    const loadMoreElement = loadMoreRef.current
                    const menuList = loadMoreElement?.parentElement

                    if (!loadMoreElement || !menuList) return

                    const observer = new IntersectionObserver(
                        entries => {
                            if (
                                entries[0].isIntersecting &&
                                hasNextPageRef.current &&
                                !isFetchingNextPageRef.current
                            ) {
                                fetchNextPageRef.current()
                            }
                        },
                        { root: menuList, rootMargin: '0px 0px 80px 0px' }
                    )

                    observer.observe(loadMoreElement)

                    return () => observer.disconnect()
                }, [])

                return (
                    <div
                        {...props.innerProps}
                        ref={props.innerRef}
                        className={props.cx(
                            {
                                'menu-list': true,
                                'menu-list--is-multi': props.isMulti,
                            },
                            props.getClassNames('menuList', props)
                        )}
                        style={
                            props.getStyles('menuList', props) as CSSProperties
                        }>
                        {props.children}
                        <div
                            ref={loadMoreRef}
                            className={
                                hasNextPageRef.current ||
                                isFetchingNextPageRef.current
                                    ? 'flex min-h-8 justify-center py-2'
                                    : 'h-0'
                            }>
                            {isFetchingNextPageRef.current && <LoaderSpinner />}
                        </div>
                    </div>
                )
            },
        }),
        []
    )
}
