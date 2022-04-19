import { FormikDate, FormikInput } from '@pzh-ui/components'

import { ContainerFormSection } from '@/components/Container'
import { FormFieldInputContainer } from '@/components/Form'

export interface FieldsBeleidsmoduleProps {}

const FieldsBeleidsmodule = () => (
    <>
        <ContainerFormSection
            titel="Algemene informatie"
            beschrijving="De algemene informatie bevat een duidelijke titel.">
            <FormFieldInputContainer>
                <FormikInput
                    label="Titel"
                    description="Formuleer in enkele woorden de titel van deze module."
                    name="Titel"
                    type="text"
                />
                <FormikDate
                    label="Besluitdatum"
                    description="Vul hier de besluitdatum in."
                    name="Besluit_Datum"
                />
            </FormFieldInputContainer>
        </ContainerFormSection>
    </>
)

export default FieldsBeleidsmodule
