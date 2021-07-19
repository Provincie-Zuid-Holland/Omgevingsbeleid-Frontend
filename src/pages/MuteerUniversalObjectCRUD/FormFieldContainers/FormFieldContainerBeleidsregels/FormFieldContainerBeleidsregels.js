import React from 'react'
import PropTypes from 'prop-types'

import ContainerFormSection from './../../../../components/ContainerFormSection'
import {
    FormFieldDate,
    FormFieldTextInput,
    FormFieldTextArea,
    FormFieldWeblink,
} from './../../../../components/FormFieldsExport'

function FormFieldContainerBeleidsregels({
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
                    pValue="Formuleer in enkele woorden de titel van deze beleidsregel."
                    titleSingular={titleSingular}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Omschrijving beleidsregel"
                beschrijving="Een beleidsregel geeft weer op welke wijze de provincie invulling geeft aan een medebewindstaak. "
            >
                <FormFieldTextArea
                    handleChange={handleChange}
                    fieldValue={crudObject['Omschrijving']}
                    fieldLabel="Omschrijving"
                    dataObjectProperty="Omschrijving"
                    pValue="Geef een korte omschrijving van deze beleidsregel."
                    titleSingular={titleSingular}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Aanvullende informatie"
                beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en indien bekend, de datum van inwerkingtreding."
            >
                <FormFieldWeblink
                    handleChange={handleChange}
                    fieldValue={crudObject['Weblink']}
                    dataObjectProperty="Weblink"
                    fieldLabel="IDMS"
                    pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                    titleSingular={titleSingular}
                />

                <FormFieldTextInput
                    handleChange={handleChange}
                    fieldValue={crudObject['Externe_URL']}
                    dataObjectProperty="Externe_URL"
                    fieldLabel="Externe URL"
                    pValue={null}
                    titleSingular={titleSingular}
                />

                <div className="flex flex-wrap -mx-3">
                    <FormFieldDate
                        handleChange={handleChange}
                        fieldValue={crudObject['Begin_Geldigheid']}
                        fieldLabel="Inwerkingtreding"
                        dataObjectProperty="Begin_Geldigheid"
                        pValue="Indien bekend, kan hier de datum treding worden ingevuld"
                        titleSingular={titleSingular}
                    />

                    <FormFieldDate
                        openUitwerkingstrede={true}
                        handleChange={handleChange}
                        fieldValue={crudObject['Eind_Geldigheid']}
                        fieldLabel="Uitwerkingtreding"
                        dataObjectProperty="Eind_Geldigheid"
                        pValue="Indien bekend, kan hier de datum gtreding worden ingevuld"
                        titleSingular={titleSingular}
                    />
                </div>
            </ContainerFormSection>
        </React.Fragment>
    )
}

FormFieldContainerBeleidsregels.propTypes = {
    titleSingular: PropTypes.string,
    crudObject: PropTypes.object,
    handleChange: PropTypes.func,
}

FormFieldContainerBeleidsregels.defaultProps = {}

export default FormFieldContainerBeleidsregels
