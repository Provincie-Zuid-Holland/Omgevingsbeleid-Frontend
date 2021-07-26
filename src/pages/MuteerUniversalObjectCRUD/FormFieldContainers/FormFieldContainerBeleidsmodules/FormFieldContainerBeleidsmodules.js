import React from 'react'
import ContainerFormSection from './../../../../components/ContainerFormSection'
import { FormFieldTextInput } from './../../../../components/FormFieldsExport'

function FormFieldContainerBeleidsmodules({
    titleSingular,
    crudObject,
    handleChange,
}) {
    return (
        <React.Fragment>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel."
            >
                <FormFieldTextInput
                    handleChange={handleChange}
                    fieldValue={crudObject['Titel']}
                    dataObjectProperty="Titel"
                    fieldLabel="Titel"
                    pValue="Formuleer in enkele woorden de titel van deze ambitie."
                    titleSingular={titleSingular}
                />
            </ContainerFormSection>
        </React.Fragment>
    )
}

export default FormFieldContainerBeleidsmodules
