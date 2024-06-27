import { Button, Heading, Text } from '@pzh-ui/components'
import { Link } from 'react-router-dom'

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
                <Button asChild size="small" variant="secondary">
                    <Link to={`/muteer/${plural}/${Object_ID}`}>
                        Bekijk {singularReadable}
                    </Link>
                </Button>
            </div>
        </li>
    )
}

export default ObjectCard
