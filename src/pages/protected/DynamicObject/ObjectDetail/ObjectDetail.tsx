import { Link, useParams } from 'react-router-dom'

import { Divider, Heading } from '@pzh-ui/components'
import { ArrowUpRightFromSquare } from '@pzh-ui/icons'

import ObjectActiveModules from '@/components/DynamicObject/ObjectActiveModules'
import ObjectConnections from '@/components/DynamicObject/ObjectConnections'
import ObjectDefaultInfo from '@/components/DynamicObject/ObjectDefaultInfo'
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
            { name: 'Modules', path: '/muteer' },
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
                <Heading level="3" as="2" className="mb-2">
                    {singularCapitalize}
                </Heading>
                {isLoading && <LoaderCard height="56" className="w-auto" />}
                <Heading level="1" className="mb-2">
                    {object?.Title}
                </Heading>
                <Link
                    to={`/${slugOverview}/${
                        moduleId
                            ? `ontwerpversie/${moduleId}/${object?.UUID}`
                            : object?.UUID
                    }`}
                    className="flex items-center text-pzh-green underline hover:text-pzh-green-dark">
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
            </div>
        </MutateLayout>
    )
}

export default ObjectDetail
