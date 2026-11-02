import { Heading, Text } from '@pzh-ui/components'
import { Eye } from '@pzh-ui/icons'

import { Link } from 'react-router-dom'

import {
    WerkingsgebiedRelatedModuleObjectShort,
    WerkingsgebiedRelatedObjects,
    WerkingsgebiedRelatedObjectShort,
} from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'

interface ObjectRelatedObjectsProps {
    objects: WerkingsgebiedRelatedObjects
}

const ObjectRelatedObjects = ({ objects }: ObjectRelatedObjectsProps) => {
    if (!objects.module_objects.length && !objects.valid_objects.length)
        return null

    return (
        <>
            <div className="mt-8 mb-6 flex items-center justify-between">
                <Heading level="3" size="m">
                    Gekoppelde objecten
                </Heading>
            </div>

            <div className="flex flex-col gap-4">
                {objects.module_objects.map(object => (
                    <RelatedObject key={object.id} type="module" {...object} />
                ))}

                {objects.valid_objects.map(object => (
                    <RelatedObject key={object.id} type="valid" {...object} />
                ))}
            </div>
        </>
    )
}

interface RelatedObjectProps
    extends
        WerkingsgebiedRelatedModuleObjectShort,
        WerkingsgebiedRelatedObjectShort {
    type: 'valid' | 'module'
}

const RelatedObject = ({
    type,
    title,
    object_type,
    id,
    module_id,
    module_title,
}: RelatedObjectProps) => {
    const model = models[object_type as ModelType]
    const path =
        type === 'module'
            ? `/${model.defaults.slugOverview}/${model.defaults.plural}/ontwerpversie/${module_id}/${id}`
            : `/${model.defaults.slugOverview}/${model.defaults.plural}/${id}`

    return (
        <Link
            to={path}
            target="_blank"
            className="group flex items-center justify-between gap-4 border-b border-pzh-gray-200 pb-2">
            <div>
                <Text as="span" color="text-pzh-gray-500">
                    {model.defaults.singularCapitalize}
                    {type === 'module' && ` in module '${module_title}'`}
                </Text>
                <Heading
                    level="4"
                    size="s"
                    className="decoration-1 group-hover:underline">
                    {title}
                </Heading>
            </div>
            <Eye className="text-pzh-green-500" size={20} />
        </Link>
    )
}

export default ObjectRelatedObjects
