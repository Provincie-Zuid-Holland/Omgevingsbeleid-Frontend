import React from 'react';

// Import Context
import APIcontext from './../APIContext'

// Import Components
import ButtonBackToPage from './../../../components/ButtonBackToPage'
import ContainerFormSection from './../../../components/ContainerFormSection'
import FormFieldTextInput from './../../../components/FormFieldTextInput'
import FormFieldTextArea from './../../../components/FormFieldTextArea'
import FormFieldTextEditor from './../../../components/FormFieldTextEditor'
import FormFieldWeblink from './../../../components/FormFieldWeblink'
import FormFieldDate from './../../../components/FormFieldDate'
import FormFieldSelect from './../../../components/FormFieldSelect'
import FormFieldBeleidsrelatie  from './../../../components/FormFieldBeleidsrelatie'
import FormFieldWerkingsgebiedrelatie from './../../../components/FormFieldWerkingsgebiedrelatie'
import FormFieldWerkingsgebiedKoppeling from './../../../components/FormFieldWerkingsgebiedKoppeling'
import FormFieldSelectUser from './../../../components/FormFieldSelectUser'
import FormFieldUniverseleRelatieKoppeling from './../../../components/FormFieldUniverseleRelatieKoppeling'



class ContainerCrudFields extends React.Component {

    render() {

        const crudObject = this.context.crudObject
        const titelEnkelvoud = this.context.titelEnkelvoud
        const titelMeervoud = this.context.titelMeervoud

        const statusArrayValues = [
            ["Open", "Open"],
            ["Akkoord", "Akkoord"],
            ["NietAkkoord", "Niet Akkoord"]
        ]

        const verplichtProgrammaValues = [
            ["Ja", "Ja"],
            ["Nee", "Nee"]
        ]

        const SpecifiekOfGeneriekValues = [
            ["Gebiedsspecifiek", "Gebiedsspecifiek"],
            ["Generiek", "Generiek"]
        ]

        const VerordeningTypeValues = [
            ["Hoofdstuk", "Hoofdstuk"],
            ["Afdeling", "Afdeling"],
            ["Paragraaf", "Paragraaf"],
            ["Artikel", "Artikel"]
        ]

        let mainTitle = ''

        if (this.context.editStatus && titelEnkelvoud.toLowerCase() !== 'beleidsregel') {
            mainTitle = `Wijzig een ${titelEnkelvoud.toLowerCase()}`
        } else if (!this.context.editStatus && titelEnkelvoud.toLowerCase() !== 'beleidsregel') {
            mainTitle = `Voeg een nieuwe ${titelEnkelvoud.toLowerCase()} toe`
        } else if (this.context.editStatus && titelEnkelvoud.toLowerCase() === 'beleidsregel') {
            mainTitle = `Beheer ${titelEnkelvoud.toLowerCase()}`
        } else if (!this.context.editStatus && titelEnkelvoud.toLowerCase() === 'beleidsregel') {
            mainTitle = `Voeg een nieuwe ${titelEnkelvoud.toLowerCase()} toe`
        }

        return (
        
            <React.Fragment>

                <div className="w-full py-32 px-6 mbg-color edit-header relative">
                    <div className="container mx-auto flex justify-center items-center">
                        <div className="w-full pr-20">
                            { this.context.editStatus === false ? 
                                <ButtonBackToPage terugNaar={titelMeervoud.toLowerCase()} color="text-white" url={`/api-test/${this.context.overzichtSlug}`} /> 
                                : 
                                <ButtonBackToPage terugNaar={titelEnkelvoud.toLowerCase()} color="text-white" url={`/api-test/${this.context.overzichtSlug}/${this.context.objectID}`} />  
                            }
                            <h1 className="heading-serif-4xl text-white">
                                {mainTitle}
                            </h1>
                        </div>
                    </div>
                </div>
                
                <div className="container mx-auto flex px-6 pb-8">      
                
                    <div className="w-full inline-block flex-grow">
                        <div>
                            <form className="mt-12" onSubmit={this.context.handleSubmit}>
                                

                                { crudObject["Titel"] !== undefined || 
                                    crudObject["Opdrachtgever"] !== undefined ||
                                    crudObject["Portefeuillehouder"] !== undefined ||
                                    crudObject["Eigenaar_1"] !== undefined  ||
                                    crudObject["Eigenaar_2"] !== undefined ? 
                                    
                                    <ContainerFormSection
                                        titel="Algemene informatie"
                                        beschrijving="De algemene informatie bevat een duidelijke titel en de betrokken personen."
                                    >
                                        { crudObject["Titel"] !== undefined ? 
                                            <FormFieldTextInput 
                                                handleChange={this.context.handleChange}
                                                fieldValue={crudObject["Titel"]}
                                                dataObjectProperty="Titel"
                                                fieldLabel="Titel"
                                                pValue="Formuleer in enkele woorden de titel van de"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        : null }
                                        
                                        { crudObject["Opdrachtgever"] !== undefined ||
                                        crudObject["Portefeuillehouder_1"] !== undefined ||
                                        crudObject["Portefeuillehouder_2"] !== undefined  ||
                                        crudObject["Eigenaar_1"] !== undefined  ||
                                        crudObject["Eigenaar_2"] !== undefined  ? 
                                        <React.Fragment>

                                            <span
                                                className="form-field-label"
                                            >
                                                Personen
                                            </span>

                                            <div className="w-1/2 flex">

                                                { crudObject["Opdrachtgever"] !== undefined ? 
                                                <FormFieldSelectUser 
                                                    halfWidth={true}
                                                    handleChange={this.context.handleChange}
                                                    fieldValue={crudObject["Opdrachtgever"]}
                                                    dataObjectProperty="Opdrachtgever"
                                                    // fieldLabel="Titel"
                                                    pValue="Opdrachtgever"
                                                    titelEnkelvoud={titelEnkelvoud}
                                                /> : null } 
                                            
                                            </div>

                                            <div className="flex">

                                                { crudObject["Eigenaar_1"] !== undefined ? 
                                                <FormFieldSelectUser 
                                                    handleChange={this.context.handleChange}
                                                    fieldValue={crudObject["Eigenaar_1"]}
                                                    dataObjectProperty="Eigenaar_1"
                                                    marginRight={true}
                                                    // fieldLabel="Titel"
                                                    pValue="Eerste eigenaar"
                                                    titelEnkelvoud={titelEnkelvoud}
                                                /> : null } 

                                                { crudObject["Eigenaar_2"] !== undefined ? 
                                                <FormFieldSelectUser 
                                                    handleChange={this.context.handleChange}
                                                    fieldValue={crudObject["Eigenaar_2"]}
                                                    dataObjectProperty="Eigenaar_2"
                                                    // fieldLabel="Titel"
                                                    pValue="Tweede eigenaar"
                                                    titelEnkelvoud={titelEnkelvoud}
                                                /> : null } 
                                            
                                            </div>
                                            
                                            <div className="flex">

                                                { crudObject["Portefeuillehouder_1"] !== undefined ? 
                                                <FormFieldSelectUser 
                                                    handleChange={this.context.handleChange}
                                                    fieldValue={crudObject["Portefeuillehouder_1"]}
                                                    dataObjectProperty="Portefeuillehouder_1"
                                                    marginRight={true}
                                                    // fieldLabel="Titel"
                                                    pValue="Eerste portefeuillehouder"
                                                    titelEnkelvoud={titelEnkelvoud}
                                                /> : null }

                                                { crudObject["Portefeuillehouder_2"] !== undefined ? 
                                                <FormFieldSelectUser 
                                                    handleChange={this.context.handleChange}
                                                    fieldValue={crudObject["Portefeuillehouder_2"]}
                                                    dataObjectProperty="Portefeuillehouder_2"
                                                    // fieldLabel="Titel"
                                                    pValue="Tweede portefeuillehouder"
                                                    titelEnkelvoud={titelEnkelvoud}
                                                /> : null }

                                            </div>

                                        </React.Fragment>
                                        : null }

                                    </ContainerFormSection>
                                : null }

                                
                                { crudObject["Omschrijving_Keuze"] !== undefined ? 
                                
                                    <ContainerFormSection
                                        titel="Omschrijving beleidsbeslissing"
                                        beschrijving="Een beleidsbeslissing betreft een (politieke) beleidskeuze en heeft rechtsgevolgen voor derden."
                                    >
                                        { crudObject["Omschrijving_Keuze"] !== undefined ? 
                                            <FormFieldTextArea 
                                                handleChange={this.context.handleChange}
                                                fieldValue={crudObject["Omschrijving_Keuze"]}
                                                fieldLabel="Wat wil de provincie bereiken?"
                                                dataObjectProperty="Omschrijving_Keuze"
                                                pValue="Formuleer in één of enkele zinnen een concrete doelstelling op tactisch niveau. Beschrijf hier het 'wat' en vanuit welke rol."
                                                titelEnkelvoud={titelEnkelvoud}
                                                hideObjectLabel={true}
                                            />
                                        : null }

                                    </ContainerFormSection>
                                    
                                : null }
                               
                                { crudObject["Omschrijving_Werking"] !== undefined ? 
                                
                                    <ContainerFormSection
                                        titel="Omschrijving werking beleidsbeslissing"
                                        beschrijving="De werking van een beleidsbeslissing geeft aan in welke context en vanuit welke achtergrond de provincie hier beleid op voert."
                                    >
                                        { crudObject["Omschrijving_Keuze"] !== undefined ? 
                                            <FormFieldTextArea 
                                                handleChange={this.context.handleChange}
                                                fieldValue={crudObject["Omschrijving_Werking"]}
                                                fieldLabel="Werking"
                                                dataObjectProperty="Omschrijving_Werking"
                                                pValue="Wat is de werking van de beleidsbeslissing?"
                                                titelEnkelvoud={titelEnkelvoud}
                                                hideObjectLabel={true}
                                            />
                                        : null }

                                    </ContainerFormSection>
                                    
                                : null }



                                { crudObject["Omschrijving"] !== undefined ? 
                                
                                    <ContainerFormSection
                                        titel="Toelichting"
                                        beschrijving="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                                    >
                                        { crudObject["Omschrijving"] !== undefined ? 
                                            <FormFieldTextArea 
                                                handleChange={this.context.handleChange}
                                                fieldValue={crudObject["Omschrijving"]}
                                                fieldLabel="Omschrijving"
                                                dataObjectProperty="Omschrijving"
                                                pValue="Geef een korte omschrijving van deze"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        : null }
                                    </ContainerFormSection>
                                    
                                : null }


                                { crudObject["Motivering"] !== undefined ? 
                                    
                                    <ContainerFormSection
                                        titel="Toelichting"
                                        beschrijving="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                                    >
                                        { crudObject["Motivering"] !== undefined ?
                                            <FormFieldTextEditor
                                                handleChange={this.context.setEditorState}
                                                fieldValue={crudObject["Motivering"]}
                                                fieldLabel="Omschrijving"
                                                dataObjectProperty="Motivering"
                                                pValue="Geef een korte omschrijving van de werking van de"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        : null }
                                    </ContainerFormSection>
                                    
                                : null }
                                

                                {/* Momenteel is er nog geen goed data model voor beleidsbeslissingen dus deze worden er voor nu altijd ingezet
                                { crudObject !== undefined ? 
                                    
                                    <ContainerFormSection
                                        titel="Belang & Motivering"
                                        beschrijving="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                                    >
                                        { crudObject !== undefined ? 
                                            <FormFieldSelectBelang
                                                handleChange={this.context.handleChange}
                                                fieldValue={crudObject["Belang"]}
                                                fieldLabel="Belang"
                                                dataObjectProperty="Belang"
                                                pValue="Selecteer de belangen die deze beleidsbeslissing heeft"
                                                // titelEnkelvoud={titelEnkelvoud}
                                                hideObjectLabel={true}
                                                titelEnkelvoud={"belang"}
                                            />
                                        : null }
                                        { crudObject !== undefined ? 
                                            <FormFieldTextArea 
                                                handleChange={this.context.handleChange}
                                                fieldValue={crudObject["Belang_Motivering"]}
                                                fieldLabel="Motivering"
                                                dataObjectProperty="Belang_Motivering"
                                                pValue="Motiveer het belang"
                                                hideObjectLabel={true}
                                                // titelEnkelvoud={titelEnkelvoud}
                                                titelEnkelvoud={"motivering"}
                                            />
                                        : null }
                                    </ContainerFormSection>
                                    
                                : null }
                                 */}

                                { crudObject["Aanleiding"] !== undefined || 
                                crudObject["Afweging"] !== undefined ||
                                crudObject["Provinciaal_Belang"] !== undefined || 
                                crudObject["Belangen"] !== undefined ?
                                    
                                    <ContainerFormSection
                                        titel="Motivering"
                                        beschrijving="De motivering is de reden waarom de provincie deze beleidskeuze maakt."
                                    >
                                        { crudObject["Aanleiding"] !== undefined ? 
                                            <FormFieldTextArea 
                                                handleChange={this.context.handleChange}
                                                fieldValue={crudObject["Aanleiding"]}
                                                fieldLabel="Aanleiding"
                                                hideObjectLabel={true}
                                                dataObjectProperty="Aanleiding"
                                                pValue="Wat was de aanleiding voor de beleidsbeslissing?"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        : null }
                                        { crudObject["Afweging"] !== undefined ? 
                                            <FormFieldTextArea 
                                                handleChange={this.context.handleChange}
                                                fieldValue={crudObject["Afweging"]}
                                                fieldLabel="Afweging"
                                                hideObjectLabel={true}
                                                dataObjectProperty="Afweging"
                                                pValue="Welke afwegingen hebben tot deze beleidsbeslissing geleid?"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        : null }
                                        { crudObject["Provinciaal_Belang"] !== undefined ? 
                                            <FormFieldTextArea 
                                                handleChange={this.context.handleChange}
                                                fieldValue={crudObject["Provinciaal_Belang"]}
                                                fieldLabel="Provinciaal belang"
                                                hideObjectLabel={true}
                                                dataObjectProperty="Provinciaal_Belang"
                                                pValue="Beschrijf en motiveer het provinciaal belang (zie Artikel 2.3 van de Omgevingswet) TOOLTIP"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        : null }
                                        { crudObject["Belangen"] !== undefined ? 
                                            <FormFieldUniverseleRelatieKoppeling 
                                            placeholderTekst="Er is nog geen Nationaal belang of 'Wettelijke taken & bevoegdheden' gekoppeld."
                                            buttonTekst="Koppel belang of taak"
                                            titelMainObject={crudObject["Titel"]}
                                            handleChange={this.context.handleChange}
                                            fieldValue={crudObject["Belangen"]}
                                            fieldLabel="Nationaal Belang en Wettelijke taken & bevoegdheden"
                                            hideObjectLabel={true}
                                            dataObjectProperty="Belangen"
                                            pValue="Indien deze beleidsbeslissing een nationaal belang dient of voortkomt uit een wettelijke taak of bevoegdheid, selecteer dit hieronder."
                                            titelEnkelvoud={titelEnkelvoud}
                                            voegKoppelingRelatieToe={this.context.voegKoppelingRelatieToe}
                                            koppelingRelatieArray={['belangen', 'taken']}
                                            crudObject={crudObject}
                                            />
                                        : null }
                                    </ContainerFormSection>
                                    
                                : null }
                                
                                { crudObject["WerkingsGebieden"] !== undefined ? 
                                    
                                    <ContainerFormSection
                                        titel="Werkingsgebied"
                                        beschrijving="Het werkingsgebied geeft het gebied weer waarin de beleidsbeslissing werking heeft. Het gebied waar binnen bepaalde activiteiten gestimuleerd worden, of toegestaan zijn. Maar ook het gebied waar binnen bepaalde activiteiten juist niet zijn toegestaan. Heeft jouw beleidsbeslissing nog geen geschikt werkingsgebied, ontwikkel er dan een met iemand van Team GEO."
                                    >
                                        { crudObject["WerkingsGebieden"] !== undefined ? 
                                            <FormFieldWerkingsgebiedKoppeling
                                                handleChange={this.context.handleChange}
                                                fieldValue={crudObject["WerkingsGebieden"]}
                                                fieldLabel="WerkingsGebied"
                                                dataObjectProperty="WerkingsGebieden"
                                                pValue="Selecteer het werkingsgebied wat bij deze beleidsbeslissing past"
                                                hideObjectLabel={true}
                                            />
                                        : null }
                                    </ContainerFormSection>
                                    
                                : null }
                                
                                { 
                                crudObject["Ambities"] !== undefined || 
                                crudObject["Themas"] !== undefined || 
                                crudObject["Doelen"] !== undefined ||
                                crudObject["Maatregelen"] !== undefined || 
                                crudObject["Doelen"] !== undefined ||
                                crudObject["Themas"] !== undefined ||
                                crudObject["Verordening"] !== undefined ||
                                crudObject["BeleidsRegels"] !== undefined ?
                                    
                                    <ContainerFormSection
                                        titel="Koppelingen en relaties"
                                        beschrijving="Integraal Omgevingsbeleid betekent dat deze beleidsbeslissing relaties en koppelingen met andere onderdelen van het provinciale beleid heeft. Een relatie ga je, met wederzijds goedkeuren, aan met andere beleidsbeslissingen. Koppelingen leg je, eenzijdig, met andere beleidsobjecten, zoals een artikel uit de verordening of een ambitie."
                                    >
                                            <FormFieldUniverseleRelatieKoppeling 
                                            placeholderTekst="Er zijn nog geen relaties aangebracht voor deze beleidsbeslissing"
                                            buttonTekst="Nieuwe koppeling"
                                            titelMainObject={crudObject["Titel"]}
                                            handleChange={this.context.handleChange}
                                            fieldValue={crudObject["Belangen"]}
                                            fieldLabel="Koppelingen"
                                            hideObjectLabel={true}
                                            dataObjectProperty="Belangen"
                                            pValue="Aan welke ambities, opgaven, artikelen uit de verordening, maatregelen en nadere beleidsregels heeft deze beleidsbeslissing een koppeling?"
                                            titelEnkelvoud={titelEnkelvoud}
                                            voegKoppelingRelatieToe={this.context.voegKoppelingRelatieToe}
                                            koppelingRelatieArray={[
                                                'ambities', 
                                                'themas',
                                                'doelen',
                                                'maatregelen',
                                                'verordening'
                                            ]}
                                            crudObject={crudObject}
                                            />
                                    </ContainerFormSection>
                                    
                                : null }

                                { 
                                    crudObject["Motivering"] !== undefined
                                    ||
                                    crudObject["Beleids_Document"] !== undefined
                                    ||
                                    crudObject["Gebied"] !== undefined
                                    ||
                                    crudObject["Verplicht_Programma"] !== undefined
                                    ||
                                    crudObject["Specifiek_Of_Generiek"] !== undefined
                                    ||
                                    crudObject["Weblink"] !== undefined
                                    ||
                                    crudObject["Aanvraag_Datum"] !== undefined
                                    ||
                                    crudObject["Datum_Akkoord"] !== undefined
                                    ||
                                    crudObject["Begin_Geldigheid"] !== undefined
                                    ||
                                    crudObject["Eind_Geldigheid"] !== undefined
                                    ||
                                    crudObject["Van_Beleidsbeslissing"] !== undefined
                                    ||
                                    crudObject["Naar_Beleidsbeslissing"] !== undefined
                                    ||
                                    crudObject["Status"] !== undefined
                                    ||
                                    crudObject["Type"] !== undefined
                                    ||
                                    crudObject["Volgnummer"] !== undefined
                                    ||
                                    crudObject["Werkingsgebied"] !== undefined
                                    ?
                                    <ContainerFormSection
                                        titel="Aanvullende informatie"
                                        beschrijving="In deze sectie vragen we aanvullende informatie zoals de link naar het IDMS besluitdocument en het besluitnummer."
                                    >

                                        {/* Beleids_Document */}
                                        { crudObject["Beleids_Document"] !== undefined ? 
                                            <FormFieldTextInput 
                                                handleChange={this.context.handleChange}
                                                fieldValue={crudObject["Beleids_Document"]}
                                                fieldLabel="Beleids Document"
                                                dataObjectProperty="Beleids_Document"
                                                pValue="Lorem ipsum dolor sit amet"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        : null }

                                        {/* Gebied */}
                                        { crudObject["Gebied"] !== undefined ? 
                                            <FormFieldWerkingsgebiedrelatie 
                                                handleChange={this.context.handleChange}
                                                fieldValue={crudObject["Gebied"]}
                                                fieldLabel="Gebied"
                                                dataObjectProperty="Gebied"
                                                pValue="Lorem ipsum dolor sit amet"
                                                titelEnkelvoud={titelEnkelvoud}
                                                editStatus={this.context.editStatus}
                                            />
                                        : null }

                                        {/* Verplicht_Programma */}
                                        { crudObject["Verplicht_Programma"] !== undefined ? 
                                            <FormFieldSelect 
                                                handleChange={this.context.handleChange}
                                                fieldValue={crudObject["Verplicht_Programma"]}
                                                fieldLabel="Verplicht Programma"
                                                dataObjectProperty="Verplicht_Programma"
                                                selectArray={verplichtProgrammaValues}
                                                pValue="Lorem ipsum dolor sit amet"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        : null }

                                        {/* Specifiek_Of_Generiek */}
                                        { crudObject["Specifiek_Of_Generiek"] !== undefined ? 
                                            <FormFieldSelect 
                                                handleChange={this.context.handleChange}
                                                fieldValue={crudObject["Specifiek_Of_Generiek"]}
                                                fieldLabel="Specifiek of Generiek"
                                                dataObjectProperty="Specifiek_Of_Generiek"
                                                selectArray={SpecifiekOfGeneriekValues}
                                                pValue="Lorem ipsum dolor sit amet"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        : null }

                                        {/* Weblink */}
                                        { crudObject["Weblink"] !== undefined ? 
                                            <FormFieldWeblink 
                                                handleChange={this.context.handleChange}
                                                fieldValue={crudObject["Weblink"]}
                                                fieldLabel="Weblink"
                                                dataObjectProperty="Weblink"
                                                pValue="Lorem ipsum dolor sit amet"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        : null }

                                        {/* Aanvraag en Akkoord */}
                                        <div className="flex flex-wrap -mx-3">

                                            {/* Aanvraag Datum */}
                                            { crudObject["Aanvraag_Datum"] !== undefined ? 
                                                <FormFieldDate
                                                    handleChange={this.context.handleChange}
                                                    fieldValue={crudObject["Aanvraag_Datum"]}
                                                    fieldLabel="Aanvraag Datum"
                                                    dataObjectProperty="Aanvraag_Datum"
                                                    pValue="Lorem ipsum dolor sit amet"
                                                    titelEnkelvoud={titelEnkelvoud}
                                                />
                                            : null }

                                            {/* Datum Akkoord */}
                                            { crudObject["Datum_Akkoord"] !== undefined ? 
                                                <FormFieldDate
                                                    handleChange={this.context.handleChange}
                                                    fieldValue={crudObject["Datum_Akkoord"]}
                                                    fieldLabel="Datum Akkoord"
                                                    dataObjectProperty="Datum_Akkoord"
                                                    pValue="Lorem ipsum dolor sit amet"
                                                    titelEnkelvoud={titelEnkelvoud}
                                                />
                                            : null }

                                        </div>
                                        
                                        {/* Geldigheid */}
                                        <div className="flex flex-wrap -mx-3">
                                        
                                            {/* Begin Geldigheid */}
                                            { crudObject["Begin_Geldigheid"] !== undefined ? 
                                                <FormFieldDate
                                                    handleChange={this.context.handleChange}
                                                    fieldValue={crudObject["Begin_Geldigheid"]}
                                                    fieldLabel="Inwerkingtreding"
                                                    dataObjectProperty="Begin_Geldigheid"
                                                    pValue="Indien bekend, kan hier de datum van inwerkingtreding worden ingevuld"
                                                    titelEnkelvoud={titelEnkelvoud}
                                                />
                                            : null }

                                            {/* Eind Geldigheid */}
                                            { crudObject["Eind_Geldigheid"] !== undefined ? 
                                                <FormFieldDate
                                                    handleChange={this.context.handleChange}
                                                    fieldValue={crudObject["Eind_Geldigheid"]}
                                                    fieldLabel="Uitwerkingtreding"
                                                    dataObjectProperty="Eind_Geldigheid"
                                                    pValue="Indien bekend, kan hier de datum van uitwerkingtreding worden ingevuld"
                                                    titelEnkelvoud={titelEnkelvoud}
                                                />
                                            : null }

                                        </div>


                                        {/* Beleids Relatie */}
                                        <div className="flex flex-wrap -mx-3">
                                        
                                            {/* Van Beleidsbeslissing */}
                                            { crudObject["Van_Beleidsbeslissing"] !== undefined ? 
                                                <FormFieldBeleidsrelatie
                                                    handleChange={this.context.handleChange}
                                                    titelEnkelvoud={titelEnkelvoud}
                                                    fieldValue={crudObject["Van_Beleidsbeslissing"]}
                                                    fieldLabel="Van Beleidsbeslissing"
                                                    dataObjectProperty="Van_Beleidsbeslissing"
                                                    editStatus={this.context.editStatus}
                                                />
                                            : null }

                                            {/* Van Beleidsbeslissing */}
                                            { crudObject["Naar_Beleidsbeslissing"] !== undefined ? 
                                                <FormFieldBeleidsrelatie
                                                    handleChange={this.context.handleChange}
                                                    titelEnkelvoud={titelEnkelvoud}
                                                    fieldValue={crudObject["Naar_Beleidsbeslissing"]}
                                                    fieldLabel="Naar Beleidsbeslissing"
                                                    dataObjectProperty="Naar_Beleidsbeslissing"
                                                    editStatus={this.context.editStatus}
                                                />
                                            : null }

                                        </div>

                                        {/* Status */}
                                        { crudObject["Status"] !== undefined ? 
                                            <FormFieldSelect 
                                                handleChange={this.context.handleChange}
                                                titelEnkelvoud={titelEnkelvoud}
                                                fieldValue={crudObject["Status"]}
                                                selectArray={statusArrayValues}
                                                fieldLabel="Status"
                                                dataObjectProperty="Status"
                                            />
                                        : null }

                                        {/* Verordening Type */}
                                        { crudObject["Type"] !== undefined ? 
                                            <FormFieldSelect 
                                                handleChange={this.context.handleChange}
                                                titelEnkelvoud={titelEnkelvoud}
                                                fieldValue={crudObject["Type"]}
                                                selectArray={VerordeningTypeValues}
                                                fieldLabel="Verordening Type"
                                                dataObjectProperty="Type"
                                            />
                                        : null }

                                        {/* Verodening Volgnummer */}
                                        { crudObject["Volgnummer"] !== undefined ? 
                                            <FormFieldTextInput 
                                                handleChange={this.context.handleChange}
                                                titelEnkelvoud={titelEnkelvoud}
                                                fieldValue={crudObject["Volgnummer"]}
                                                fieldLabel="Volgnummer"
                                                dataObjectProperty="Volgnummer"
                                            />
                                        : null }

                                        {/* Verordening Werkingsgebied */}
                                        { crudObject["Werkingsgebied"] !== undefined ? 
                                            <FormFieldWerkingsgebiedrelatie 
                                                handleChange={this.context.handleChange}
                                                titelEnkelvoud={titelEnkelvoud}
                                                fieldValue={crudObject["Werkingsgebied"]}
                                                fieldLabel="Werkingsgebied"
                                                dataObjectProperty="Werkingsgebied"
                                                editStatus={this.context.editStatus}
                                            />
                                        : null }
                                    </ContainerFormSection>
                                : null }



                                {/* Submit */}
                                <div className="fixed bottom-0 right-0 px-6">
                                    <div className="bg-white shadow px-4 py-4 inline-block rounded-t">
                                        <input className="font-bold py-2 px-4 leading-tight text-sm rounded mbg-color text-white hover:underline" type="submit" value='Opslaan'>
                                        </input>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </React.Fragment>

        );
    }

}

ContainerCrudFields.contextType = APIcontext

export default ContainerCrudFields;