import { Heading, Notification, Text } from '@pzh-ui/components'
import { LayerGroup, Lightbulb } from '@pzh-ui/icons'

import { Werkingsgebied } from '@/api/fetchers.schemas'
import { LeafletTinyViewer } from '@/components/Leaflet'
import { Model } from '@/config/objects/types'

interface ObjectAreaProps extends Werkingsgebied {
    objectTitle?: string
    model: Model
}

const ObjectArea = ({ objectTitle, model, UUID, Title }: ObjectAreaProps) => {
    const { singular, prefixSingular } = model.defaults

    return (
        <div data-section="Werkingsgebied">
            <Heading level="2" className="mb-4">
                Werkingsgebied
            </Heading>
            <Text className="mb-4 first-letter:capitalize">
                {prefixSingular} {singular} ‘{objectTitle}’ heeft als
                werkingsgebied ‘{Title}’.
            </Text>

            <Notification icon={Lightbulb} className="mb-3">
                <>
                    Tip! Gebruik het icoon{' '}
                    <LayerGroup
                        size={18}
                        className="mx-1 -mt-1 inline text-pzh-blue-dark"
                    />{' '}
                    om de kaartlagen binnen dit werkingsgebied te bekijken
                </>
            </Notification>

            <div className="h-[500px] overflow-hidden rounded-lg">
                <LeafletTinyViewer uuid={UUID} />
            </div>
        </div>
    )
}

export default ObjectArea
