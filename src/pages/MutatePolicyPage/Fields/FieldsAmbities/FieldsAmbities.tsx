import {
    FieldLabel,
    FormikDate,
    FormikInput,
    FormikTextArea,
} from '@pzh-ui/components'

import { ContainerFormSection } from '@/components/Container'
import { FormFieldInputContainer } from '@/components/Form'

export interface FieldsAmbitiesProps {}

function FieldsAmbities({}: FieldsAmbitiesProps) {
    return (
        <>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel.">
                <FormFieldInputContainer>
                    <FieldLabel
                        name="Titel"
                        label="Titel"
                        description="Formuleer in enkele woorden de titel van deze ambitie."
                    />
                    <FormikInput optimized={true} name="Titel" type="text" />
                </FormFieldInputContainer>
            </ContainerFormSection>

            <ContainerFormSection
                titel="Omschrijving ambitie"
                beschrijving="Geef een korte omschrijving van deze ambitie">
                <FormFieldInputContainer>
                    <FieldLabel
                        name="Omschrijving"
                        label="Omschrijving"
                        description="Geef een korte omschrijving van deze ambitie"
                    />
                    <FormikTextArea optimized={true} name="Omschrijving" />
                </FormFieldInputContainer>
            </ContainerFormSection>

            <ContainerFormSection
                titel="Aanvullende informatie"
                beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en indien bekend, de datum van inwerkingtreding.">
                <FormFieldInputContainer>
                    <FieldLabel
                        name="Weblink"
                        label="IDMS"
                        description="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                    />
                    <FormikInput optimized={true} name="Weblink" type="text" />
                </FormFieldInputContainer>

                <FormFieldInputContainer>
                    <FieldLabel
                        name="Begin_Geldigheid"
                        label="Inwerkingtreding"
                        description="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                    />
                    <FormikDate optimized={true} name="Begin_Geldigheid" />
                </FormFieldInputContainer>

                <FormFieldInputContainer>
                    <FieldLabel
                        name="Eind_Geldigheid"
                        label="Uitwerkingtreding"
                        description="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                    />
                    <FormikDate optimized={true} name="Eind_Geldigheid" />
                </FormFieldInputContainer>
            </ContainerFormSection>
        </>
    )
}

export default FieldsAmbities
