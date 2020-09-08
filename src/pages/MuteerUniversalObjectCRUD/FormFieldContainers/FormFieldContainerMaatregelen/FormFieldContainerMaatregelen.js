import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ContainerFormSection from './../../../../components/ContainerFormSection'
import FormFieldTitelEnBeschrijving from './../../../../components/FormFieldTitelEnBeschrijving'
import {
    FormFieldDate,
    FormFieldTextInput,
    FormFieldWeblink,
    FormFieldWerkingsgebiedKoppelingSingle,
    FormFieldRadioButton,
    FormFieldRichTextEditor,
    FormFieldInputContainer,
    FormFieldTags,
} from './../../../../components/FormFieldsExport'

const initialValueToelichting = `<h2><b>Rolkeuze</b></h2><p><br><br></p><h2><b>Uitvoering</b></h2><p><br><br></p>`

function FormFieldContainerMaatregelen({
    titelEnkelvoud,
    crudObject,
    handleChange,
}) {
    console.log('crudobject:')
    console.log(crudObject)
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
                    pValue="Maximaal 10 woorden. Moet de lading dekken van het onderwerp. Bijvoorbeeld ‘Opstellen van gebiedsprofielen’"
                    titelEnkelvoud={titelEnkelvoud}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Toelichting maatregel"
                beschrijving="Een maatregel beschrijft de wijze waarop uitvoering wordt gegeven aan beleid."
            >
                <FormFieldInputContainer>
                    <FormFieldTitelEnBeschrijving
                        fieldLabel={'Toelichting'}
                        pValue={
                            "Formuleer in één of enkele zinnen een concrete doelstelling op tactisch niveau. Beschrijf hier het 'wat' en vanuit welke rol."
                        }
                    />
                    <FormFieldRichTextEditor
                        initialValue={initialValueToelichting}
                        handleChange={handleChange}
                        fieldValue={crudObject['Toelichting']}
                        dataObjectProperty="Toelichting"
                        placeholder="Schrijf hier uw toelichting..."
                        toolbar={[{ header: 2 }, 'bold', { list: 'bullet' }]}
                    />
                </FormFieldInputContainer>
            </ContainerFormSection>

            <ContainerFormSection
                titel="Werkingsgebied"
                beschrijving="Het werkingsgebied geeft het gebied weer waarin de maatregel werking heeft. Het gebied waar binnen bepaalde activiteiten gestimuleerd worden, of toegestaan zijn. Maar ook het gebied waar binnen bepaalde activiteiten juist niet zijn toegestaan. Heeft jouw maatregel nog geen geschikt werkingsgebied, ontwikkel er dan een met iemand van Team GEO (teamgeo@pzh.nl)."
            >
                <FormFieldWerkingsgebiedKoppelingSingle
                    setWerkingsgebiedInParentState={handleChange}
                    werkingsgebiedInParentState={crudObject['Gebied']}
                    titelEnkelvoud={titelEnkelvoud}
                    fieldLabel="Selecteer werkingsgebied"
                    dataObjectProperty="Gebied"
                    pValue="Selecteer hier het werkingsgebied wat bij deze maatregel past."
                />
                <FormFieldRadioButton
                    options={['Indicatief', 'Exact']}
                    handleChange={handleChange}
                    fieldValue={crudObject['Gebied_Duiding']}
                    dataObjectProperty="Gebied_Duiding"
                    titelEnkelvoud={titelEnkelvoud}
                    label="Intentie van het werkingsgebied"
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Aanvullende informatie"
                beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument."
            >
                <FormFieldWeblink
                    handleChange={handleChange}
                    fieldValue={crudObject['Weblink']}
                    dataObjectProperty="Weblink"
                    fieldLabel="IDMS"
                    pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen → Algemeen → Snelkoppeling kopiëren)."
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
                        dataObjectProperty="Eind_Geldigheid"
                        fieldLabel="Uitwerkingtreding"
                        pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                        titelEnkelvoud={titelEnkelvoud}
                    />

                    <FormFieldTags
                        handleChange={handleChange}
                        dataObjectProperty="Tags"
                        fieldValue={crudObject['Tags']}
                        fieldLabel="Tags"
                        pValue="Om deze maatregel vindbaar te maken voor de raadplegers, vragen we je om tags toe te voegen. "
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
