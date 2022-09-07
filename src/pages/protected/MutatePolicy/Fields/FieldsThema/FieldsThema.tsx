import { FormikDate, FormikInput, FormikTextArea } from '@pzh-ui/components'

import { ContainerFormSection } from '@/components/Container'

const FieldsThema = () => (
    <>
        <ContainerFormSection
            titel="Algemene informatie"
            beschrijving="De algemene informatie bevat een duidelijke titel.">
            <FormikInput
                name="Titel"
                label="Titel"
                description="Beschrijf in een aantal woorden de titel van dit thema."
            />
        </ContainerFormSection>

        <ContainerFormSection
            titel="Omschrijving thema"
            beschrijving="Een thema wordt gebruikt om het beleid te categoriseren.">
            <FormikTextArea
                name="Omschrijving"
                label="Omschrijving"
                description="Geef een korte omschrijving van dit thema."
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

export default FieldsThema
