import {
    RegulationAddSectionModal,
    RegulationDeleteSectionModal,
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
        </MutateLayout>
    )
}

export default Regulations
