import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ContainerFormSection from './../../../../components/ContainerFormSection'
import {
    FormFieldDate,
    FormFieldTextInput,
    FormFieldTextArea,
    FormFieldWeblink,
    FormFieldSelect,
    FormFieldWerkingsgebiedKoppelingSingle,
} from './../../../../components/FormFieldsExport'

// Waarden voor het react-select component
const verplichtProgrammaValues = [
    ['Ja', 'Ja'],
    ['Nee', 'Nee'],
]
const SpecifiekOfGeneriekValues = [
    ['Gebiedsspecifiek', 'Gebiedsspecifiek'],
    ['Generiek', 'Generiek'],
]

function FormFieldContainerMaatregelen({
    titelEnkelvoud,
    crudObject,
    handleChange,
}) {
    return (
        <React.Fragment>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel en de mogelijkheid om aan te geven of het programma verplicht is en of het programma gebiedsspecifiek of generiek is."
            >
                <FormFieldTextInput
                    handleChange={handleChange}
                    fieldValue={crudObject['Titel']}
                    dataObjectProperty="Titel"
                    fieldLabel="Titel"
                    pValue="Formuleer in enkele woorden de titel van deze maatregel."
                    titelEnkelvoud={titelEnkelvoud}
                />

                <FormFieldSelect
                    handleChange={handleChange}
                    fieldValue={crudObject['Verplicht_Programma']}
                    fieldLabel="Verplicht Programma"
                    dataObjectProperty="Verplicht_Programma"
                    selectArray={verplichtProgrammaValues}
                    pValue="De maatregel behoort tot een verplicht programma?"
                    titelEnkelvoud={titelEnkelvoud}
                />

                <FormFieldSelect
                    handleChange={handleChange}
                    fieldValue={crudObject['Specifiek_Of_Generiek']}
                    fieldLabel="Specifiek of Generiek"
                    dataObjectProperty="Specifiek_Of_Generiek"
                    selectArray={SpecifiekOfGeneriekValues}
                    pValue="Is de maatregel te kwalificeren als gebiedsspecifiek of generiek?"
                    titelEnkelvoud={titelEnkelvoud}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Omschrijving maatregel"
                beschrijving="Een maatregel beschrijft de wijze waarop uitvoering wordt gegeven aan beleid."
            >
                <FormFieldTextArea
                    handleChange={handleChange}
                    fieldValue={crudObject['Omschrijving']}
                    fieldLabel="Omschrijving"
                    dataObjectProperty="Omschrijving"
                    pValue="Geef een korte omschrijving van deze maatregel"
                    titelEnkelvoud={titelEnkelvoud}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Werkingsgebied"
                beschrijving="Een maatregel beschrijft de wijze waarop uitvoering wordt gegeven aan beleid."
            >
                <FormFieldWerkingsgebiedKoppelingSingle
                    handleChange={handleChange}
                    titelEnkelvoud={titelEnkelvoud}
                    fieldValue={crudObject['Gebied']}
                    fieldLabel="Selecteer werkingsgebied"
                    dataObjectProperty="Gebied"
                    pValue="Selecteer hier het werkingsgebied wat bij deze maatregel past."
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Aanvullende informatie"
                beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en het besluitnummer."
            >
                <FormFieldWeblink
                    handleChange={handleChange}
                    fieldValue={crudObject['Weblink']}
                    dataObjectProperty="Weblink"
                    fieldLabel="IDMS"
                    pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                    titelEnkelvoud={titelEnkelvoud}
                />

                <div className="flex flex-wrap -mx-3">
                    <FormFieldDate
                        handleChange={handleChange}
                        fieldValue={crudObject['Begin_Geldigheid']}
                        fieldLabel="Inwerkingtreding"
                        dataObjectProperty="Begin_Geldigheid"
                        pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                        titelEnkelvoud={titelEnkelvoud}
                    />

                    <FormFieldDate
                        openUitwerkingstrede={true}
                        handleChange={handleChange}
                        fieldValue={crudObject['Eind_Geldigheid']}
                        fieldLabel="Uitwerkingtreding"
                        dataObjectProperty="Eind_Geldigheid"
                        pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                        titelEnkelvoud={titelEnkelvoud}
                    />
                </div>
            </ContainerFormSection>
        </React.Fragment>
    )
}

FormFieldContainerMaatregelen.propTypes = {
    titelEnkelvoud: PropTypes.string,
    crudObject: PropTypes.object,
    handleChange: PropTypes.func,
}

FormFieldContainerMaatregelen.defaultProps = {}

export default FormFieldContainerMaatregelen
