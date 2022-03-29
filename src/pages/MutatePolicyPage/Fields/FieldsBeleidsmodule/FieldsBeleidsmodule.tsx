import { FormikDate, FormikInput, FormikTextArea } from '@pzh-ui/components'

import { ContainerFormSection } from '@/components/Container'
import { FormFieldInputContainer } from '@/components/Form'

export interface FieldsBeleidsmoduleProps {}

function FieldsBeleidsmodule({}: FieldsBeleidsmoduleProps) {
    return (
        <>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel.">
                <FormFieldInputContainer>
                    <FormikInput
                        label="Titel"
                        description="Formuleer in enkele woorden de titel van deze module."
                        optimized={true}
                        name="Titel"
                        type="text"
                    />
                    <FormikDate
                        label="Besluitdatum"
                        description="Vul hier de besluitdatum in."
                        name="Besluit_Datum"
                        optimized={true}
                    />
                </FormFieldInputContainer>
            </ContainerFormSection>
        </>
    )
}

export default FieldsBeleidsmodule
