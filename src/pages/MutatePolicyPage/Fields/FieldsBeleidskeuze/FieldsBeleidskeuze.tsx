import { FormikDate, FormikInput, FormikTextArea } from '@pzh-ui/components'

import { ContainerFormSection } from '@/components/Container'
import FormFieldSelectUserGroup from '@/components/Form/FormFieldSelectUserGroup'

export interface FieldsBeleidskeuzeProps {}

function FieldsBeleidskeuze({}: FieldsBeleidskeuzeProps) {
    return (
        <>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel.">
                <FormikInput
                    label="Titel"
                    description="Formuleer in enkele woorden de titel van de beleidskeuze."
                    optimized={true}
                    name="Titel"
                    type="text"
                    className="mb-6"
                />
                <FormFieldSelectUserGroup disabled={false} />
            </ContainerFormSection>
        </>
    )
}

export default FieldsBeleidskeuze
