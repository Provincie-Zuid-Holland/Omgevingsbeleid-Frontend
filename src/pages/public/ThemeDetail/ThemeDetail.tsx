import { Heading, Hyperlink, ListLink } from '@pzh-ui/components'

import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'

import { useBeleidsdoelViewObjectVersion } from '@/api/fetchers'
import { HierachyReference } from '@/api/fetchers.schemas'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Container } from '@/components/Container'
import ObjectContent from '@/components/DynamicObject/ObjectContent'
import Sidebar from '@/components/DynamicObject/ObjectSidebar'
import { LoaderContent, LoaderSpinner } from '@/components/Loader'
import * as models from '@/config/objects'
import { Model, ModelReturnType, ModelType } from '@/config/objects/types'
import { generateObjectPath } from '@/utils/dynamicObject'
import { sortByFields } from '@/utils/sortByFields'

import NotFoundPage from '../NotFoundPage'

function ThemeDetail() {
    const { id } = useParams<{ id: string }>()

    const {
        data = {},
        isLoading,
        isError,
    } = useBeleidsdoelViewObjectVersion(id!)

    const breadcrumbPaths = [
        { name: 'Home', to: '/' },
        { name: 'Omgevingsprogramma', to: '/omgevingsprogramma' },
        {
            name: 'Thematische programma’s',
            to: '/omgevingsprogramma/thematische-programmas',
        },
        {
            name: data?.title || '',
        },
    ]

    const sortedItems = sortByFields(data?.hierarchy_children ?? [], [
        item => item.title,
    ])

    if (isLoading) return <LoaderContent />

    if (isError) return <NotFoundPage />

    return (
        <>
            <Helmet title={data?.title}>
                {data?.description && (
                    <>
                        <meta
                            name="description"
                            content={
                                data.description
                                    ?.substring(0, 100)
                                    .replace('<p>', '') + '...'
                            }
                        />
                        <meta
                            name="og:description"
                            content={
                                data.description
                                    ?.substring(0, 100)
                                    .replace('<p>', '') + '...'
                            }
                        />
                    </>
                )}
            </Helmet>

            <Container className="pt-4 pb-16">
                <div className="col-span-6 mb-8">
                    <Breadcrumbs items={breadcrumbPaths} />
                </div>

                <div className="order-2 col-span-6 mt-6 flex flex-col xl:col-span-4 xl:mt-0">
                    <Heading
                        level="1"
                        size="xxl"
                        className="order-2 mt-4 mb-2 md:order-3 md:mb-4">
                        {data?.title}
                    </Heading>

                    <Heading level="2" size="m" className="order-1">
                        Thematisch programma
                    </Heading>

                    <div className="order-3">
                        <ObjectContent data={data || {}} />

                        <Hyperlink asChild>
                            <Link
                                to={generateObjectPath(
                                    'beleidsdoel',
                                    data?.id
                                )}>
                                Lees meer informatie over dit beleidsdoel
                            </Link>
                        </Hyperlink>
                    </div>

                    {data?.hierarchy_children && (
                        <div className="order-4 mt-8 flex flex-col gap-8">
                            {sortedItems.map(object => (
                                <ConnectedObject key={object.id} {...object} />
                            ))}
                        </div>
                    )}
                </div>

                <div className="order-1 col-span-6 xl:col-span-2">
                    <Sidebar
                        model={models.beleidsdoel}
                        hideRevisions
                        {...data}
                    />
                </div>
            </Container>
        </>
    )
}

const ConnectedObject = ({ id, object_type, title }: HierachyReference) => {
    const model: Model = models[object_type as ModelType]

    const { singularReadable, prefixSingular } = model.defaults
    const { useGetVersion } = model.fetchers

    const { data, isFetching } =
        useGetVersion<ModelReturnType>?.(id!, {
            query: { enabled: !!id },
        }) || {}

    return (
        <div className="grid gap-3" data-section={title ?? undefined}>
            <Heading level="2" size="m">
                {title}
            </Heading>

            <ConnectedObjectChildren
                items={data?.hierarchy_children}
                isFetching={isFetching}
            />

            <Hyperlink asChild>
                <Link to={generateObjectPath(object_type as ModelType, id)}>
                    Lees meer informatie over {prefixSingular}{' '}
                    {singularReadable} '{title}'
                </Link>
            </Hyperlink>
        </div>
    )
}

interface ConnectedObjectChildrenProps {
    items?: HierachyReference[]
    isFetching?: boolean
}

const ConnectedObjectChildren = ({
    items = [],
    isFetching,
}: ConnectedObjectChildrenProps) => {
    if (isFetching) {
        return <LoaderSpinner />
    }

    if (items.length === 0) {
        return (
            <span className="text-pzh-gray-600 italic">
                Er zijn geen maatregelen gekoppeld
            </span>
        )
    }

    const sortedItems = sortByFields(items, [item => item.title])

    return (
        <div className="flex flex-col">
            {sortedItems.map(item => (
                <ListLink
                    asChild
                    key={item.id}
                    className="text-pzh-green-500 hover:text-pzh-blue-500">
                    <Link
                        to={generateObjectPath(
                            item.object_type as ModelType,
                            item.id
                        )}>
                        {item.title}
                    </Link>
                </ListLink>
            ))}
        </div>
    )
}

export default ThemeDetail
