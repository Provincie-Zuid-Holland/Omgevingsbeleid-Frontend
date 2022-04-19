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
            beschrijving="In deze sectie vragen we aanvullende informatie zoals (indien bekend) de datum van inwerkingtreding.">
            <FormikInput
                className="mb-6"
                name="Weblink"
                label="IDMS"
                placeholder="IDMS"
                description="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
            />

            <FormikDate
                className="mb-6"
                name="Begin_Geldigheid"
                label="Inwerkingtreding"
                placeholder="dd-mm-jjjj"
                description="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
            />

            <FormikDate
                name="Eind_Geldigheid"
                label="Uitwerkingtreding"
                placeholder="dd-mm-jjjj"
                description="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
            />
        </ContainerFormSection>
    </>
)

export default FieldsThema
