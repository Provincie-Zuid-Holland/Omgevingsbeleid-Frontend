import { ChangeEventHandler } from 'react'

import { ContainerFormSection } from '@/components/Container'
import { FormFieldTextInput, FormFieldDate } from '@/components/Form'

/**
 * @returns The form fields for policy objects of the type Beleidsmodules
 */

interface FormFieldContainerBeleidsmodulesProps {
    titleSingular: string
    crudObject: any
    handleChange: ChangeEventHandler
}

function FormFieldContainerBeleidsmodules({
    titleSingular,
    crudObject,
    handleChange,
}: FormFieldContainerBeleidsmodulesProps) {
    return (
        <>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel.">
                <FormFieldTextInput
                    handleChange={handleChange}
                    fieldValue={crudObject['Titel']}
                    dataObjectProperty="Titel"
                    fieldLabel="Titel"
                    pValue="Formuleer in enkele woorden de titel van deze module."
                    titleSingular={titleSingular}
                />
                <FormFieldDate
                    handleChange={handleChange}
                    fieldValue={crudObject['Besluit_Datum']}
                    dataObjectProperty="Besluit_Datum"
                    fieldLabel="Besluitdatum"
                    pValue="Vul hier de besluitdatum in."
                    titleSingular={titleSingular}
                />
            </ContainerFormSection>
        </>
    )
}

export default FormFieldContainerBeleidsmodules
