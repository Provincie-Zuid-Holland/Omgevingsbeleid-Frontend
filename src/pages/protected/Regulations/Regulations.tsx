import {
    RegulationAddSectionModal,
    RegulationDeleteSectionModal,
    RegulationEditSectionModal,
} from '@/components/Modals/RegulationModals'
import RegulationPreview from '@/components/Regulations/RegulationPreview'
import MutateLayout from '@/templates/MutateLayout'

const Regulations = () => {
    return (
        <MutateLayout title="Verordening">
            <div className="col-span-6">
                <RegulationPreview />
            </div>

            <RegulationAddSectionModal />
            <RegulationDeleteSectionModal />
            <RegulationEditSectionModal />
        </MutateLayout>
    )
}

export default Regulations
