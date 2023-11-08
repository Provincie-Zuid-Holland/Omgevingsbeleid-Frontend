import Modal from '@/components/Modal'
import RegulationForm from '@/components/Regulations/RegulationForm'
import { findObjectByUUID } from '@/components/Regulations/utils'
import * as sections from '@/config/regulations/sections'
import { Structure } from '@/config/regulations/types'
import useModalStore from '@/store/modalStore'
import useRegulationStore from '@/store/regulationStore'

const RegulationEditSectionModal = () => {
    const structure = useRegulationStore(state => state.structure)
    const itemAction = useRegulationStore(state => state.itemAction)
    const editItem = useRegulationStore(state => state.editItem)
    const setActiveModal = useModalStore(state => state.setActiveModal)

    if (!itemAction?.type || itemAction.action !== 'edit' || !itemAction.uuid)
        return null

    const context = findObjectByUUID(itemAction.uuid, structure)

    if (!context) return null

    const section = sections[itemAction.type]
    const { singular, singularCapitalize, prefixSingular } = section.defaults

    const handleFormSubmit = (payload: Structure) => {
        editItem(itemAction.uuid!, payload)
        setActiveModal(null)
    }

    return (
        <Modal
            size="l"
            id="regulationEdit"
            title={`${singularCapitalize} ${itemAction.index} wijzigen`}>
            <RegulationForm
                initialValues={{
                    label: singularCapitalize,
                    index: itemAction.index,
                    ...context,
                }}
                handleFormSubmit={handleFormSubmit}
                title={`Kop van ${prefixSingular} ${singular}`}
                section={section}
            />
        </Modal>
    )
}

export default RegulationEditSectionModal
