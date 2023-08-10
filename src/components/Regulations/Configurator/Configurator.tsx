import { PillButton, Text } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import { v4 as uuidv4 } from 'uuid'

import regulation from '@/config/regulations'
import * as sections from '@/config/regulations/sections'
import useRegulationStore from '@/store/regulationStore'

import RecursiveAccordion from '../RecursiveAccordion'

const Configurator = () => {
    const structure = useRegulationStore(state => state.structure)
    const addItem = useRegulationStore(state => state.addItem)

    return (
        <div>
            <Text type="body-bold" color="text-pzh-blue">
                {regulation.title}
            </Text>

            <div>
                <RecursiveAccordion structure={structure} />

                {regulation.structure?.map(({ type }, index) => {
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
    )
}

export default Configurator
