import React from 'react'
import PropTypes from 'prop-types'

import ContainerFormSection from './../../../../components/ContainerFormSection'
import FormFieldTitelEnBeschrijving from './../../../../components/FormFieldTitelEnBeschrijving'
import {
    FormFieldDate,
    FormFieldTextInput,
    FormFieldWeblink,
    FormFieldWerkingsgebiedKoppeling,
    FormFieldRadioButton,
    FormFieldRichTextEditor,
    FormFieldInputContainer,
    FormFieldSelectUserGroup,
} from './../../../../components/FormFieldsExport'

import UserContext from './../../../../App/UserContext'

const initialValueToelichting = `<h2><b>Rolkeuze</b></h2><p><br><br></p><h2><b>Uitvoering</b></h2><p><br><br></p>`

function FormFieldContainerMaatregelen({
    titleSingular,
    crudObject,
    handleChange,
}) {
    const { user } = React.useContext(UserContext)

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
                    titleSingular={titleSingular}
                />
                <FormFieldSelectUserGroup
                    handleChange={handleChange}
                    crudObject={crudObject}
                    marginRight={true}
                    fieldLabel="Personen"
                    titleSingular={titleSingular}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Omschrijving maatregel"
                beschrijving="Een maatregel beschrijft de wijze waarop uitvoering wordt gegeven aan beleid."
            >
                <FormFieldInputContainer>
                    <FormFieldTitelEnBeschrijving
                        fieldLabel={'Omschrijving'}
                        pValue={
                            "Formuleer in één of enkele zinnen een concrete doelstelling op tactisch niveau. Beschrijf hier het 'wat' en vanuit welke rol."
                        }
                    />
                    <FormFieldRichTextEditor
                        titleSingular={titleSingular}
                        initialValue={initialValueToelichting}
                        handleChange={handleChange}
                        fieldValue={crudObject['Toelichting']}
                        dataObjectProperty="Toelichting"
                        placeholder="Schrijf hier uw omschrijving..."
                    />
                </FormFieldInputContainer>
            </ContainerFormSection>

            <ContainerFormSection
                titel="Werkingsgebied"
                beschrijving="Het werkingsgebied geeft het gebied weer waarin de maatregel werking heeft. Het gebied waar binnen bepaalde activiteiten gestimuleerd worden, of toegestaan zijn. Maar ook het gebied waar binnen bepaalde activiteiten juist niet zijn toegestaan. Heeft jouw maatregel nog geen geschikt werkingsgebied, ontwikkel er dan een met iemand van Team GEO (teamgeo@pzh.nl)."
            >
                <FormFieldWerkingsgebiedKoppeling
                    setWerkingsgebiedInParentState={handleChange}
                    werkingsgebiedInParentState={crudObject['Gebied']}
                    crudObject={crudObject}
                    titleSingular={titleSingular}
                    fieldLabel="Selecteer werkingsgebied"
                    dataObjectProperty="Gebied"
                    pValue="Selecteer hier het werkingsgebied wat bij deze maatregel past."
                />
                <FormFieldRadioButton
                    options={['Indicatief', 'Exact']}
                    handleChange={handleChange}
                    fieldValue={crudObject['Gebied_Duiding']}
                    dataObjectProperty="Gebied_Duiding"
                    titleSingular={titleSingular}
                    label="Intentie van het werkingsgebied"
                />
            </ContainerFormSection>

            {user && user.Rol === 'Beheerder' ? (
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
                        titleSingular={titleSingular}
                    />

                    <div className="flex flex-wrap -mx-3">
                        <FormFieldDate
                            handleChange={handleChange}
                            fieldValue={crudObject['Begin_Geldigheid']}
                            fieldLabel="Inwerkingtreding"
                            dataObjectProperty="Begin_Geldigheid"
                            pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                            titleSingular={titleSingular}
                        />

                        <FormFieldDate
                            openUitwerkingstrede={true}
                            handleChange={handleChange}
                            fieldValue={crudObject['Eind_Geldigheid']}
                            dataObjectProperty="Eind_Geldigheid"
                            fieldLabel="Uitwerkingtreding"
                            pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                            titleSingular={titleSingular}
                        />
                    </div>
                </ContainerFormSection>
            ) : null}
        </React.Fragment>
    )
}

FormFieldContainerMaatregelen.propTypes = {
    titleSingular: PropTypes.string,
    crudObject: PropTypes.object,
    handleChange: PropTypes.func,
}

FormFieldContainerMaatregelen.defaultProps = {}

export default FormFieldContainerMaatregelen
