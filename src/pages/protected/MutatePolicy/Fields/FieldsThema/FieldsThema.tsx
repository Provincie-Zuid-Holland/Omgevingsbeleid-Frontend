import { FormikDate, FormikInput, FormikTextArea } from '@pzh-ui/components'
import { useContext } from 'react'

import { ContainerFormSection } from '@/components/Container'
import FormSpacer from '@/components/Form/FormSpacer'

import MutateContext from '../../MutateContext'

const FieldsThema = () => {
    const { isRequired } = useContext(MutateContext)
    return (
        <>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel.">
                <FormikInput
                    required={isRequired('Titel')}
                    name="Titel"
                    label="Titel"
                    description="Beschrijf in een aantal woorden de titel van dit thema."
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Omschrijving thema"
                beschrijving="Een thema wordt gebruikt om het beleid te categoriseren.">
                <FormikTextArea
                    required={isRequired('Omschrijving')}
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
                    required={isRequired('Weblink')}
                    type="text"
                />
                <FormSpacer />
                <FormikDate
                    label="Inwerking"
                    description="De datum waarop dit object inwerking moet treden."
                    name="Begin_Geldigheid"
                    required={isRequired('Begin_Geldigheid')}
                    placeholderText="dd-mm-jjjj"
                />
                <FormSpacer />
                <FormikDate
                    label="Uitwerking"
                    description="De datum waarop dit object uitwerking moet treden."
                    placeholderText="dd-mm-jjjj"
                    name="Eind_Geldigheid"
                    required={isRequired('Eind_Geldigheid')}
                />
            </ContainerFormSection>
        </>
    )
}

export default FieldsThema
