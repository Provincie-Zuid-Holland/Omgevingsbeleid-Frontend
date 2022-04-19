import { FormikDate, FormikInput, FormikTextArea } from '@pzh-ui/components'

import { ContainerFormSection } from '@/components/Container'

export interface FieldsAmbitiesProps {}

const FieldsAmbities = ({}: FieldsAmbitiesProps) => (
    <>
        <ContainerFormSection
            titel="Algemene informatie"
            beschrijving="De algemene informatie bevat een duidelijke titel.">
            <FormikInput
                label="Titel"
                description="Formuleer in enkele woorden de titel van deze ambitie."
                name="Titel"
                type="text"
            />
        </ContainerFormSection>

        <ContainerFormSection
            titel="Omschrijving ambitie"
            beschrijving="Geef een korte omschrijving van deze ambitie">
            <FormikTextArea
                label="Omschrijving"
                description="Geef een korte omschrijving van deze ambitie"
                name="Omschrijving"
            />
        </ContainerFormSection>

        <ContainerFormSection
            titel="Aanvullende informatie"
            beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en indien bekend, de datum van inwerkingtreding.">
            <FormikInput
                label="IDMS"
                description="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                name="Weblink"
                type="text"
                className="mb-6"
            />
            <FormikDate
                label="Inwerkingtreding"
                description="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                name="Begin_Geldigheid"
                className="mb-6"
            />
            <FormikDate
                label="Uitwerkingtreding"
                description="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                placeholderText="dd-mm-jjjj"
                name="Eind_Geldigheid"
            />
        </ContainerFormSection>
    </>
)

export default FieldsAmbities
