import { Heading } from '@pzh-ui/components'

import RegulationPreview from '@/components/Regulations/RegulationPreview'
import MutateLayout from '@/templates/MutateLayout'

const Regulations = () => {
    return (
        <MutateLayout title="Verordening">
            <div className="col-span-6 mb-8 lg:col-span-3">
                <Heading level="1" className="mb-3">
                    Verordening
                </Heading>
            </div>

            <div className="col-span-6">
                <RegulationPreview />
            </div>
        </MutateLayout>
    )
}

export default Regulations
