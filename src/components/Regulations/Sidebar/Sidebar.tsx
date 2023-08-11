import { PillButton } from '@pzh-ui/components'
import { AngleRight, Plus } from '@pzh-ui/icons'
import classNames from 'classnames'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import regulation from '@/config/regulations'
import * as sections from '@/config/regulations/sections'
import useRegulationStore from '@/store/regulationStore'

import RecursiveAccordion from '../RecursiveAccordion'

const Sidebar = () => {
    const structure = useRegulationStore(state => state.structure)
    const addItem = useRegulationStore(state => state.addItem)

    const [expanded, setExpanded] = useState(true)

    return (
        <div
            className="sticky top-[97px] h-full w-[64px] whitespace-nowrap"
            data-testid="sidebar">
            <div
                className={classNames(
                    'after:content-[" "] relative bg-pzh-gray-100 transition-[min-width] duration-200 ease-[cubic-bezier(.47,1.64,.41,.8)] after:absolute after:left-0 after:top-0 after:-z-1 after:h-[calc(100vh-97px)] after:w-full after:bg-pzh-gray-100 after:shadow-[0px_18px_60px_rgba(0,0,0,0.07),0px_4px_13px_rgba(0,0,0,0.04),0px_2px_6px_rgba(0,0,0,0.03)]',
                    {
                        'min-w-[64px]': !expanded,
                        'min-w-[80vw]': expanded,
                    }
                )}>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="absolute -right-[12px] top-8 z-10 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-pzh-blue-dark">
                    <AngleRight
                        className={classNames('transform text-pzh-white', {
                            'rotate-180 transform': expanded,
                        })}
                        size={16}
                    />
                </button>

                <div className="overflow-hidden px-4 py-[96px]">
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
                                    onPress={() =>
                                        addItem([], {
                                            type,
                                            uuid: uuidv4(),
                                        })
                                    }>
                                    {section.defaults.name}
                                </PillButton>
                            )
                        })}
                </div>
            </div>
        </div>
    )
}

export default Sidebar
