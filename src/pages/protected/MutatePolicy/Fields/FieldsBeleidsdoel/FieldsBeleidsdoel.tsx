import { FormikDate, FormikInput, FormikTextArea } from '@pzh-ui/components'
import { useContext } from 'react'

import { ContainerFormSection } from '@/components/Container'
import FormSpacer from '@/components/Form/FormSpacer'

import MutateContext from '../../MutateContext'

const FieldsBeleidsdoel = () => {
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
                    description="Formuleer in enkele woorden de titel van deze beleidsprestatie."
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Omschrijving beleidsdoel"
                beschrijving="Een beleidsdoel bevindt zich op tactisch niveau, tussen het niveau van de ambities en de beleidskeuzes.">
                <FormikTextArea
                    name="Omschrijving"
                    label="Omschrijving"
                    required={isRequired('Omschrijving')}
                    description="Geef een korte omschrijving van dit beleidsdoel."
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

export default FieldsBeleidsdoel
