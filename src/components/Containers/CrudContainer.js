import React from 'react';

import MainSidebar from './../MainSidebar'
import BackToButton from './../UI/BackToButton'

import TextInput from './../UI/ApiCrud/TextInput'
import TextArea from './../UI/ApiCrud/TextArea'
import Weblink from './../UI/ApiCrud/Weblink'
import DateInput from './../UI/ApiCrud/DateInput'
import SelectInput from './../UI/ApiCrud/SelectInput'
import BeleidsRelatieInput from './../UI/ApiCrud/BeleidsRelatieInput'
import WerkingsgebiedRelatie from './../UI/ApiCrud/WerkingsgebiedRelatie'

class CrudContainer extends React.Component {


    render() {

        const crudObject = this.props.crudObject
        console.log(crudObject)
        const titelEnkelvoud = this.props.titelEnkelvoud
        const titelMeervoud = this.props.titelMeervoud
        const dataModel = this.props.dataModel

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

        return (
        
            <div className="container mx-auto flex px-6 pb-8">      
                
                {/* Sidebar */}
                <MainSidebar />

                {/* Ambition Container */}
                <div className="w-3/4 inline-block flex-grow pl-8">	
                    { this.props.editStatus === false ? 
                        <BackToButton terugNaar={titelMeervoud.toLowerCase()} url={`/${this.props.overzichtSlug}`} /> 
                        : 
                        <BackToButton terugNaar={titelEnkelvoud.toLowerCase()} url={`/${this.props.overzichtSlug}/${this.props.objectID}`} />  
                    }
                    <div>
                        <h1 className="font-serif text-gray-800 text-2xl">{this.props.editStatus ? `Wijzig een ${titelEnkelvoud.toLowerCase()}` : `Voeg een nieuwe ${titelEnkelvoud.toLowerCase()} toe`}</h1>
                        <form className="sm:w-full w-2/3 mt-6" onSubmit={this.props.handleSubmit}>
                            

                            {/* Titel */}
                            { crudObject["Titel"] !== undefined ? 
                                <TextInput 
                                    handleChange={this.props.handleChange}
                                    fieldValue={crudObject["Titel"]}
                                    fieldLabel="Titel"
                                    dataObjectProperty="Titel"
                                />
                            : null }

                            {/* Omschrijving */}
                            { crudObject["Omschrijving"] !== undefined ? 
                                <TextArea 
                                    handleChange={this.props.handleChange}
                                    fieldValue={crudObject["Omschrijving"]}
                                    fieldLabel="Omschrijving"
                                    dataObjectProperty="Omschrijving"
                                />
                            : null }

                            {/* Motivering */}
                            { crudObject["Motivering"] !== undefined ? 
                                <TextArea 
                                    handleChange={this.props.handleChange}
                                    fieldValue={crudObject["Motivering"]}
                                    fieldLabel="Motivering"
                                    dataObjectProperty="Motivering"
                                />
                            : null }

                            {/* Beleids_Document */}
                            { crudObject["Beleids_Document"] !== undefined ? 
                                <TextInput 
                                    handleChange={this.props.handleChange}
                                    fieldValue={crudObject["Beleids_Document"]}
                                    fieldLabel="Beleids Document"
                                    dataObjectProperty="Beleids_Document"
                                />
                            : null }

                            {/* Gebied */}
                            { crudObject["Gebied"] !== undefined ? 
                                <WerkingsgebiedRelatie 
                                    handleChange={this.props.handleChange}
                                    fieldValue={crudObject["Gebied"]}
                                    fieldLabel="Gebied"
                                    dataObjectProperty="Gebied"
                                />
                            : null }

                            {/* Verplicht_Programma */}
                            { crudObject["Verplicht_Programma"] !== undefined ? 
                                <SelectInput 
                                    handleChange={this.props.handleChange}
                                    fieldValue={crudObject["Verplicht_Programma"]}
                                    fieldLabel="Verplicht Programma"
                                    dataObjectProperty="Verplicht_Programma"
                                    selectArray={verplichtProgrammaValues}
                                />
                            : null }

                            {/* Specifiek_Of_Generiek */}
                            { crudObject["Specifiek_Of_Generiek"] !== undefined ? 
                                <SelectInput 
                                    handleChange={this.props.handleChange}
                                    fieldValue={crudObject["Specifiek_Of_Generiek"]}
                                    fieldLabel="Specifiek of Generiek"
                                    dataObjectProperty="Specifiek_Of_Generiek"
                                    selectArray={SpecifiekOfGeneriekValues}
                                />
                            : null }

                            {/* Weblink */}
                            { crudObject["Weblink"] !== undefined ? 
                                <Weblink 
                                    handleChange={this.props.handleChange}
                                    fieldValue={crudObject["Weblink"]}
                                    fieldLabel="Weblink"
                                    dataObjectProperty="Weblink"
                                />
                            : null }

                            {/* Aanvraag en Akkoord */}
                            <div className="flex flex-wrap -mx-3">
                            
                                {/* Aanvraag Datum */}
                                { crudObject["Aanvraag_Datum"] !== undefined ? 
                                    <DateInput 
                                        handleChange={this.props.handleChange}
                                        fieldValue={crudObject["Aanvraag_Datum"]}
                                        fieldLabel="Aanvraag Datum"
                                        dataObjectProperty="Aanvraag_Datum"
                                    />
                                : null }

                                {/* Datum Akkoord */}
                                { crudObject["Datum_Akkoord"] !== undefined ? 
                                    <DateInput 
                                        handleChange={this.props.handleChange}
                                        fieldValue={crudObject["Datum_Akkoord"]}
                                        fieldLabel="Datum Akkoord"
                                        dataObjectProperty="Datum_Akkoord"
                                    />
                                : null }

                            </div>
                            
                            {/* Geldigheid */}
                            <div className="flex flex-wrap -mx-3">
                            
                                {/* Begin Geldigheid */}
                                { crudObject["Begin_Geldigheid"] !== undefined ? 
                                    <DateInput 
                                        handleChange={this.props.handleChange}
                                        fieldValue={crudObject["Begin_Geldigheid"]}
                                        fieldLabel="Begin Geldigheid"
                                        dataObjectProperty="Begin_Geldigheid"
                                    />
                                : null }

                                {/* Eind Geldigheid */}
                                { crudObject["Eind_Geldigheid"] !== undefined ? 
                                    <DateInput 
                                        handleChange={this.props.handleChange}
                                        fieldValue={crudObject["Eind_Geldigheid"]}
                                        fieldLabel="Eind Geldigheid"
                                        dataObjectProperty="Eind_Geldigheid"
                                    />
                                : null }

                            </div>


                            {/* Beleids Relatie */}
                            <div className="flex flex-wrap -mx-3">
                            
                                {/* Van Beleidsbeslissing */}
                                { crudObject["Van_Beleidsbeslissing"] !== undefined ? 
                                    <BeleidsRelatieInput 
                                        handleChange={this.props.handleChange}
                                        fieldValue={crudObject["Van_Beleidsbeslissing"]}
                                        fieldLabel="Van Beleidsbeslissing"
                                        dataObjectProperty="Van_Beleidsbeslissing"
                                    />
                                : null }

                                {/* Van Beleidsbeslissing */}
                                { crudObject["Naar_Beleidsbeslissing"] !== undefined ? 
                                    <BeleidsRelatieInput
                                        handleChange={this.props.handleChange}
                                        fieldValue={crudObject["Naar_Beleidsbeslissing"]}
                                        fieldLabel="Naar Beleidsbeslissing"
                                        dataObjectProperty="Naar_Beleidsbeslissing"
                                    />
                                : null }

                            </div>


                            {/* Status */}
                            { crudObject["Status"] !== undefined ? 
                                <SelectInput 
                                    handleChange={this.props.handleChange}
                                    fieldValue={crudObject["Status"]}
                                    selectArray={statusArrayValues}
                                    fieldLabel="Status"
                                    dataObjectProperty="Status"
                                />
                            : null }

                            {/* Verordening Type */}
                            { crudObject["Type"] !== undefined ? 
                                <SelectInput 
                                    handleChange={this.props.handleChange}
                                    fieldValue={crudObject["Type"]}
                                    selectArray={VerordeningTypeValues}
                                    fieldLabel="Verordening Type"
                                    dataObjectProperty="Type"
                                />
                            : null }

                            {/* Verodening Volgnummer */}
                            { crudObject["Volgnummer"] !== undefined ? 
                                <TextInput 
                                    handleChange={this.props.handleChange}
                                    fieldValue={crudObject["Volgnummer"]}
                                    fieldLabel="Volgnummer"
                                    dataObjectProperty="Volgnummer"
                                />
                            : null }

                            {/* Verordening Werkingsgebied */}
                            { crudObject["Werkingsgebied"] !== undefined ? 
                                <WerkingsgebiedRelatie 
                                    handleChange={this.props.handleChange}
                                    fieldValue={crudObject["Werkingsgebied"]}
                                    fieldLabel="Werkingsgebied"
                                    dataObjectProperty="Werkingsgebied"
                                    editStatus={this.props.editStatus}
                                />
                            : null }



                            {/* Submit */}
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full px-3">
                                    <input className="font-bold py-3 px-4 leading-tight text-sm rounded bg-green-200 text-green-700 hover:bg-green-300" type="submit" value={this.props.editStatus ? `Wijzig ${titelEnkelvoud}` : `Voeg ${titelEnkelvoud} toe`}>
                                    </input>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

            </div>

        );
    }

}

export default CrudContainer;