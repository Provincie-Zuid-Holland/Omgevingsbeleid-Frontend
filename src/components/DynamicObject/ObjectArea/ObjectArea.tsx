import { Notification, Text, getHeadingStyles } from '@pzh-ui/components'
import { LayerGroup, Lightbulb } from '@pzh-ui/icons'

import { Werkingsgebied } from '@/api/fetchers.schemas'
import { LeafletTinyViewer } from '@/components/Leaflet'
import { Model } from '@/config/objects/types'
import useBreakpoint from '@/hooks/useBreakpoint'

interface ObjectAreaProps extends Werkingsgebied {
    objectTitle?: string
    model: Model
}

const ObjectArea = ({ objectTitle, model, UUID, Title }: ObjectAreaProps) => {
    const { isMobile } = useBreakpoint()

    const { singular, prefixSingular } = model.defaults

    return (
        <div>
            <h2
                className="mb-4"
                id="object-section-werkingsgebied"
                style={getHeadingStyles('3', isMobile)}>
                Werkingsgebied
            </h2>
            <Text className="mb-4 first-letter:capitalize">
                {prefixSingular} {singular} ‘{objectTitle}’ heeft als
                werkingsgebied ‘{Title}’.
            </Text>

            <Notification icon={Lightbulb} className="mb-3">
                <>
                    Tip! Gebruik het icoon{' '}
                    <LayerGroup
                        size={18}
                        className="inline -mt-1 mx-1 text-pzh-blue-dark"
                    />{' '}
                    om de kaartlagen binnen dit werkingsgebied te bekijken
                </>
            </Notification>

            <div className="h-[500px] overflow-hidden rounded-lg">
                <LeafletTinyViewer
                    gebiedType="Werkingsgebieden"
                    gebiedUUID={UUID}
                />
            </div>
        </div>
    )
}

export default ObjectArea
