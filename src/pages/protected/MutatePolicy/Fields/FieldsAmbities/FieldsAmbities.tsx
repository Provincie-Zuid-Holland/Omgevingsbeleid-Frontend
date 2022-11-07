import { FormikDate, FormikInput, FormikTextArea } from '@pzh-ui/components'
import { useContext } from 'react'

import { ContainerFormSection } from '@/components/Container'
import FormSpacer from '@/components/Form/FormSpacer'

import MutateContext from '../../MutateContext'

export interface FieldsAmbitiesProps {}

const FieldsAmbities = ({}: FieldsAmbitiesProps) => {
    const { isRequired } = useContext(MutateContext)
    return (
        <>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel.">
                <FormikInput
                    label="Titel"
                    required={isRequired('Titel')}
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
                    required={isRequired('Omschrijving')}
                    description="Geef een korte omschrijving van deze ambitie"
                    name="Omschrijving"
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Aanvullende informatie"
                beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en de in- en uitwerkingstredingsdatum">
                <FormikInput
                    label="IDMS"
                    required={isRequired('Weblink')}
                    description="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                    name="Weblink"
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
                    label="Uitwerkingtreding"
                    required={isRequired('Eind_Geldigheid')}
                    description="De datum waarop dit object uitwerking moet treden."
                    placeholderText="dd-mm-jjjj"
                    name="Eind_Geldigheid"
                />
            </ContainerFormSection>
        </>
    )
}

export default FieldsAmbities