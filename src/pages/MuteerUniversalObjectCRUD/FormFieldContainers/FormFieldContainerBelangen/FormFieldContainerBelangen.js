import React from "react"
import PropTypes from "prop-types"

import ContainerFormSection from "./../../../../components/ContainerFormSection"
import {
    FormFieldDate,
    FormFieldTextInput,
    FormFieldTextArea,
    FormFieldWeblink,
    FormFieldSelect,
} from "./../../../../components/FormFieldsExport"

// Waarden voor het react-select component
const BelangTypeValues = [
    ["Nationaal Belang", "Nationaal Belang"],
    ["Wettelijke Taak & Bevoegdheid", "Wettelijke Taak & Bevoegdheid"],
]

function FormFieldContainerBelangen({
    titleSingular,
    crudObject,
    handleChange,
}) {
    return (
        <React.Fragment>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel en de mogelijkheid om aan te geven of het om een nationaal belang gaat, of een wettelijke taak of bevoegdheid."
            >
                <FormFieldTextInput
                    handleChange={handleChange}
                    fieldValue={crudObject["Titel"]}
                    dataObjectProperty="Titel"
                    fieldLabel="Titel"
                    pValue="Formuleer in enkele woorden de titel van dit nationaal belang of deze wettelijke taak."
                    titleSingular={titleSingular}
                />

                <FormFieldSelect
                    handleChange={handleChange}
                    titleSingular={titleSingular}
                    fieldValue={crudObject["Type"]}
                    selectArray={BelangTypeValues}
                    fieldLabel="Type"
                    dataObjectProperty="Type"
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Omschrijving nationaal belang of wettelijke taak"
                beschrijving="De nationale belangen zijn afkomstig uit de nationale omgevingsvisie, danwel aanvullende afspraken tussen rijk en provincies. De wettelijke taken refereren aan het betreffende wetsartikel waarin de provincie een medebewindstaak opgedragen krijgt."
            >
                <FormFieldTextArea
                    handleChange={handleChange}
                    fieldValue={crudObject["Omschrijving"]}
                    fieldLabel="Omschrijving"
                    dataObjectProperty="Omschrijving"
                    pValue="Geef een korte omschrijving van dit nationaal belang of deze wettelijke taak."
                    titleSingular={titleSingular}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Aanvullende informatie"
                beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en indien bekend, de datum van inwerkingtreding."
            >
                <FormFieldWeblink
                    handleChange={handleChange}
                    fieldValue={crudObject["Weblink"]}
                    dataObjectProperty="Weblink"
                    fieldLabel="IDMS"
                    pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                    titleSingular={titleSingular}
                />

                <div className="flex flex-wrap -mx-3">
                    <FormFieldDate
                        handleChange={handleChange}
                        fieldValue={crudObject["Begin_Geldigheid"]}
                        fieldLabel="Inwerkingtreding"
                        dataObjectProperty="Begin_Geldigheid"
                        pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                        titleSingular={titleSingular}
                    />

                    <FormFieldDate
                        openUitwerkingstrede={true}
                        handleChange={handleChange}
                        Begin_Geldigheid={crudObject["Begin_Geldigheid"]}
                        fieldValue={crudObject["Eind_Geldigheid"]}
                        fieldLabel="Uitwerkingtreding"
                        dataObjectProperty="Eind_Geldigheid"
                        pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                        titleSingular={titleSingular}
                    />
                </div>
            </ContainerFormSection>
        </React.Fragment>
    )
}

FormFieldContainerBelangen.propTypes = {
    titleSingular: PropTypes.string,
    crudObject: PropTypes.object,
    handleChange: PropTypes.func,
}

FormFieldContainerBelangen.defaultProps = {}

export default FormFieldContainerBelangen
