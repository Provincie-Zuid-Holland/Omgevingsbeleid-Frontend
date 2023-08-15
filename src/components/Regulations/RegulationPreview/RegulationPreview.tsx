import { Heading, Text } from '@pzh-ui/components'
import classNames from 'classnames'
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
    index?: number
    isParent?: boolean
    parentIndex?: number
}

const Preview = ({
    type,
    children,
    index = 0,
    isParent,
    parentIndex,
}: PreviewProps) => {
    const section = sections[type]

    return (
        <div
            className={classNames({
                'ml-4': index > 0,
            })}>
            {isParent ? (
                <Heading className="mb-3">
                    {section.defaults.name} {parentIndex}: ...
                </Heading>
            ) : (
                <Text type="body-bold" color="text-pzh-blue" className="mb-3">
                    {section.defaults.name} {parentIndex}.{index}: ...
                </Text>
            )}
            {!!children?.length &&
                children.map((child, index) => (
                    <Preview
                        key={child.uuid}
                        index={index + 1}
                        parentIndex={parentIndex}
                        {...child}
                    />
                ))}
        </div>
    )
}

export default RegulationPreview
