import { Heading } from '@pzh-ui/components'

import Configurator from '@/components/Regulations/Configurator'
import MutateLayout from '@/templates/MutateLayout'

const Regulations = () => {
    return (
        <MutateLayout title="Verordening">
            <div className="col-span-6 mb-8 lg:col-span-3">
                <Heading level="1" className="mb-3">
                    Verordeningen
                </Heading>
            </div>

            <div className="col-span-6">
                <Configurator />
            </div>
        </MutateLayout>
    )
}

export default Regulations
