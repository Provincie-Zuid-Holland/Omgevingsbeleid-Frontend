import { Heading, Notification, Text } from '@pzh-ui/components'
import { LayerGroup, Lightbulb } from '@pzh-ui/icons'

import {
    useModulesModuleIdObjectWerkingsgebiedLatestLineageIdGet,
    useWerkingsgebiedenLatestLineageIdGet,
} from '@/api/fetchers'
import { WerkingsgebiedStatics } from '@/api/fetchers.schemas'
import { LeafletTinyViewer } from '@/components/Leaflet'
import { Model } from '@/config/objects/types'
import useAuth from '@/hooks/useAuth'

interface ObjectAreaProps extends WerkingsgebiedStatics {
    objectTitle?: string
    moduleId?: string
    model: Model
}

const ObjectArea = ({
    objectTitle,
    moduleId,
    model,
    Object_ID,
    Cached_Title,
}: ObjectAreaProps) => {
    const { user } = useAuth()

    const { singular, prefixSingular } = model.defaults

    const {
        data: moduleData,
        isSuccess,
        isError,
    } = useModulesModuleIdObjectWerkingsgebiedLatestLineageIdGet(
        parseInt(moduleId!),
        Object_ID,
        {
            query: {
                enabled: !!moduleId && !!Object_ID && !!user,
            },
        }
    )

    const { data: validData } = useWerkingsgebiedenLatestLineageIdGet(
        Object_ID,
        {
            query: {
                enabled:
                    (!moduleId && !!Object_ID) ||
                    (!!moduleId && !!Object_ID && !moduleData && isSuccess) ||
                    isError,
            },
        }
    )

    const data = moduleId && isSuccess ? moduleData : validData

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
                    <Notification icon={Lightbulb} className="mb-3">
                        <>
                            Tip! Gebruik het icoon{' '}
                            <LayerGroup
                                size={18}
                                className="mx-1 -mt-1 inline text-pzh-blue-dark"
                            />{' '}
                            om de kaartlagen binnen dit werkingsgebied te
                            bekijken
                        </>
                    </Notification>

                    <div className="h-[500px] overflow-hidden rounded-lg">
                        <LeafletTinyViewer
                            uuid={data.Area?.Source_UUID || ''}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default ObjectArea
