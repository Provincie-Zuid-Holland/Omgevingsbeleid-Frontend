import { Heading, Notification, Text } from '@pzh-ui/components'
import { LayerGroupLight } from '@pzh-ui/icons'

import { ObjectStatics } from '@/api/fetchers.schemas'
import { LeafletTinyViewer } from '@/components/Leaflet'
import { Model } from '@/config/objects/types'
import { useArea } from '@/hooks/useArea'

interface ObjectAreaProps {
    objectTitle?: string
    model: Model
    area?: ObjectStatics | null
}

const ObjectArea = ({ objectTitle, model, area }: ObjectAreaProps) => {
    const { singular, demonstrative } = model.defaults

    return (
        <div data-section="Gebiedengroep">
            <Heading level="2" className="mb-4">
                Gebiedengroep
            </Heading>

            {!!area ? (
                <Viewer model={model} objectTitle={objectTitle} {...area} />
            ) : (
                <p>
                    Op {demonstrative} {singular} is het ambtsgebied van
                    toepassing.
                </p>
            )}
        </div>
    )
}

const Viewer = ({
    model,
    objectTitle,
    Object_ID,
    Cached_Title,
}: ObjectStatics & ObjectAreaProps) => {
    const { singular, prefixSingular } = model.defaults

    const data = useArea(Object_ID)

    return (
        <>
            <Text className="mb-4 first-letter:capitalize">
                {prefixSingular} {singular} ‘{objectTitle}’ heeft als
                gebiedengroep ‘{data?.Title || Cached_Title}’.
            </Text>

            <Notification className="mb-3">
                <p>
                    Tip! Gebruik het icoon{' '}
                    <LayerGroupLight
                        size={18}
                        className="mx-1 -mt-1 inline text-pzh-blue-900"
                    />{' '}
                    om de kaartlagen binnen deze gebiedengroep te bekijken.
                </p>
            </Notification>

            <div className="h-125 overflow-hidden rounded-lg">
                <LeafletTinyViewer uuid={data?.Source_UUID || ''} isSource />
            </div>
        </>
    )
}

export default ObjectArea
