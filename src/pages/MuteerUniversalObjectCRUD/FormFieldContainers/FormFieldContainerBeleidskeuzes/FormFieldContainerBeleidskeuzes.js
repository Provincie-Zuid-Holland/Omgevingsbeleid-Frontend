import React from "react"
import PropTypes from "prop-types"
import clonedeep from "lodash.clonedeep"

import ContainerFormSection from "../../../../components/ContainerFormSection"
import FormFieldTitelEnBeschrijving from "./../../../../components/FormFieldTitelEnBeschrijving"
import {
    FormFieldDate,
    FormFieldInputContainer,
    FormFieldTextInput,
    FormFieldTextArea,
    FormFieldWeblink,
    FormFieldSelectUserGroup,
    FormFieldRichTextEditor,
    FormFieldWerkingsgebied,
    FormFieldRelatieKoppeling,
} from "../../../../components/FormFieldsExport"

import UserContext from "../../../../App/UserContext"

function FormFieldContainerBeleidskeuzes({
    titleSingular,
    crudObject,
    handleChange,
    editStatus,
    voegKoppelingRelatieToe,
    wijzigKoppelingRelatie,
    verwijderKoppelingRelatie,
}) {
    // If the beleidskeuze is 'vigerend' we need to specify who can edit which fields
    const isVigerend = crudObject.Status === "Vigerend"

    const { user } = React.useContext(UserContext)
    const userUUID = user.UUID
    const userRol = user.Rol

    const userIsAllowed =
        userRol === "Beheerder" ||
        userRol === "Superuser" ||
        userRol === "Functioneel beheerder" ||
        userRol === "Behandelend Ambtenaar" ||
        userRol === "Technisch beheerder" ||
        userUUID === crudObject.Eigenaar_1 ||
        userUUID === crudObject.Eigenaar_2

    // The following fields should be editable when userIsAllowed true
    // - FormFieldSelectUserGroup (specific rules for each field, see FormFieldSelectUserGroup component)
    // - FormFieldRelatieKoppeling
    // The rest of the fields should be disabled if (isVigerend === true && !userIsAllowed)
    return (
        <React.Fragment>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel en de betrokken collega's."
            >
                <FormFieldTextInput
                    disabled={isVigerend}
                    handleChange={handleChange}
                    fieldValue={crudObject["Titel"]}
                    dataObjectProperty="Titel"
                    fieldLabel="Titel"
                    pValue="Formuleer in enkele woorden de titel van de beleidskeuze."
                    titleSingular={titleSingular}
                />
                <FormFieldSelectUserGroup
                    disabled={isVigerend && !userIsAllowed}
                    handleChange={handleChange}
                    crudObject={crudObject}
                    marginRight={true}
                    fieldLabel="Personen"
                    titleSingular={titleSingular}
                    editStatus={editStatus}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Beleidstekst"
                beschrijving="In deze sectie kun je alle tekst met betrekking tot de beleidskeuze kwijt. Een goede beleidstekst is kort, krachtig en actief opgeschreven. Zo weet de lezer direct welke keuze de provincie maakt en waarom dit van belang is. Schrijf altijd ‘de provincie’, en niet ‘wij’."
            >
                <FormFieldInputContainer>
                    <FormFieldTitelEnBeschrijving
                        fieldLabel="Wat wil de provincie bereiken?"
                        pValue="Hier geef je aan welke keuze de provincie heeft genomen. Formuleer in één of enkele zinnen wat de provincie wil bereiken en welke rechtsgevolgen dit eventueel heeft voor derden."
                    />
                    <FormFieldRichTextEditor
                        editorFormats={["image"]}
                        editorToolbar={["image"]}
                        titleSingular={titleSingular}
                        handleChange={handleChange}
                        fieldValue={crudObject["Omschrijving_Keuze"]}
                        dataObjectProperty="Omschrijving_Keuze"
                        disabled={isVigerend}
                    />
                </FormFieldInputContainer>

                <FormFieldInputContainer>
                    <FormFieldTitelEnBeschrijving
                        fieldLabel="Aanleiding"
                        pValue="De aanleiding geeft de lezer informatie over welke ontwikkelingen gaande zijn in de maatschappij en waarom de provincie hier op inspeelt. Beschrijf hier welk probleem, dreiging of kans ten grondslag ligt aan de beleidskeuze."
                    />
                    <FormFieldRichTextEditor
                        editorFormats={["image"]}
                        editorToolbar={["image"]}
                        titleSingular={titleSingular}
                        handleChange={handleChange}
                        fieldValue={crudObject["Aanleiding"]}
                        dataObjectProperty="Aanleiding"
                        disabled={isVigerend}
                    />
                </FormFieldInputContainer>

                <FormFieldInputContainer>
                    <FormFieldTitelEnBeschrijving
                        fieldLabel="Provinciaal belang"
                        pValue="Beschrijf waarom de provincie deze keuze maakt en waarom dit niet (enkel) kan worden overgelaten aan andere overheden. Vanuit juridisch perspectief is het belangrijk om het provinciaal belang te definiëren. Zie ook"
                        anchorText="artikel 2.3 van de Omgevingswet"
                        anchorLink="https://zoek.officielebekendmakingen.nl/stb-2016-156.html#d16e418"
                    />
                    <FormFieldRichTextEditor
                        editorFormats={["image"]}
                        editorToolbar={["image"]}
                        titleSingular={titleSingular}
                        handleChange={handleChange}
                        fieldValue={crudObject["Provinciaal_Belang"]}
                        dataObjectProperty="Provinciaal_Belang"
                        disabled={isVigerend}
                    />
                </FormFieldInputContainer>

                <FormFieldInputContainer>
                    <FormFieldTitelEnBeschrijving
                        fieldLabel="Toelichting"
                        pValue="Op welke thema’s, onderwerpen en gebieden gaat de beleidskeuze iets wijzigen, en waarom is dit gewenst? Beschrijf ook de relatie met andere beleidsterreinen."
                    />
                    <FormFieldRichTextEditor
                        editorFormats={["image"]}
                        editorToolbar={["image"]}
                        titleSingular={titleSingular}
                        handleChange={handleChange}
                        fieldValue={crudObject["Omschrijving_Werking"]}
                        dataObjectProperty="Omschrijving_Werking"
                        disabled={isVigerend}
                    />
                </FormFieldInputContainer>
            </ContainerFormSection>

            <ContainerFormSection
                titel="Nationaal beleid"
                beschrijving="Nationale doelstellingen kunnen de aanleiding vormen voor provinciaal beleid. Zo kan het Rijk wettelijke taken & bevoegdheden voor de provincie hebben vastgelegd of kan provinciaal beleid Nationale belangen uit de Nationale Omgevingsvisie (NOVI) dienen."
            >
                <FormFieldRelatieKoppeling
                    disabled={isVigerend}
                    placeholderTekst="Er is nog geen Nationaal belang of 'Wettelijke taken & bevoegdheden' gekoppeld."
                    buttonTekst="Nieuwe koppeling"
                    titelMainObject={crudObject["Titel"]}
                    handleChange={handleChange}
                    fieldValue={crudObject["Belangen"]}
                    fieldLabel="Wettelijke taken & bevoegdheden en nationale belangen"
                    dataObjectProperty="Belangen"
                    pValue="Indien deze beleidskeuze voortkomt uit een wettelijke taak of bevoegdheid of een nationaal belang dient, selecteer je dit hieronder."
                    titleSingular={titleSingular}
                    voegKoppelingRelatieToe={voegKoppelingRelatieToe}
                    wijzigKoppelingRelatie={wijzigKoppelingRelatie}
                    verwijderKoppelingRelatie={verwijderKoppelingRelatie}
                    connectionProperties={["belangen", "taken"]}
                    crudObject={clonedeep(crudObject)}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Werkingsgebied"
                beschrijving="Het werkingsgebied geeft het gebied weer waar de beleidskeuze betrekking op heeft. Binnen dit gebied worden bepaalde activiteiten gestimuleerd, ontwikkeld,  toegestaan of juist verboden."
            >
                <FormFieldWerkingsgebied
                    disabled={isVigerend}
                    setWerkingsgebiedInParentState={handleChange}
                    werkingsgebiedInParentState={crudObject["Werkingsgebieden"]}
                    titleSingular={titleSingular}
                    fieldLabel="Selecteer werkingsgebied"
                    dataObjectProperty="Werkingsgebieden"
                    pValue="Selecteer het werkingsgebied wat bij deze beleidskeuze van toepassing is. Heeft jouw beleidskeuze nog geen geschikt werkingsgebied, of moet het huidige gebied aangepast worden? Neem dan contact op via omgevingsbeleid@pzh.nl."
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Koppelingen"
                beschrijving="Integraal Omgevingsbeleid betekent dat deze beleidskeuze koppelingen met andere onderdelen van het provinciale beleid heeft. Zo wordt duidelijk welke delen beleid met elkaar te maken hebben of elkaar beïnvloeden."
            >
                <FormFieldRelatieKoppeling
                    disabled={isVigerend && !userIsAllowed}
                    placeholderTekst="Er zijn nog geen relaties aangebracht voor deze beleidskeuze"
                    buttonTekst="Nieuwe koppeling"
                    titelMainObject={crudObject["Titel"]}
                    handleChange={handleChange}
                    fieldValue={crudObject["Belangen"]}
                    fieldLabel="Koppelingen"
                    dataObjectProperty="Koppelingen"
                    pValue="Aan welke ambities, beleidsdoelen, artikelen uit de verordening, maatregelen en beleidsregels heeft deze beleidskeuze een koppeling?"
                    titleSingular={titleSingular}
                    voegKoppelingRelatieToe={voegKoppelingRelatieToe}
                    wijzigKoppelingRelatie={wijzigKoppelingRelatie}
                    verwijderKoppelingRelatie={verwijderKoppelingRelatie}
                    connectionProperties={[
                        "ambities",
                        "beleidsdoelen",
                        "themas",
                        "beleidsregels",
                        "beleidsprestaties",
                        "maatregelen",
                        "verordening",
                    ]}
                    crudObject={clonedeep(crudObject)}
                />
            </ContainerFormSection>

            <ContainerFormSection
                hide={
                    userRol !== "Beheerder" &&
                    userRol !== "Functioneel beheerder" &&
                    userRol !== "Technisch beheerder" &&
                    userRol !== "Superuser"
                }
                titel="Aanvullende informatie"
                beschrijving="In deze sectie vragen we aanvullende informatie die bij de beleidskeuze hoort."
            >
                <FormFieldWeblink
                    disabled={isVigerend}
                    handleChange={handleChange}
                    fieldValue={crudObject["Weblink"]}
                    dataObjectProperty="Weblink"
                    fieldLabel="IDMS"
                    pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                    titleSingular={titleSingular}
                />

                <FormFieldTextInput
                    disabled={isVigerend}
                    handleChange={handleChange}
                    fieldValue={crudObject["Besluitnummer"]}
                    fieldLabel="Besluitnummer"
                    dataObjectProperty="Besluitnummer"
                    notRequired={true}
                    pValue="Geef hier het PZH besluitnummer."
                    titleSingular={titleSingular}
                />

                <div className="flex flex-wrap -mx-3">
                    <FormFieldDate
                        disabled={isVigerend}
                        handleChange={handleChange}
                        fieldValue={crudObject["Begin_Geldigheid"]}
                        fieldLabel="Datum inwerkingtreding"
                        notRequired={true}
                        dataObjectProperty="Begin_Geldigheid"
                        pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                        titleSingular={titleSingular}
                    />
                    <FormFieldDate
                        disabled={isVigerend}
                        handleChange={handleChange}
                        notRequired={true}
                        fieldValue={crudObject["Eind_Geldigheid"]}
                        fieldLabel="Datum uitwerkingtreding"
                        dataObjectProperty="Eind_Geldigheid"
                        pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                        titleSingular={titleSingular}
                    />
                </div>
            </ContainerFormSection>
        </React.Fragment>
    )
}

FormFieldContainerBeleidskeuzes.propTypes = {
    titleSingular: PropTypes.string.isRequired,
    crudObject: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
}

FormFieldContainerBeleidskeuzes.defaultProps = {}

export default FormFieldContainerBeleidskeuzes
