import { Heading, Text } from '@pzh-ui/components'

import { Model, ModelReturnType } from '@/config/objects/types'

import ObjectNetwork from '../ObjectNetwork'

interface ObjectRelationsPublicProps {
    model: Model
    data: ModelReturnType
}

const ObjectRelationsPublic = ({ model, data }: ObjectRelationsPublicProps) => (
    <div data-section="Koppelingen & Relaties">
        <Heading level="2" className="mb-4 text-pzh-blue">
            Koppelingen & Relaties
        </Heading>
        <Text className="first-letter:capitalize mb-4">
            {model.connectionsDescription}
        </Text>

        <ObjectNetwork data={data} model={model} />
    </div>
)

export default ObjectRelationsPublic
