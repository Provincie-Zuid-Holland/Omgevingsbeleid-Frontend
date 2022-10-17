import { FormikDate, FormikInput, FormikTextArea } from '@pzh-ui/components'
import { useContext } from 'react'

import { ContainerFormSection } from '@/components/Container'
import FormSpacer from '@/components/Form/FormSpacer'

import MutateContext from '../../MutateContext'
const FieldsBeleidsregel = () => {
    const { isRequired } = useContext(MutateContext)
    return (
        <>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel.">
                <FormikInput
                    name="Titel"
                    label="Titel"
                    required={isRequired('Titel')}
                    description="Formuleer in enkele woorden de titel van deze beleidsregel."
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Omschrijving beleidsregel"
                beschrijving="Een beleidsregel geeft weer op welke wijze de provincie invulling geeft aan een medebewindstaak.">
                <FormikTextArea
                    name="Omschrijving"
                    required={isRequired('Omschrijving')}
                    label="Omschrijving"
                    description="Geef een korte omschrijving van deze beleidsregel."
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Aanvullende informatie"
                beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en indien bekend, de datum van inwerkingtreding.">
                <FormikInput
                    name="Weblink"
                    label="IDMS"
                    required={isRequired('Weblink')}
                    placeholder="IDMS"
                    description="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                />
                <FormSpacer />

                <FormikInput
                    name="Externe_URL"
                    label="Externe URL"
                    required={isRequired('Externe_URL')}
                />
                <FormSpacer />
                <FormikDate
                    name="Begin_Geldigheid"
                    required={isRequired('Begin_Geldigheid')}
                    label="Inwerking"
                    placeholder="dd-mm-jjjj"
                    description="De datum waarop dit object inwerking moet treden."
                />
                <FormSpacer />

                <FormikDate
                    name="Eind_Geldigheid"
                    label="Uitwerking"
                    required={isRequired('Eind_Geldigheid')}
                    placeholder="dd-mm-jjjj"
                    description="De datum waarop dit object uitwerking moet treden."
                />
            </ContainerFormSection>
        </>
    )
}

export default FieldsBeleidsregel
