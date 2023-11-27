import { Button, Heading, Text } from '@pzh-ui/components'

import * as models from '@/config/objects'
import { ModelReturnType, ModelType } from '@/config/objects/types'

const ObjectCard = ({ Object_Type, Object_ID, Title }: ModelReturnType) => {
    const model = models[Object_Type as ModelType]
    const { plural, singularCapitalize, singularReadable } = model.defaults

    return (
        <li
            className="flex h-full flex-col rounded border border-pzh-gray-200 p-5"
            data-testid="object-card">
            <Text as="span" size="s" className="block">
                {singularCapitalize}
            </Text>
            <Heading level="4" size="m" className="mb-4">
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
