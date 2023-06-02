import { Button, Heading } from '@pzh-ui/components'

import * as models from '@/config/objects'
import { ModelReturnType, ModelType } from '@/config/objects/types'

const ObjectCard = ({ Object_Type, Object_ID, Title }: ModelReturnType) => {
    const model = models[Object_Type as ModelType]
    const { plural, singularCapitalize, singularReadable } = model.defaults

    return (
        <li
            className="p-5 border border-pzh-gray-200 rounded h-full flex flex-col"
            data-testid="object-card">
            <span className="block">{singularCapitalize}</span>
            <Heading level="4" className="mb-4">
                {Title}
            </Heading>
            <div className="mt-auto">
                <Button
                    as="a"
                    href={`/muteer/${plural}/${Object_ID}`}
                    size="small"
                    variant="secondary">
                    Bekijk {singularReadable}
                </Button>
            </div>
        </li>
    )
}

export default ObjectCard
