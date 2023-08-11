import { Text } from '@pzh-ui/components'
import { useMemo } from 'react'

import * as sections from '@/config/regulations/sections'
import { Structure } from '@/config/regulations/types'
import useRegulationStore from '@/store/regulationStore'

const RegulationPreview = () => {
    const structure = useRegulationStore(state => state.structure)
    const activeItem = useRegulationStore(state => state.activeItem)

    const activeStructure = useMemo(
        () => structure.find(item => item.uuid === activeItem),
        [activeItem, structure]
    )

    return <div>{activeStructure && <Preview {...activeStructure} />}</div>
}

const Preview = ({ type, uuid, children }: Structure) => {
    const section = sections[type]

    return (
        <div>
            <Text type="body-bold" color="text-pzh-blue">
                {section.defaults.name}: {uuid}
            </Text>
            {!!children?.length &&
                children.map(child => <Preview {...child} />)}
        </div>
    )
}

export default RegulationPreview
