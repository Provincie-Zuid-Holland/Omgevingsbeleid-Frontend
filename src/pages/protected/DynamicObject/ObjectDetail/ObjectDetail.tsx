import { Divider, Heading } from '@pzh-ui/components'
import { ArrowUpRightFromSquare } from '@pzh-ui/icons'
import { Link, useParams } from 'react-router-dom'

import ObjectActiveModules from '@/components/DynamicObject/ObjectActiveModules'
import ObjectConnections from '@/components/DynamicObject/ObjectConnections'
import ObjectDefaultInfo from '@/components/DynamicObject/ObjectDefaultInfo'
import ObjectRelatedObjects from '@/components/DynamicObject/ObjectRelatedObjects'
import ObjectRelations from '@/components/DynamicObject/ObjectRelations'
import ObjectValidArchived from '@/components/DynamicObject/ObjectValidArchived'
import { LoaderCard } from '@/components/Loader'
import { Model } from '@/config/objects/types'
import useModule from '@/hooks/useModule'
import useObject from '@/hooks/useObject'
import MutateLayout from '@/templates/MutateLayout'

interface ObjectDetailProps {
    model: Model
}

const ObjectDetail = ({ model }: ObjectDetailProps) => {
    const { moduleId } = useParams()

    const { singularCapitalize, plural, pluralCapitalize, slugOverview } =
        model.defaults

    const { data: module } = useModule() || {}
    const { data: object, isLoading } = useObject()

    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        ...((!!moduleId && [
            { name: 'Modules', path: '/muteer/modules' },
            {
                name: module?.Module.Title || '',
                path: `/muteer/modules/${module?.Module.Module_ID}`,
            },
        ]) || [{ name: pluralCapitalize, path: `/muteer/${plural}` }]),
        { name: object?.Title || '', isCurrent: true },
    ]

    return (
        <MutateLayout
            title={`${singularCapitalize}: ${object?.Title}`}
            breadcrumbs={breadcrumbPaths}>
            <div className="col-span-6 sm:col-span-4">
                <Heading level="2" size="m" className="mb-2">
                    {singularCapitalize}
                </Heading>
                {isLoading && <LoaderCard height="56" className="w-auto" />}
                <Heading level="1" size="xxl" className="mb-2">
                    {object?.Title}
                </Heading>
                <Link
                    to={`/${slugOverview}/${plural}/${
                        moduleId
                            ? `ontwerpversie/${moduleId}/${object?.UUID}`
                            : object?.UUID
                    }`}
                    className="flex items-center text-pzh-green-500 underline hover:text-pzh-green-900">
                    Bekijk in raadpleegomgeving
                    <ArrowUpRightFromSquare className="ml-2" />
                </Link>

                <Divider className="mb-8 mt-6" />

                <ObjectActiveModules />

                <Divider className="my-6" />

                <ObjectValidArchived model={model} />
            </div>

            <div className="col-span-6 mt-6 sm:col-span-2 sm:mt-0">
                <ObjectDefaultInfo model={model} />

                {!!model.allowedConnections?.length && (
                    <ObjectConnections model={model} />
                )}

                {!!model.acknowledgedRelation && (
                    <ObjectRelations model={model} />
                )}

                {model.hasRelatedObjects && !!object?.Related_Objects && (
                    <ObjectRelatedObjects objects={object?.Related_Objects} />
                )}
            </div>
        </MutateLayout>
    )
}

export default ObjectDetail
