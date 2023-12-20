import { Button, Heading, PillButton } from '@pzh-ui/components'
import { AngleRight, Plus } from '@pzh-ui/icons'
import classNames from 'classnames'
import { useCallback, useState } from 'react'

import regulation from '@/config/regulations'
import * as sections from '@/config/regulations/sections'
import { SectionType } from '@/config/regulations/sections/types'
import useModalStore from '@/store/modalStore'
import useRegulationStore from '@/store/regulationStore'

import RecursiveAccordion from '../RecursiveAccordion'
import { formatStructure } from '../utils'

const Sidebar = () => {
    const structure = useRegulationStore(state =>
        formatStructure(state.structure)
    )
    const activeItem = useRegulationStore(state => state.activeItem)
    const setActiveItem = useRegulationStore(state => state.setActiveItem)
    const setActiveModal = useModalStore(state => state.setActiveModal)
    const setItemAction = useRegulationStore(state => state.setItemAction)

    const [expanded, setExpanded] = useState(true)

    const toggleSidebar = useCallback(() => {
        setExpanded(!expanded)

        if (!activeItem) {
            setActiveItem(structure?.[0]?.uuid)
        }
    }, [activeItem, structure, expanded, setActiveItem])

    const handleAddItem = (type: SectionType) => {
        setItemAction({ action: 'add', type, path: [] })
        setActiveModal('regulationAdd')
    }

    return (
        <div
            className="sticky top-[97px] h-full w-[64px] whitespace-nowrap"
            data-testid="sidebar">
            <div
                className={classNames(
                    'after:content-[" "] relative bg-pzh-gray-100 transition-[min-width] duration-200 after:absolute after:left-0 after:top-0 after:-z-1 after:h-[calc(100vh-97px)] after:w-full after:bg-pzh-gray-100 after:shadow-[0px_18px_60px_rgba(0,0,0,0.07),0px_4px_13px_rgba(0,0,0,0.04),0px_2px_6px_rgba(0,0,0,0.03)]',
                    {
                        'min-w-[64px]': !expanded,
                        'min-w-[80vw]': expanded,
                    }
                )}>
                <Button
                    variant="default"
                    onPress={toggleSidebar}
                    className="absolute -right-3 top-8 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-pzh-blue-dark">
                    <span className="sr-only">{`Zijbalk ${
                        expanded ? 'sluiten' : 'openen'
                    }`}</span>
                    <AngleRight
                        className={classNames('transform text-pzh-white', {
                            'rotate-180 transform': expanded,
                        })}
                        size={16}
                    />
                </Button>

                <div
                    className={classNames('overflow-hidden px-4 pb-24', {
                        'pt-24': !expanded,
                        'pt-[44px]': expanded,
                    })}>
                    {expanded && (
                        <Heading level="3" size="s" className="mb-4">
                            {regulation.title}
                        </Heading>
                    )}

                    <RecursiveAccordion
                        structure={structure}
                        expanded={expanded}
                    />

                    {expanded &&
                        regulation.structure?.map(({ type }, index) => {
                            const section = sections[type]

                            return (
                                <PillButton
                                    key={type + index}
                                    icon={Plus}
                                    onPress={() => handleAddItem(type)}>
                                    {section.defaults.singularCapitalize}
                                </PillButton>
                            )
                        })}
                </div>
            </div>
        </div>
    )
}

export default Sidebar
