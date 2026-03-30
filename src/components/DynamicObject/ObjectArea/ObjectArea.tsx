import { Heading, Text } from '@pzh-ui/components'

import { WerkingsgebiedStatics } from '@/api/fetchers.schemas'
import { LeafletTinyViewer } from '@/components/Leaflet'
import { Model } from '@/config/objects/types'
import { useWerkingsgebied } from '@/hooks/useWerkingsgebied'

interface ObjectAreaProps extends WerkingsgebiedStatics {
    objectTitle?: string
    model: Model
}

const ObjectArea = ({
    objectTitle,
    model,
    Object_ID,
    Cached_Title,
}: ObjectAreaProps) => {
    const { singular, prefixSingular } = model.defaults

    const data = useWerkingsgebied(Object_ID)

    return (
        <div data-section="Werkingsgebied">
            <Heading level="2" className="mb-4">
                Werkingsgebied
            </Heading>
            <Text className="mb-4 first-letter:capitalize">
                {prefixSingular} {singular} ‘{objectTitle}’ heeft als
                werkingsgebied ‘{data?.Title || Cached_Title}’.
            </Text>

            {!!data && (
                <>
                    {/* <Notification icon={Lightbulb} className="mb-3">
                        <>
                            Tip! Gebruik het icoon{' '}
                            <LayerGroup
                                size={18}
                                className="text-pzh-blue-900 mx-1 -mt-1 inline"
                            />{' '}
                            om de kaartlagen binnen dit werkingsgebied te
                            bekijken
                        </>
                    </Notification> */}

                    <div className="h-[500px] overflow-hidden rounded-lg">
                        <LeafletTinyViewer uuid={data.Area?.UUID || ''} />
                    </div>
                </>
            )}
        </div>
    )
}

export default ObjectArea
