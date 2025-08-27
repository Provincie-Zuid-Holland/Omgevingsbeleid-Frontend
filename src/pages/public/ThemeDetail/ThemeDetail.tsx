import { Heading, Hyperlink, ListLink, Text } from '@pzh-ui/components'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'

import { useBeleidsdoelViewObjectVersion } from '@/api/fetchers'
import { ReadRelationShortBeleidskeuzeMinimal } from '@/api/fetchers.schemas'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Container } from '@/components/Container'
import { LoaderContent, LoaderSpinner } from '@/components/Loader'
import TableOfContents from '@/components/TableOfContents'
import * as models from '@/config/objects'
import { ModelReturnType, ModelType } from '@/config/objects/types'

import NotFoundPage from '../NotFoundPage'

function ThemeDetail() {
    const { uuid } = useParams<{ uuid: string }>()

    const { data, isLoading, isError } = useBeleidsdoelViewObjectVersion(uuid!)

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
                    <aside className="sticky top-[120px]">
                        <Heading level="3" size="m" className="mb-2">
                            Inhoudsopgave
                        </Heading>

                        <TableOfContents />
                    </aside>
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

                    {data?.Beleidskeuzes?.map(object => (
                        <ConnectedObject
                            key={object.Object?.UUID}
                            {...object}
                        />
                    ))}
                </div>
            </Container>
        </>
    )
}

const ConnectedObject = ({ Object }: ReadRelationShortBeleidskeuzeMinimal) => {
    if (!Object) return null

    const model = models[Object.Object_Type as ModelType]
    const { slugOverview, singularReadable, prefixSingular, plural } =
        model.defaults
    const { useGetVersion } = model.fetchers

    const { data, isFetching } =
        useGetVersion<ModelReturnType>?.(Object.UUID!, {
            query: { enabled: !!Object.UUID },
        }) || {}

    return (
        <div className="grid gap-3" data-section={Object.Title}>
            <Heading level="2" size="m">
                {Object.Title}
            </Heading>

            {isFetching ? (
                <LoaderSpinner />
            ) : !!data?.Maatregelen?.length ? (
                <div className="flex flex-col">
                    {data.Maatregelen.map(item => {
                        if (!item.Object) return null
                        const model =
                            models[item.Object.Object_Type as ModelType]
                        const { slugOverview, plural } = model.defaults

                        return (
                            <ListLink
                                asChild
                                key={item.Object.UUID}
                                className="text-pzh-green-500 hover:text-pzh-blue-500">
                                <Link
                                    to={`/${slugOverview}/${plural}/${item.Object.UUID}`}>
                                    {item.Object.Title}
                                </Link>
                            </ListLink>
                        )
                    })}
                </div>
            ) : (
                <span className="text-pzh-gray-600 italic">
                    Er zijn geen maatregelen gekoppeld
                </span>
            )}

            <Hyperlink asChild>
                <Link to={`/${slugOverview}/${plural}/${Object.UUID}`}>
                    Lees meer informatie over {prefixSingular}{' '}
                    {singularReadable} '{Object.Title}'
                </Link>
            </Hyperlink>
        </div>
    )
}

export default ThemeDetail
