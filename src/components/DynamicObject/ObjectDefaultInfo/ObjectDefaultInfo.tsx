import { getHeadingStyles, Text } from '@pzh-ui/components'
import { PenToSquare, Plus } from '@pzh-ui/icons'

import useBreakpoint from '@/hooks/useBreakpoint'

const ObjectDefaultInfo = () => {
    const { isMobile } = useBreakpoint()

    return (
        <div>
            <h2 style={getHeadingStyles('3', isMobile)} className="mb-4">
                Algemene informatie
            </h2>

            <Item label="Ambtelijk opdrachtgever" />
            <Item label="Eerste eigenaar" value="Maarten de Vries" />
            <Item label="Tweede eigenaar" />
            <Item label="Eerste portefeuillehouder" />
            <Item label="Tweede portefeuillehouder" />
        </div>
    )
}

interface ItemProps {
    label: string
    value?: string
}

const Item = ({ label, value }: ItemProps) => (
    <div className="mt-3 pb-2 border-b border-pzh-gray-400">
        <Text type="body-bold">{label}</Text>
        <div className="flex items-center justify-between">
            <Text className={!value ? 'text-pzh-gray-600' : ''}>
                {value || 'Niet geselecteerd'}
            </Text>
            {!value ? (
                <button aria-label="Toevoegen">
                    <div className="w-4 h-4 bg-pzh-green rounded-full flex items-center justify-center">
                        <Plus size={14} className="text-pzh-white" />
                    </div>
                </button>
            ) : (
                <button aria-label="Wijzigen">
                    <PenToSquare size={20} className="text-pzh-green" />
                </button>
            )}
        </div>
    </div>
)

export default ObjectDefaultInfo
