import { getHeadingStyles, Text } from '@pzh-ui/components'
import { PenToSquare } from '@pzh-ui/icons'

import useBreakpoint from '@/hooks/useBreakpoint'

const ObjectDefaultInfo = () => {
    const { isMobile } = useBreakpoint()

    return (
        <div>
            <h2 style={getHeadingStyles('3', isMobile)} className="mb-4">
                Algemene informatie
            </h2>

            <div className="mt-3 pb-2 border-b border-pzh-gray-400">
                <Text type="body-bold">Ambtelijk opdrachtgever</Text>
                <div className="flex items-center justify-between">
                    <Text className="text-pzh-gray-600">Niet geselecteerd</Text>
                    <button className="text-pzh-green hover:text-pzh-green-dark underline">
                        Toevoegen
                    </button>
                </div>
            </div>

            <div className="mt-3 pb-2 border-b border-pzh-gray-400">
                <Text type="body-bold">Eerste eigenaar</Text>
                <div className="flex items-center justify-between">
                    <Text>Maarten de Vries</Text>
                    <button aria-label="Bewerken">
                        <PenToSquare size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ObjectDefaultInfo
