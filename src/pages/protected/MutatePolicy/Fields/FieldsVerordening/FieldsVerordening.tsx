import { FormikDate, FormikInput } from '@pzh-ui/components'
import { useContext } from 'react'

import { ContainerFormSection } from '@/components/Container'
import FormSpacer from '@/components/Form/FormSpacer'

import MutateContext from '../../MutateContext'

const FieldsVerordening = () => {
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
                    description="Vul hier uw titel in."
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Aanvullende informatie"
                beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en de in- en uitwerkingstredingsdatum">
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

export default FieldsVerordening
