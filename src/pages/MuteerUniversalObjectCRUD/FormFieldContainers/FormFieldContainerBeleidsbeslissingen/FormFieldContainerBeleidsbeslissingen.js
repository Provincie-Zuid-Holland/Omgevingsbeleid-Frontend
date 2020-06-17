import React, { Component } from 'react'
import PropTypes from 'prop-types'
import clonedeep from 'lodash.clonedeep'

import ContainerFormSection from './../../../../components/ContainerFormSection'
import {
    FormFieldDate,
    FormFieldTextInput,
    FormFieldTextArea,
    FormFieldWeblink,
    FormFieldSelectUserGroup,
    FormFieldUniverseleRelatieKoppeling,
    FormFieldWerkingsgebiedKoppeling,
} from './../../../../components/FormFieldsExport'

function FormFieldContainerBeleidsbeslissingen({
    titelEnkelvoud,
    crudObject,
    handleChange,
    editStatus,
    voegKoppelingRelatieToe,
    wijzigKoppelingRelatie,
    verwijderKoppelingRelatie,
}) {
    return (
        <React.Fragment>
            <ContainerFormSection
                titel="Algemene informatie"
                beschrijving="De algemene informatie bevat een duidelijke titel en de betrokken personen."
            >
                <FormFieldTextInput
                    handleChange={handleChange}
                    fieldValue={crudObject['Titel']}
                    dataObjectProperty="Titel"
                    fieldLabel="Titel"
                    pValue="Formuleer in enkele woorden de titel van de beleidsbeslissing."
                    titelEnkelvoud={titelEnkelvoud}
                />
                <FormFieldSelectUserGroup
                    handleChange={handleChange}
                    crudObject={crudObject}
                    marginRight={true}
                    fieldLabel="Personen"
                    titelEnkelvoud={titelEnkelvoud}
                    editStatus={editStatus}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Omschrijving beleidsbeslissing"
                beschrijving="Een beleidsbeslissing betreft een (politieke) beleidskeuze en heeft rechtsgevolgen voor derden."
            >
                <FormFieldTextArea
                    handleChange={handleChange}
                    fieldValue={crudObject['Omschrijving_Keuze']}
                    placeholderTekst="Wat wil de provincie bereiken?"
                    fieldLabel="Wat wil de provincie bereiken?"
                    dataObjectProperty="Omschrijving_Keuze"
                    pValue="Formuleer in één of enkele zinnen een concrete doelstelling op tactisch niveau. Beschrijf hier het 'wat' en vanuit welke rol."
                    titelEnkelvoud={titelEnkelvoud}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Omschrijving werking beleidsbeslissing"
                beschrijving="De werking van een beleidsbeslissing geeft aan in welke context en vanuit welke achtergrond de provincie hier beleid op voert."
            >
                <FormFieldTextArea
                    handleChange={handleChange}
                    fieldValue={crudObject['Omschrijving_Werking']}
                    fieldLabel="Werking"
                    dataObjectProperty="Omschrijving_Werking"
                    pValue="Wat is de werking van de beleidsbeslissing?"
                    titelEnkelvoud={titelEnkelvoud}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Motivering"
                beschrijving="De motivering is de reden waarom de provincie deze beleidskeuze maakt."
            >
                <FormFieldTextArea
                    handleChange={handleChange}
                    fieldValue={crudObject['Aanleiding']}
                    fieldLabel="Aanleiding"
                    dataObjectProperty="Aanleiding"
                    pValue="Wat was de aanleiding voor de beleidsbeslissing?"
                    titelEnkelvoud={titelEnkelvoud}
                />
                <FormFieldTextArea
                    handleChange={handleChange}
                    fieldValue={crudObject['Afweging']}
                    fieldLabel="Afwegingen"
                    dataObjectProperty="Afweging"
                    pValue="Welke afwegingen hebben tot deze beleidsbeslissing geleid?"
                    titelEnkelvoud={titelEnkelvoud}
                />
                <FormFieldTextArea
                    handleChange={handleChange}
                    fieldValue={crudObject['Provinciaal_Belang']}
                    fieldLabel="Provinciaal belang"
                    dataObjectProperty="Provinciaal_Belang"
                    pValue="Beschrijf en motiveer het provinciaal belang"
                    anchorText="(zie Artikel 2.3 van de Omgevingswet)"
                    anchorLink="https://zoek.officielebekendmakingen.nl/stb-2016-156.html#d16e418"
                    titelEnkelvoud={titelEnkelvoud}
                />
                <FormFieldUniverseleRelatieKoppeling
                    placeholderTekst="Er is nog geen Nationaal belang of 'Wettelijke taken & bevoegdheden' gekoppeld."
                    buttonTekst="Koppel belang of taak"
                    titelMainObject={crudObject['Titel']}
                    handleChange={handleChange}
                    fieldValue={crudObject['Belangen']}
                    fieldLabel="Nationaal Belang en Wettelijke taken & bevoegdheden"
                    dataObjectProperty="Belangen"
                    pValue="Indien deze beleidsbeslissing een nationaal belang dient of voortkomt uit een wettelijke taak of bevoegdheid, selecteer dit hieronder."
                    titelEnkelvoud={titelEnkelvoud}
                    wijzigKoppelingRelatie={wijzigKoppelingRelatie}
                    voegKoppelingRelatieToe={voegKoppelingRelatieToe}
                    verwijderKoppelingRelatie={verwijderKoppelingRelatie}
                    koppelingRelatieArray={['belangen', 'taken']}
                    crudObject={clonedeep(crudObject)}
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Werkingsgebied"
                beschrijving="Het werkingsgebied geeft het gebied weer waarin de beleidsbeslissing werking heeft. Het gebied waar binnen bepaalde activiteiten gestimuleerd worden, of toegestaan zijn. Maar ook het gebied waar binnen bepaalde activiteiten juist niet zijn toegestaan. Heeft jouw beleidsbeslissing nog geen geschikt werkingsgebied, ontwikkel er dan een met iemand van Team GEO."
            >
                <FormFieldWerkingsgebiedKoppeling
                    handleChange={handleChange}
                    titelEnkelvoud={titelEnkelvoud}
                    fieldValue={crudObject['WerkingsGebieden']}
                    fieldLabel="Selecteer werkingsgebied"
                    dataObjectProperty="WerkingsGebieden"
                    pValue="Selecteer hier het werkingsgebied wat bij deze beleidsbeslissing past."
                />
            </ContainerFormSection>

            <ContainerFormSection
                titel="Koppelingen"
                beschrijving="Integraal Omgevingsbeleid betekent dat deze beleidsbeslissing koppelingen met andere onderdelen van het provinciale beleid heeft. Koppelingen leg je, eenzijdig, met andere beleidsobjecten, zoals een artikel uit de verordening of een ambitie."
            >
                <FormFieldUniverseleRelatieKoppeling
                    placeholderTekst="Er zijn nog geen relaties aangebracht voor deze beleidsbeslissing"
                    buttonTekst="Nieuwe koppeling"
                    titelMainObject={crudObject['Titel']}
                    handleChange={handleChange}
                    fieldValue={crudObject['Belangen']}
                    fieldLabel="Koppelingen"
                    dataObjectProperty="Koppelingen"
                    pValue="Aan welke ambities, opgaven, artikelen uit de verordening, maatregelen en beleidsregels heeft deze beleidsbeslissing een koppeling?"
                    titelEnkelvoud={titelEnkelvoud}
                    voegKoppelingRelatieToe={voegKoppelingRelatieToe}
                    wijzigKoppelingRelatie={wijzigKoppelingRelatie}
                    verwijderKoppelingRelatie={verwijderKoppelingRelatie}
                    koppelingRelatieArray={[
                        'ambities',
                        'opgaven',
                        'themas',
                        'beleidsregels',
                        'doelen',
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
                    handleChange={handleChange}
                    fieldValue={crudObject['Weblink']}
                    dataObjectProperty="Weblink"
                    fieldLabel="IDMS"
                    pValue="Vul hier de link in naar het besluitdocument op IDMS. (Eigenschappen > Algemeen > Snelkoppeling kopiëren)."
                    titelEnkelvoud={titelEnkelvoud}
                />

                <FormFieldTextInput
                    handleChange={handleChange}
                    fieldValue={crudObject['Besluitnummer']}
                    fieldLabel="Besluitnummer"
                    dataObjectProperty="Besluitnummer"
                    notRequired={true}
                    pValue="Geef hier het PZH besluitnummer."
                    titelEnkelvoud={titelEnkelvoud}
                />

                <div className="flex flex-wrap -mx-3">
                    <FormFieldDate
                        handleChange={handleChange}
                        fieldValue={crudObject['Begin_Geldigheid']}
                        fieldLabel="Datum inwerkingtreding"
                        notRequired={true}
                        dataObjectProperty="Begin_Geldigheid"
                        pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                        titelEnkelvoud={titelEnkelvoud}
                    />
                    <FormFieldDate
                        handleChange={handleChange}
                        notRequired={true}
                        fieldValue={crudObject['Eind_Geldigheid']}
                        fieldLabel="Datum uitwerkingtreding"
                        dataObjectProperty="Eind_Geldigheid"
                        pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                        titelEnkelvoud={titelEnkelvoud}
                    />
                </div>
            </ContainerFormSection>
        </React.Fragment>
    )
}

FormFieldContainerBeleidsbeslissingen.propTypes = {
    titelEnkelvoud: PropTypes.string.isRequired,
    crudObject: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
}

FormFieldContainerBeleidsbeslissingen.defaultProps = {}

export default FormFieldContainerBeleidsbeslissingen
