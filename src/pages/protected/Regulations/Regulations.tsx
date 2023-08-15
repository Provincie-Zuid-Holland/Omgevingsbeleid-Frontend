import { RegulationAddObjectModal } from '@/components/Modals/RegulationModals'
import RegulationPreview from '@/components/Regulations/RegulationPreview'
import MutateLayout from '@/templates/MutateLayout'

const Regulations = () => {
    return (
        <MutateLayout title="Verordening">
            <div className="col-span-6">
                <RegulationPreview />
            </div>

            <RegulationAddObjectModal isOpen onClose={() => {}} />
        </MutateLayout>
    )
}

export default Regulations
