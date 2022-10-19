import { FormikDate, FormikInput } from '@pzh-ui/components'
import { useContext } from 'react'

import { ContainerFormSection } from '@/components/Container'
import { FormFieldInputContainer } from '@/components/Form'
import FormSpacer from '@/components/Form/FormSpacer'

import MutateContext from '../../MutateContext'
export interface FieldsBeleidsmoduleProps {}

const FieldsBeleidsmodule = () => {
    const { isRequired } = useContext(MutateContext)
    return (
        <>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel.">
                <FormFieldInputContainer>
                    <FormikInput
                        label="Titel"
                        required={isRequired('Titel')}
                        description="Formuleer in enkele woorden de titel van deze module."
                        name="Titel"
                        type="text"
                    />
                    <FormSpacer />
                    <FormikDate
                        placeholderText="dd-mm-jjjj"
                        label="Besluitdatum"
                        description="Vul hier de besluitdatum in."
                        name="Besluit_Datum"
                        required={isRequired('Begin_Geldigheid')}
                    />
                </FormFieldInputContainer>
            </ContainerFormSection>
        </>
    )
}

export default FieldsBeleidsmodule
