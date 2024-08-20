import { Heading, Text } from '@pzh-ui/components'
import { useMemo } from 'react'

import * as sections from '@/config/regulations/sections'
import { Structure } from '@/config/regulations/types'
import useRegulationStore from '@/store/regulationStore'

const RegulationPreview = () => {
    const structure = useRegulationStore(state => state.structure)
    const activeItem = useRegulationStore(state => state.activeItem)

    const { item: activeStructure, index } = useMemo(() => {
        const item = structure.find(item => item.uuid === activeItem)
        const index = structure.findIndex(item => item.uuid === activeItem)

        return { item, index: index + 1 }
    }, [activeItem, structure])

    return (
        <div>
            {activeStructure && (
                <Preview isParent parentIndex={index} {...activeStructure} />
            )}
        </div>
    )
}

interface PreviewProps extends Structure {
    index?: string
    isParent?: boolean
    parentIndex?: number
}

const Preview = ({
    type,
    title,
    children,
    index = '',
    isParent,
    parentIndex,
}: PreviewProps) => {
    const section = sections[type]

    return (
        <div>
            {isParent ? (
                <Heading className="mb-3">
                    {section.defaults.singularCapitalize} {parentIndex}: {title}
                </Heading>
            ) : (
                <Text bold color="text-pzh-blue-500" className="mb-3">
                    {section.defaults.singularCapitalize} {index}: {title}
                </Text>
            )}
            {!!children?.length &&
                children.map(child => (
                    <Preview
                        key={child.uuid}
                        parentIndex={parentIndex}
                        {...child}
                    />
                ))}
        </div>
    )
}

export default RegulationPreview
