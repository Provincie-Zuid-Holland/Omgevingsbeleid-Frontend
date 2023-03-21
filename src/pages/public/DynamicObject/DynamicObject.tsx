import { Heading } from '@pzh-ui/components'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import { Container } from '@/components/Container'
import Sidebar from '@/components/DynamicObject/Sidebar'
import { LoaderContent } from '@/components/Loader'
import TableOfContents from '@/components/TableOfContents'
import { Model } from '@/config/objects/types'

interface DynamicObjectProps {
    model: Model
}

const DynamicObject = ({ model }: DynamicObjectProps) => {
    const { uuid } = useParams()

    const { singularCapitalize } = model.defaults
    const { useGetVersion } = model.fetchers

    const { data = {}, isLoading } = useGetVersion(uuid!, {
        query: { enabled: !!uuid },
    })

    if (isLoading) return <LoaderContent />

    return (
        <>
            <Helmet title={singularCapitalize} />

            <Container className="pb-16 sm:pt-8 pt-4">
                <div className="col-span-1">
                    <Sidebar
                        type={singularCapitalize}
                        date={
                            (data.Start_Validity &&
                                new Date(data.Start_Validity)) ||
                            undefined
                        }
                    />
                </div>
                <div className="col-span-4">
                    <Heading
                        level="3"
                        className="font-bold"
                        color="text-pzh-blue-dark">
                        {singularCapitalize}
                    </Heading>
                    <Heading level="1" color="text-pzh-blue" className="mt-4">
                        {data.Title}
                    </Heading>
                </div>
                <div className="col-span-1">
                    <TableOfContents display="fixed" />
                </div>
            </Container>
        </>
    )
}

export default DynamicObject
