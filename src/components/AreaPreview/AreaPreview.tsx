import { Text } from '@pzh-ui/components'

import { Werkingsgebied } from '@/api/fetchers.schemas'

import { LeafletTinyViewer } from '../Leaflet'

interface AreaPreviewProps {
    area?: Partial<Werkingsgebied>
}

const AreaPreview = ({ area }: AreaPreviewProps) => (
    <div className="relative z-0 flex w-full items-center justify-center overflow-hidden rounded bg-pzh-gray-100 text-center">
        {!area?.UUID ? (
            <Text className="text-pzh-gray-600">
                Selecteer een werkingsgebied
                <br />
                om de laatste versie te bekijken
            </Text>
        ) : (
            <div className="h-[500px] w-full overflow-hidden rounded-lg">
                <LeafletTinyViewer
                    uuid={area.UUID}
                />
            </div>
        )}
    </div>
)

export default AreaPreview
