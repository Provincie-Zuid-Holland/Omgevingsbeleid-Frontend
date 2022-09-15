import { FormikDate, FormikInput, FormikTextArea } from '@pzh-ui/components'
import { useContext } from 'react'

import { ContainerFormSection } from '@/components/Container'
import FormSpacer from '@/components/Form/FormSpacer'

import MutateContext from '../../MutateContext'
const FieldsBeleidsprestatie = () => {
    const { isRequired } = useContext(MutateContext)
    return (
        <>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel.">
                <FormikInput
                    name="Titel"
                    label="Titel"
                    description="Formuleer in enkele woorden de titel van deze beleidsprestatie."
                    required={isRequired('Titel')}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Omschrijving beleidsprestatie"
                beschrijving="Geef een korte omschrijving van deze beleidsprestatie">
                <FormikTextArea
                    name="Omschrijving"
                    required={isRequired('Omschrijving')}
                    label="Omschrijving"
                    description="Geef een korte omschrijving van deze beleidsprestatie"
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Aanvullende informatie"
                beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en de in- en uitwerkingstredingsdatum">
                <FormikInput
                    required={isRequired('Weblink')}
                    label="IDMS"
                    description="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                    name="Weblink"
                    type="text"
                />
                <FormSpacer />
                <FormikDate
                    placeholderText="dd-mm-jjjj"
                    label="Inwerkingtreding"
                    description="De datum waarop dit object inwerking moet treden."
                    name="Begin_Geldigheid"
                    required={isRequired('Begin_Geldigheid')}
                />
                <FormSpacer />
                <FormikDate
                    label="Uitwerkingtreding"
                    description="De datum waarop dit object uitwerking moet treden."
                    placeholderText="dd-mm-jjjj"
                    name="Eind_Geldigheid"
                    required={isRequired('Eind_Geldigheid')}
                />
            </ContainerFormSection>
        </>
    )
}

export default FieldsBeleidsprestatie
