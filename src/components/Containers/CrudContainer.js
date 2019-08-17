import React from 'react';

import { APIcontext } from './../Context/APIcontext'

import BackToButton from './../UI/BackToButton'

import FormSection from './../UI/ApiCrud/FormSection'

import TextInput from './../UI/ApiCrud/TextInput'
import TextArea from './../UI/ApiCrud/TextArea'
import EditorField from './../UI/ApiCrud/EditorField'
import Weblink from './../UI/ApiCrud/Weblink'
import DateInput from './../UI/ApiCrud/DateInput'
import SelectInput from './../UI/ApiCrud/SelectInput'
import BeleidsRelatieInput from './../UI/ApiCrud/BeleidsRelatieInput'
import WerkingsgebiedRelatie from './../UI/ApiCrud/WerkingsgebiedRelatie'
import UserSelect from './../UI/ApiCrud/UserSelect'

class CrudContainer extends React.Component {

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

        console.log("Called 3")

        return (
        
            <React.Fragment>

                <div className="w-full py-32 px-6 mbg-color edit-header relative">
                    <div className="container mx-auto flex justify-center items-center">
                        <div className="w-1/3 pr-20">
                            { this.context.editStatus === false ? 
                                <BackToButton terugNaar={titelMeervoud.toLowerCase()} color="text-white" url={`/api-test/${this.context.overzichtSlug}`} /> 
                                : 
                                <BackToButton terugNaar={titelEnkelvoud.toLowerCase()} color="text-white" url={`/api-test/${this.context.overzichtSlug}/${this.context.objectID}`} />  
                            }
                            <h1 className="heading-serif-4xl text-white">
                                {mainTitle}
                            </h1>
                        </div>
                        <div className="w-2/3">
                            <p className="text-white">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            </p>
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
                                    
                                    <FormSection
                                        titel="Algemene informatie"
                                        beschrijving="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                                    >
                                        { crudObject["Titel"] !== undefined ? 
                                            <TextInput 
                                                handleChange={this.context.handleChange}
                                                fieldValue={crudObject["Titel"]}
                                                dataObjectProperty="Titel"
                                                fieldLabel="Titel"
                                                pValue="Beschrijf in een aantal woorden de titel van deze"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        : null }
                                        
                                        { crudObject["Opdrachtgever"] !== undefined ||
                                        crudObject["Portefeuillehouder"] !== undefined ||
                                        crudObject["Eigenaar_1"] !== undefined  ||
                                        crudObject["Eigenaar_2"] !== undefined  ? 
                                        <React.Fragment>

                                            <span
                                                className="form-field-label"
                                            >
                                                Personen
                                            </span>

                                            <div className="flex">

                                                { crudObject["Eigenaar_1"] !== undefined ? 
                                                <UserSelect 
                                                    handleChange={this.context.handleChange}
                                                    fieldValue={crudObject["Eigenaar_1"]}
                                                    dataObjectProperty="Eigenaar_1"
                                                    marginRight={true}
                                                    // fieldLabel="Titel"
                                                    pValue="Opdrachtgever"
                                                    titelEnkelvoud={titelEnkelvoud}
                                                /> : null } 

                                                { crudObject["Portefeuillehouder"] !== undefined ? 
                                                <UserSelect 
                                                    handleChange={this.context.handleChange}
                                                    fieldValue={crudObject["Portefeuillehouder"]}
                                                    dataObjectProperty="Portefeuillehouder"
                                                    // fieldLabel="Titel"
                                                    pValue="Portefeuillehouder"
                                                    titelEnkelvoud={titelEnkelvoud}
                                                /> : null } 
                                            
                                            </div>
                                            
                                            <div className="flex">

                                                { crudObject["Eigenaar_2"] !== undefined ? 
                                                <UserSelect 
                                                    handleChange={this.context.handleChange}
                                                    fieldValue={crudObject["Eigenaar_1"]}
                                                    dataObjectProperty="Eigenaar_1"
                                                    marginRight={true}
                                                    // fieldLabel="Titel"
                                                    pValue="1e eigenaar"
                                                    titelEnkelvoud={titelEnkelvoud}
                                                /> : null }

                                                { crudObject["Eigenaar_2"] !== undefined ? 
                                                <UserSelect 
                                                    handleChange={this.context.handleChange}
                                                    fieldValue={crudObject["Eigenaar_2"]}
                                                    dataObjectProperty="Eigenaar_2"
                                                    // fieldLabel="Titel"
                                                    pValue="2e eigenaar"
                                                    titelEnkelvoud={titelEnkelvoud}
                                                /> : null }

                                            </div>

                                        </React.Fragment>
                                        : null }

                                        { crudObject["Omschrijving_Keuze"] !== undefined ? 
                                            <TextArea 
                                                handleChange={this.context.handleChange}
                                                fieldValue={crudObject["Omschrijving_Keuze"]}
                                                fieldLabel="Doel"
                                                dataObjectProperty="Omschrijving_Keuze"
                                                pValue="Wat wil de provincie bereiken (PS)?"
                                                titelEnkelvoud={titelEnkelvoud}
                                                hideObjectLabel={true}
                                            />
                                        : null }


                                    </FormSection>
                                : null }

                                
                                { crudObject["Omschrijving"] !== undefined ? 
                                
                                    <FormSection
                                        titel="Toelichting"
                                        beschrijving="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                                    >
                                        { crudObject["Omschrijving"] !== undefined ? 
                                            <TextArea 
                                                handleChange={this.context.handleChange}
                                                fieldValue={crudObject["Omschrijving"]}
                                                fieldLabel="Omschrijving"
                                                dataObjectProperty="Omschrijving"
                                                pValue="Geef een korte omschrijving van deze"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        : null }
                                    </FormSection>
                                    
                                : null }


                                { crudObject["Motivering"] !== undefined ? 
                                    
                                    <FormSection
                                        titel="Toelichting"
                                        beschrijving="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                                    >
                                        { crudObject["Motivering"] !== undefined ?
                                            <EditorField
                                                handleChange={this.context.setEditorState}
                                                fieldValue={crudObject["Motivering"]}
                                                fieldLabel="Omschrijving"
                                                dataObjectProperty="Motivering"
                                                pValue="Geef een korte omschrijving van de werking van de"
                                                titelEnkelvoud={titelEnkelvoud}
                                            />
                                        : null }
                                    </FormSection>
                                    
                                : null }

                            { crudObject["Aanleiding"] !== undefined || 
                            crudObject["Afweging"] !== undefined ? 
                                
                                <FormSection
                                    titel="Waarom deze Beleidsbeslissing?"
                                    beschrijving="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                                >
                                    { crudObject["Aanleiding"] !== undefined ? 
                                        <TextArea 
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
                                        <TextArea 
                                            handleChange={this.context.handleChange}
                                            fieldValue={crudObject["Afweging"]}
                                            fieldLabel="Afweging"
                                            hideObjectLabel={true}
                                            dataObjectProperty="Afweging"
                                            pValue="Welke afwegingen hebben tot deze beleidsbeslissing geleid?"
                                            titelEnkelvoud={titelEnkelvoud}
                                        />
                                    : null }
                                </FormSection>
                                
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
                                    <FormSection
                                        titel="Overige Informatie"
                                        beschrijving="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                                    >

                                        {/* Beleids_Document */}
                                        { crudObject["Beleids_Document"] !== undefined ? 
                                            <TextInput 
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
                                            <WerkingsgebiedRelatie 
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
                                            <SelectInput 
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
                                            <SelectInput 
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
                                            <Weblink 
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
                                                <DateInput 
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
                                                <DateInput 
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
                                                <DateInput 
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
                                                <DateInput 
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
                                                <BeleidsRelatieInput
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
                                                <BeleidsRelatieInput
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
                                            <SelectInput 
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
                                            <SelectInput 
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
                                            <TextInput 
                                                handleChange={this.context.handleChange}
                                                titelEnkelvoud={titelEnkelvoud}
                                                fieldValue={crudObject["Volgnummer"]}
                                                fieldLabel="Volgnummer"
                                                dataObjectProperty="Volgnummer"
                                            />
                                        : null }

                                        {/* Verordening Werkingsgebied */}
                                        { crudObject["Werkingsgebied"] !== undefined ? 
                                            <WerkingsgebiedRelatie 
                                                handleChange={this.context.handleChange}
                                                titelEnkelvoud={titelEnkelvoud}
                                                fieldValue={crudObject["Werkingsgebied"]}
                                                fieldLabel="Werkingsgebied"
                                                dataObjectProperty="Werkingsgebied"
                                                editStatus={this.context.editStatus}
                                            />
                                        : null }
                                    </FormSection>
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

CrudContainer.contextType = APIcontext

export default CrudContainer;