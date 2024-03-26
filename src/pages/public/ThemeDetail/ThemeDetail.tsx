import {
    Breadcrumbs,
    Heading,
    Hyperlink,
    ListLink,
    Text,
} from '@pzh-ui/components'
import { useParams } from 'react-router-dom'

import { useBeleidsdoelenVersionObjectUuidGet } from '@/api/fetchers'
import { ReadRelationShortBeleidskeuzeMinimal } from '@/api/fetchers.schemas'
import { Container } from '@/components/Container'
import { LoaderContent } from '@/components/Loader'
import TableOfContents from '@/components/TableOfContents'
import * as models from '@/config/objects'
import { ModelReturnType, ModelType } from '@/config/objects/types'

function ThemeDetail() {
    const { uuid } = useParams<{ uuid: string }>()

    const { data, isLoading } = useBeleidsdoelenVersionObjectUuidGet(uuid!)

    const breadcrumbPaths = [
        { name: 'Home', path: '/' },
        { name: 'Omgevingsprogramma', path: '/omgevingsprogramma' },
        {
            name: 'Thematische programma’s',
            path: '/omgevingsprogramma/thematische-programmas',
        },
        {
            name: data?.Title || '',
            path: `/omgevingsprogramma/thematische-programmas/${data?.UUID}`,
        },
    ]

    if (isLoading) return <LoaderContent />

    return (
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
                            className="prose prose-neutral mb-4 max-w-full whitespace-pre-line text-m text-pzh-blue-900 marker:text-pzh-blue-900 prose-li:my-0"
                            dangerouslySetInnerHTML={{
                                __html: data.Description,
                            }}
                        />
                    )}
                    <Hyperlink
                        to={`/omgevingsvisie/beleidsdoelen/${data?.UUID}`}
                        text="Lees meer informatie over dit beleidsdoel"
                    />
                </div>

                {data?.Beleidskeuzes?.map(object => (
                    <ConnectedObject key={object.Object.UUID} {...object} />
                ))}
            </div>
        </Container>
    )
}

const ConnectedObject = ({ Object }: ReadRelationShortBeleidskeuzeMinimal) => {
    const model = models[Object.Object_Type as ModelType]
    const { slugOverview, singularReadable, prefixSingular, plural } =
        model.defaults
    const { useGetVersion } = model.fetchers

    const { data } =
        useGetVersion<ModelReturnType>?.(Object.UUID!, {
            query: { enabled: !!Object.UUID },
        }) || {}

    return (
        <div className="grid gap-3" data-section={Object.Title}>
            <Heading level="2" size="m">
                {Object.Title}
            </Heading>

            {!!data?.Maatregelen?.length ? (
                <div>
                    {data.Maatregelen.map(item => {
                        const model =
                            models[item.Object.Object_Type as ModelType]
                        const { slugOverview } = model.defaults

                        return (
                            <ListLink
                                key={item.Object.UUID}
                                text={item.Object.Title || ''}
                                to={`/${slugOverview}/${plural}/${item.Object.UUID}`}
                                className="text-pzh-green-500 hover:text-pzh-blue-500"
                            />
                        )
                    })}
                </div>
            ) : (
                <span className="italic text-pzh-gray-600">
                    Er zijn geen maatregelen gekoppeld
                </span>
            )}

            <Hyperlink
                to={`/${slugOverview}/${plural}/${Object.UUID}`}
                text={`Lees meer informatie over ${prefixSingular} ${singularReadable} '${Object.Title}'`}
            />
        </div>
    )
}

export default ThemeDetail
