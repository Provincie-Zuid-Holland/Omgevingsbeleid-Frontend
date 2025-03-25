import { Heading, Text } from '@pzh-ui/components'
import { Eye } from '@pzh-ui/icons'
import { Link } from 'react-router-dom'

import {
    DynamicModuleObjectShort,
    DynamicObjectShort,
    WerkingsgebiedRelatedObjects,
} from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'

interface ObjectRelatedObjectsProps {
    objects: WerkingsgebiedRelatedObjects
}

const ObjectRelatedObjects = ({ objects }: ObjectRelatedObjectsProps) => {
    if (!objects.Module_Objects.length && !objects.Valid_Objects.length)
        return null

    return (
        <>
            <div className="mb-6 mt-8 flex items-center justify-between">
                <Heading level="3" size="m">
                    Gekoppelde objecten
                </Heading>
            </div>

            <div className="space-y-4">
                {objects.Module_Objects.map(object => (
                    <RelatedObject
                        key={object.UUID}
                        type="module"
                        {...object}
                    />
                ))}

                {objects.Valid_Objects.map(object => (
                    <RelatedObject key={object.UUID} type="valid" {...object} />
                ))}
            </div>
        </>
    )
}

interface RelatedObjectProps
    extends DynamicModuleObjectShort,
        DynamicObjectShort {
    type: 'valid' | 'module'
}

const RelatedObject = ({
    type,
    Title,
    Object_Type,
    UUID,
    Module_ID,
    Module_Title,
}: RelatedObjectProps) => {
    const model = models[Object_Type as ModelType]
    const path =
        type === 'module'
            ? `/${model.defaults.slugOverview}/${model.defaults.plural}/ontwerpversie/${Module_ID}/${UUID}`
            : `/${model.defaults.slugOverview}/${model.defaults.plural}/${UUID}`

    return (
        <Link
            to={path}
            target="_blank"
            className="group flex items-center justify-between gap-4 border-b border-pzh-gray-200 pb-2">
            <div>
                <Text as="span" color="text-pzh-gray-500">
                    {model.defaults.singularCapitalize}
                    {type === 'module' && ` in module '${Module_Title}'`}
                </Text>
                <Heading
                    level="4"
                    size="s"
                    className="decoration-1 group-hover:underline">
                    {Title}
                </Heading>
            </div>
            <Eye className="text-pzh-green-500" size={20} />
        </Link>
    )
}

export default ObjectRelatedObjects
