import { Heading, Hyperlink, ListLink, Text } from '@pzh-ui/components'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'

import { useBeleidsdoelViewObjectVersion } from '@/api/fetchers'
import { HierachyReference } from '@/api/fetchers.schemas'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Container } from '@/components/Container'
import { LoaderContent, LoaderSpinner } from '@/components/Loader'
import * as models from '@/config/objects'
import { ModelReturnType, ModelType } from '@/config/objects/types'

import Sidebar from '@/components/DynamicObject/ObjectSidebar'
import { generateObjectPath } from '@/utils/dynamicObject'
import NotFoundPage from '../NotFoundPage'

const sortByTitle = (items: HierachyReference[]) =>
    [...items].sort((a, b) => (a.Title ?? '').localeCompare(b.Title ?? ''))

function ThemeDetail() {
    const { uuid } = useParams<{ uuid: string }>()

    const {
        data = {},
        isLoading,
        isError,
    } = useBeleidsdoelViewObjectVersion(uuid!)

    const breadcrumbPaths = [
        { name: 'Home', to: '/' },
        { name: 'Omgevingsprogramma', to: '/omgevingsprogramma' },
        {
            name: 'Thematische programma’s',
            to: '/omgevingsprogramma/thematische-programmas',
        },
        {
            name: data?.Title || '',
        },
    ]

    if (isLoading) return <LoaderContent />

    if (isError) return <NotFoundPage />

    return (
        <>
            <Helmet title={data?.Title}>
                {data?.Description && (
                    <>
                        <meta
                            name="description"
                            content={
                                data.Description?.substring(0, 100).replace(
                                    '<p>',
                                    ''
                                ) + '...'
                            }
                        />
                        <meta
                            name="og:description"
                            content={
                                data.Description?.substring(0, 100).replace(
                                    '<p>',
                                    ''
                                ) + '...'
                            }
                        />
                    </>
                )}
            </Helmet>

            <Container className="pb-20">
                <div className="col-span-6 mb-10">
                    <Breadcrumbs items={breadcrumbPaths} className="mt-6" />
                </div>

                <div className="order-1 col-span-6 xl:col-span-2">
                    <Sidebar
                        model={models.beleidsdoel}
                        hideRevisions
                        {...data}
                    />
                </div>

                <div className="order-2 col-span-6 flex flex-col gap-8 xl:col-span-4 xl:mt-0">
                    <div>
                        <Heading level="3" size="m" className="mb-2">
                            Thematisch programma
                        </Heading>
                        <Heading level="1" size="xxl">
                            {data?.Title}
                        </Heading>
                    </div>

                    <div data-section="Inhoud">
                        {data?.Description && (
                            <Text
                                className="prose prose-neutral text-m text-pzh-blue-900 marker:text-pzh-blue-900 prose-li:my-0 mb-4 max-w-full whitespace-pre-line"
                                dangerouslySetInnerHTML={{
                                    __html: data.Description,
                                }}
                            />
                        )}
                        <Hyperlink asChild>
                            <Link
                                to={`/omgevingsvisie/beleidsdoelen/${data?.UUID}`}>
                                Lees meer informatie over dit beleidsdoel
                            </Link>
                        </Hyperlink>
                    </div>

                    {data?.Hierarchy_Children?.sort((a, b) =>
                        (a?.Title ?? '').localeCompare(b?.Title ?? '')
                    ).map(object => (
                        <ConnectedObject key={object.UUID} {...object} />
                    ))}
                </div>
            </Container>
        </>
    )
}

const ConnectedObject = ({ UUID, Object_Type, Title }: HierachyReference) => {
    const objectType = Object_Type as ModelType
    const objectModel = models[objectType]
    const { singularReadable, prefixSingular } = objectModel.defaults
    const { useGetVersion } = objectModel.fetchers

    const { data, isFetching } =
        useGetVersion<ModelReturnType>?.(UUID, {
            query: { enabled: Boolean(UUID) },
        }) ?? {}

    return (
        <div className="grid gap-3" data-section={Title ?? undefined}>
            <Heading level="2" size="m">
                {Title}
            </Heading>

            <ConnectedObjectChildren
                items={data?.Hierarchy_Children}
                isFetching={isFetching}
            />

            <Hyperlink asChild>
                <Link to={generateObjectPath(objectType, UUID)}>
                    Lees meer informatie over {prefixSingular}{' '}
                    {singularReadable} '{Title}'
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

    return (
        <div className="flex flex-col">
            {sortByTitle(items).map(item => (
                <ListLink
                    asChild
                    key={item.UUID}
                    className="text-pzh-green-500 hover:text-pzh-blue-500">
                    <Link
                        to={generateObjectPath(
                            item.Object_Type as ModelType,
                            item.UUID
                        )}>
                        {item.Title}
                    </Link>
                </ListLink>
            ))}
        </div>
    )
}

export default ThemeDetail
