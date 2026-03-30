import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useShallow } from 'zustand/react/shallow'

import Modal from '@/components/Modal'
import RegulationForm from '@/components/Regulations/RegulationForm'
import { calculateNewIndex } from '@/components/Regulations/utils'
import * as sections from '@/config/regulations/sections'
import { Structure } from '@/config/regulations/types'
import useModalStore from '@/store/modalStore'
import useRegulationStore from '@/store/regulationStore'

const RegulationAddSectionModal = () => {
    const { structure, itemAction, addItem } = useRegulationStore(
        useShallow(state => ({
            structure: state.structure,
            itemAction: state.itemAction,
            addItem: state.addItem,
        }))
    )
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const index = useMemo(
        () => calculateNewIndex(structure, itemAction),
        [itemAction, structure]
    )

    if (!itemAction?.type || !itemAction?.path || itemAction.action !== 'add')
        return null

    const section = sections[itemAction.type]
    const { singular, singularCapitalize, prefixSingular } = section.defaults

    const handleFormSubmit = (payload: Structure) => {
        addItem(itemAction.path || [], {
            uuid: uuidv4(),
            ...payload,
        })
        setActiveModal(null)
    }

    return (
        <Modal id="regulationAdd" title={`${singularCapitalize} toevoegen`}>
            <RegulationForm
                initialValues={{
                    type: itemAction.type,
                    label: singularCapitalize,
                    index,
                }}
                handleFormSubmit={handleFormSubmit}
                title={`Kop van ${prefixSingular} ${singular}`}
                section={section}
            />
        </Modal>
    )
}

export default RegulationAddSectionModal
