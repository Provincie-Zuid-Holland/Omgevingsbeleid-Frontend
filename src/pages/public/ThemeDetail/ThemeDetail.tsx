import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import {
    Breadcrumbs,
    Heading,
    Hyperlink,
    ListLink,
    Text,
} from '@pzh-ui/components'

import { useBeleidsdoelenVersionObjectUuidGet } from '@/api/fetchers'
import { ReadRelationShortBeleidskeuzeMinimal } from '@/api/fetchers.schemas'
import { Container } from '@/components/Container'
import { LoaderContent } from '@/components/Loader'
import ObjectList from '@/components/ObjectList'
import * as models from '@/config/objects'
import { ModelReturnType, ModelType } from '@/config/objects/types'

function ThemeDetail() {
    const { uuid } = useParams<{ uuid: string }>()

    const { data, isLoading } = useBeleidsdoelenVersionObjectUuidGet(uuid!)

    const transformedMaatregelen = useMemo(
        () =>
            data?.Maatregelen?.map(item => ({
                Title: item.Object.Title,
                UUID: item.Object.UUID,
            })),
        [data?.Maatregelen]
    )

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
        <Container className="overflow-hidden pb-20">
            <div className="col-span-6">
                <Breadcrumbs items={breadcrumbPaths} className="mt-6" />
            </div>
            <div className="col-span-6 pt-10 xl:col-span-4 xl:col-start-2">
                <Heading level="1" className="mb-3">
                    {data?.Title}
                </Heading>
                <Text className="mb-4 whitespace-pre-line break-words">
                    {data?.Description}
                </Text>
                <Hyperlink
                    to={`/omgevingsvisie/beleidsdoelen/${data?.UUID}`}
                    text="Lees meer informatie over dit beleidsdoel"
                />

                {!!transformedMaatregelen?.length && (
                    <div className="mt-8">
                        <ObjectList
                            data={transformedMaatregelen}
                            isLoading={isLoading}
                            objectType="maatregelen"
                            objectSlug="omgevingsprogramma/maatregelen"
                            hasSearch={false}
                            title="Maatregelen in dit thematische programma"
                        />
                    </div>
                )}

                {data?.Beleidskeuzes?.map(object => (
                    <ConnectedObject key={object.Object.UUID} {...object} />
                ))}
            </div>
        </Container>
    )
}

const ConnectedObject = ({ Object }: ReadRelationShortBeleidskeuzeMinimal) => {
    const model = models[Object.Object_Type as ModelType]
    const { slugOverview, singularReadable, prefixSingular } = model.defaults
    const { useGetVersion } = model.fetchers

    const { data } =
        useGetVersion<ModelReturnType>?.(Object.UUID!, {
            query: { enabled: !!Object.UUID },
        }) || {}

    return (
        <div className="mt-6 grid gap-3">
            <Heading as="2" level="3">
                {Object.Title}
            </Heading>

            {!!data?.Maatregelen?.length && (
                <div>
                    {data.Maatregelen.map(item => {
                        const model =
                            models[item.Object.Object_Type as ModelType]
                        const { slugOverview } = model.defaults

                        return (
                            <ListLink
                                key={item.Object.UUID}
                                text={item.Object.Title || ''}
                                to={`/${slugOverview}/${item.Object.UUID}`}
                                className="text-pzh-green hover:text-pzh-blue"
                            />
                        )
                    })}
                </div>
            )}

            <Hyperlink
                to={`/${slugOverview}/${Object.UUID}`}
                text={`Lees meer informatie over ${prefixSingular} ${singularReadable} '${Object.Title}'`}
            />
        </div>
    )
}

export default ThemeDetail
