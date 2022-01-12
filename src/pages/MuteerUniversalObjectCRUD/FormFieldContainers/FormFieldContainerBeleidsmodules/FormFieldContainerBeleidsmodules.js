import ContainerFormSection from './../../../../components/ContainerFormSection'
import {
    FormFieldTextInput,
    FormFieldDate,
} from './../../../../components/FormFieldsExport'

/**
 *
 * @param {object} props
 * @param {string} props.titleSingular - Contains the singular form of the policy object type (e.g. 'maatregel')
 * @param {object} props.crudObject - Contains the policy object that is being edited / created
 * @param {function} props.handleChange - Contains the change handler function
 * @returns The form fields for policy objects of the type Beleidsmodules
 */
function FormFieldContainerBeleidsmodules({
    titleSingular,
    crudObject,
    handleChange,
}) {
    return (
        <>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel."
            >
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
