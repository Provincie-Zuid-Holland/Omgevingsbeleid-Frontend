import React from 'react'
import PropTypes from 'prop-types'
import clonedeep from 'lodash.clonedeep'

import ContainerFormSection from '../../../../components/ContainerFormSection'
import {
    FormFieldDate,
    FormFieldTextInput,
    FormFieldTextArea,
    FormFieldWeblink,
    FormFieldSelectUserGroup,
    FormFieldWerkingsgebiedKoppeling,
    FormFieldRelatieKoppeling,
} from '../../../../components/FormFieldsExport'

import UserContext from '../../../../App/UserContext'

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
    const isVigerend = crudObject.Status === 'Vigerend'

    const { user } = React.useContext(UserContext)
    const userUUID = user.UUID
    const userRol = user.Rol

    const userIsAllowed =
        userRol === 'Beheerder' ||
        userRol === 'Superuser' ||
        userRol === 'Functioneel beheerder' ||
        userRol === 'Behandelend Ambtenaar' ||
        userRol === 'Technisch Beheerder' ||
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
                beschrijving="De algemene informatie bevat een duidelijke titel en de betrokken personen."
            >
                <FormFieldTextInput
                    disabled={isVigerend}
                    handleChange={handleChange}
                    fieldValue={crudObject['Titel']}
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
                titel="Omschrijving beleidskeuze"
                beschrijving="Een beleidskeuze betreft een (politieke) beleidskeuze en heeft rechtsgevolgen voor derden."
            >
                <FormFieldTextArea
                    disabled={isVigerend}
                    handleChange={handleChange}
                    fieldValue={crudObject['Omschrijving_Keuze']}
                    placeholderTekst="Wat wil de provincie bereiken?"
                    fieldLabel="Wat wil de provincie bereiken?"
                    dataObjectProperty="Omschrijving_Keuze"
                    pValue="Formuleer in één of enkele zinnen een concrete doelstelling op tactisch niveau. Beschrijf hier het 'wat' en vanuit welke rol."
                    titleSingular={titleSingular}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Toelichting Beleidskeuze"
                beschrijving="Geef verdere inhoudelijke motivering van de beleidskeuze. Licht daarnaast conflicterende relaties met andere beleidskeuzes toe en beschrijf hoe hiermee wordt omgegaan."
            >
                <FormFieldTextArea
                    disabled={isVigerend}
                    handleChange={handleChange}
                    fieldValue={crudObject['Omschrijving_Werking']}
                    fieldLabel="Toelichting"
                    dataObjectProperty="Omschrijving_Werking"
                    pValue="Verdere inhoudelijke motivering en de conflicterende relaties"
                    titleSingular={titleSingular}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Motivering"
                beschrijving="De motivering is de reden waarom de provincie deze beleidskeuze maakt."
            >
                <FormFieldTextArea
                    disabled={isVigerend}
                    handleChange={handleChange}
                    fieldValue={crudObject['Aanleiding']}
                    fieldLabel="Aanleiding"
                    dataObjectProperty="Aanleiding"
                    pValue="Wat was de aanleiding voor de beleidskeuze?"
                    titleSingular={titleSingular}
                />
                <FormFieldTextArea
                    disabled={isVigerend}
                    handleChange={handleChange}
                    fieldValue={crudObject['Provinciaal_Belang']}
                    fieldLabel="Provinciaal belang"
                    dataObjectProperty="Provinciaal_Belang"
                    pValue="Beschrijf en motiveer het provinciaal belang"
                    anchorText="(zie Artikel 2.3 van de Omgevingswet)"
                    anchorLink="https://zoek.officielebekendmakingen.nl/stb-2016-156.html#d16e418"
                    titleSingular={titleSingular}
                />
                <FormFieldRelatieKoppeling
                    disabled={isVigerend}
                    placeholderTekst="Er is nog geen Nationaal belang of 'Wettelijke taken & bevoegdheden' gekoppeld."
                    buttonTekst="Koppel belang of taak"
                    titelMainObject={crudObject['Titel']}
                    handleChange={handleChange}
                    fieldValue={crudObject['Belangen']}
                    fieldLabel="Nationaal Belang en Wettelijke taken & bevoegdheden"
                    dataObjectProperty="Belangen"
                    pValue="Indien deze beleidskeuze een nationaal belang dient of voortkomt uit een wettelijke taak of bevoegdheid, selecteer dit hieronder."
                    titleSingular={titleSingular}
                    voegKoppelingRelatieToe={voegKoppelingRelatieToe}
                    wijzigKoppelingRelatie={wijzigKoppelingRelatie}
                    verwijderKoppelingRelatie={verwijderKoppelingRelatie}
                    connectionProperties={['belangen', 'taken']}
                    crudObject={clonedeep(crudObject)}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Werkingsgebied"
                beschrijving="Het werkingsgebied geeft het gebied weer waarin de beleidskeuze werking heeft. Het gebied waar binnen bepaalde activiteiten gestimuleerd worden, of toegestaan zijn. Maar ook het gebied waar binnen bepaalde activiteiten juist niet zijn toegestaan. Heeft jouw beleidskeuze nog geen geschikt werkingsgebied, ontwikkel er dan een met iemand van Team GEO."
            >
                <FormFieldWerkingsgebiedKoppeling
                    disabled={isVigerend}
                    setWerkingsgebiedInParentState={handleChange}
                    werkingsgebiedInParentState={crudObject['Werkingsgebieden']}
                    titleSingular={titleSingular}
                    fieldLabel="Selecteer werkingsgebied"
                    dataObjectProperty="Werkingsgebieden"
                    pValue="Selecteer hier het werkingsgebied wat bij deze beleidskeuze past."
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Koppelingen"
                beschrijving="Integraal Omgevingsbeleid betekent dat deze beleidskeuze koppelingen met andere onderdelen van het provinciale beleid heeft. Koppelingen leg je, eenzijdig, met andere beleidsobjecten, zoals een artikel uit de verordening of een ambitie."
            >
                <FormFieldRelatieKoppeling
                    disabled={isVigerend && !userIsAllowed}
                    placeholderTekst="Er zijn nog geen relaties aangebracht voor deze beleidskeuze"
                    buttonTekst="Nieuwe koppeling"
                    titelMainObject={crudObject['Titel']}
                    handleChange={handleChange}
                    fieldValue={crudObject['Belangen']}
                    fieldLabel="Koppelingen"
                    dataObjectProperty="Koppelingen"
                    pValue="Aan welke ambities, beleidsdoelen, artikelen uit de verordening, maatregelen en beleidsregels heeft deze beleidskeuze een koppeling?"
                    titleSingular={titleSingular}
                    voegKoppelingRelatieToe={voegKoppelingRelatieToe}
                    wijzigKoppelingRelatie={wijzigKoppelingRelatie}
                    verwijderKoppelingRelatie={verwijderKoppelingRelatie}
                    connectionProperties={[
                        'ambities',
                        'beleidsdoelen',
                        'themas',
                        'beleidsregels',
                        'beleidsprestaties',
                        'maatregelen',
                        'verordening',
                    ]}
                    crudObject={clonedeep(crudObject)}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Aanvullende informatie"
                beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en het besluitnummer."
            >
                <FormFieldWeblink
                    disabled={isVigerend}
                    handleChange={handleChange}
                    fieldValue={crudObject['Weblink']}
                    dataObjectProperty="Weblink"
                    fieldLabel="IDMS"
                    pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                    titleSingular={titleSingular}
                />

                <FormFieldTextInput
                    disabled={isVigerend}
                    handleChange={handleChange}
                    fieldValue={crudObject['Besluitnummer']}
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
                        fieldValue={crudObject['Begin_Geldigheid']}
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
                        fieldValue={crudObject['Eind_Geldigheid']}
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
