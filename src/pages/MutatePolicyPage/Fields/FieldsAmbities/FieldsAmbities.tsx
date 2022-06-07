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
                required={true}
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
            beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en de in- en uitwerkingstredingsdatum">
            <FormikInput
                label="IDMS"
                description="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                name="Weblink"
                type="text"
                className="mb-6"
            />
            <FormikDate
                required={true}
                label="Inwerkingtreding"
                description="De datum waarop dit object inwerking moet treden."
                name="Begin_Geldigheid"
                placeholderText="dd-mm-jjjj"
                className="mb-6"
            />
            <FormikDate
                label="Uitwerkingtreding"
                description="De datum waarop dit object uitwerking moet treden."
                placeholderText="dd-mm-jjjj"
                name="Eind_Geldigheid"
            />
        </ContainerFormSection>
    </>
)

export default FieldsAmbities
