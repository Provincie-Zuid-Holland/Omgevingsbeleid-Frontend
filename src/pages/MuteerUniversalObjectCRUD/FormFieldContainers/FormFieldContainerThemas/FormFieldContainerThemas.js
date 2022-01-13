import PropTypes from 'prop-types'

import { ContainerFormSection } from './../../../../components/Container'
import {
    FormFieldGeldigheid,
    FormFieldTextInput,
    FormFieldTextArea,
    FormFieldWeblink,
} from './../../../../components/Form'

/**
 *
 * @param {object} props
 * @param {string} props.titleSingular - Contains the singular form of the policy object type (e.g. 'maatregel')
 * @param {object} props.crudObject - Contains the policy object that is being edited / created
 * @param {function} props.handleChange - Contains the change handler function
 * @returns The form fields for policy objects of the type Themas
 */
function FormFieldContainerThemas({ titleSingular, crudObject, handleChange }) {
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
                    pValue="Beschrijf in een aantal woorden de titel van dit thema."
                    titleSingular={titleSingular}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Omschrijving thema"
                beschrijving="Een thema wordt gebruikt om het beleid te categoriseren.">
                <FormFieldTextArea
                    handleChange={handleChange}
                    fieldValue={crudObject['Omschrijving']}
                    fieldLabel="Omschrijving"
                    dataObjectProperty="Omschrijving"
                    pValue="Geef een korte omschrijving van dit thema."
                    titleSingular={titleSingular}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Aanvullende informatie"
                beschrijving="In deze sectie vragen we aanvullende informatie zoals (indien bekend) de datum van inwerkingtreding.">
                <FormFieldWeblink
                    handleChange={handleChange}
                    fieldValue={crudObject['Weblink']}
                    dataObjectProperty="Weblink"
                    fieldLabel="IDMS"
                    pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                    titleSingular={titleSingular}
                />
                <div className="flex flex-wrap -mx-3">
                    <FormFieldGeldigheid
                        handleChange={handleChange}
                        fieldValue={crudObject['Begin_Geldigheid']}
                        fieldLabel="Inwerkingtreding"
                        dataObjectProperty="Begin_Geldigheid"
                        pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                        titleSingular={titleSingular}
                    />
                    <FormFieldGeldigheid
                        openUitwerkingstrede={true}
                        handleChange={handleChange}
                        fieldValue={crudObject['Eind_Geldigheid']}
                        fieldLabel="Uitwerkingtreding"
                        dataObjectProperty="Eind_Geldigheid"
                        pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                        titleSingular={titleSingular}
                    />
                </div>
            </ContainerFormSection>
        </>
    )
}

FormFieldContainerThemas.propTypes = {
    titleSingular: PropTypes.string,
    crudObject: PropTypes.object,
    handleChange: PropTypes.func,
}

FormFieldContainerThemas.defaultProps = {}

export default FormFieldContainerThemas
