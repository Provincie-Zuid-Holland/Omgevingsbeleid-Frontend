import { Heading } from '@pzh-ui/components'
import { useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import { Container } from '@/components/Container'
import ObjectArea from '@/components/DynamicObject/ObjectArea/ObjectArea'
import ObjectContent from '@/components/DynamicObject/ObjectContent/ObjectContent'
import ObjectDetails from '@/components/DynamicObject/ObjectDetails/ObjectDetails'
import Sidebar from '@/components/DynamicObject/ObjectSidebar'
import { LoaderContent } from '@/components/Loader'
import TableOfContents from '@/components/TableOfContents'
import { Model, ModelReturnType } from '@/config/objects/types'

interface DynamicObjectProps {
    model: Model
}

const DynamicObject = ({ model }: DynamicObjectProps) => {
    const { uuid } = useParams()

    const { singularCapitalize } = model.defaults
    const { useGetVersion, useGetValidLineage } = model.fetchers

    const { data = {}, isLoading } = useGetVersion<ModelReturnType>(uuid!, {
        query: { enabled: !!uuid },
    })
    const { data: revisions } = useGetValidLineage<ModelReturnType[]>(
        data.Object_ID!,
        undefined,
        { query: { enabled: !!data.Object_ID } }
    )

    const amountOfRevisions = useMemo(
        () => revisions && revisions.length - 1,
        [revisions]
    )

    if (isLoading) return <LoaderContent />

    return (
        <>
            <Helmet title={singularCapitalize} />

            <Container className="pb-16 sm:pt-8 pt-4">
                <div className="col-span-6 xl:col-span-1 order-1">
                    <Sidebar
                        type={singularCapitalize}
                        date={
                            (data.Start_Validity &&
                                new Date(data.Start_Validity)) ||
                            undefined
                        }
                        revisions={amountOfRevisions}
                    />
                </div>

                <div className="col-span-6 xl:col-span-1 order-3">
                    <TableOfContents display="fixed" />
                </div>

                <div className="col-span-6 xl:col-span-4 order-2 flex flex-col">
                    <Heading
                        level="3"
                        className="font-bold"
                        color="text-pzh-blue-dark order-1">
                        {singularCapitalize}
                    </Heading>

                    <div className="block xl:hidden order-3 md:order-2">
                        <ObjectDetails
                            date={
                                (data.Start_Validity &&
                                    new Date(data.Start_Validity)) ||
                                undefined
                            }
                            revisions={amountOfRevisions}
                        />
                    </div>

                    <Heading
                        level="1"
                        color="text-pzh-blue"
                        className="mt-4 mb-2 md:mb-4 order-2 md:order-3">
                        {data.Title}
                    </Heading>

                    <div className="order-4">
                        <ObjectContent data={data} />
                    </div>

                    {data.Gebied && (
                        <div className="order-5">
                            <ObjectArea
                                model={model}
                                objectTitle={data.Title}
                                {...data.Gebied}
                            />
                        </div>
                    )}
                </div>
            </Container>
        </>
    )
}

export default DynamicObject
