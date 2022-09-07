import { FormikDate, FormikInput, FormikTextArea } from '@pzh-ui/components'

import { ContainerFormSection } from '@/components/Container'

const FieldsBeleidsregel = () => (
    <>
        <ContainerFormSection
            titel="Algemene informatie"
            beschrijving="De algemene informatie bevat een duidelijke titel.">
            <FormikInput
                name="Titel"
                label="Titel"
                description="Formuleer in enkele woorden de titel van deze beleidsregel."
            />
        </ContainerFormSection>

        <ContainerFormSection
            titel="Omschrijving beleidsregel"
            beschrijving="Een beleidsregel geeft weer op welke wijze de provincie invulling geeft aan een medebewindstaak.">
            <FormikTextArea
                name="Omschrijving"
                label="Omschrijving"
                description="Geef een korte omschrijving van deze beleidsregel."
            />
        </ContainerFormSection>

        <ContainerFormSection
            titel="Aanvullende informatie"
            beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en indien bekend, de datum van inwerkingtreding.">
            <FormikInput
                className="mb-6"
                name="Weblink"
                label="IDMS"
                placeholder="IDMS"
                description="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
            />
            <FormikInput
                className="mb-6"
                name="Externe_URL"
                label="Externe URL"
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

export default FieldsBeleidsregel
