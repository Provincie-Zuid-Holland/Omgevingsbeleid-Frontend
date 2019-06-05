import React from 'react';

import MainSidebar from './../MainSidebar'
import BackToButton from './../UI/BackToButton'

import TextInput from './../UI/ApiCrud/TextInput'
import TextArea from './../UI/ApiCrud/TextArea'
import Weblink from './../UI/ApiCrud/Weblink'
import DateInput from './../UI/ApiCrud/DateInput'
import SelectInput from './../UI/ApiCrud/SelectInput'

class CrudContainer extends React.Component {


    render() {

        const crudObject = this.props.crudObject
        const titelEnkelvoud = this.props.titelEnkelvoud

        const statusArrayValues = [
            ["Open", "Open"],
            ["Akkoord", "Akkoord"],
            ["NietAkkoord", "Niet Akkoord"]
        ]

        return (
        
            <div className="container mx-auto flex px-6 pb-8">      
                
                {/* Sidebar */}
                <MainSidebar />

                {/* Ambition Container */}
                <div className="w-3/4 inline-block flex-grow pl-8">	
                    <BackToButton terugNaar={titelEnkelvoud.toLowerCase()} url={`/${this.props.overzichtSlug}/${this.props.objectID}`} />
                    <div>
                        <h1 className="font-serif text-gray-800 text-2xl">{this.props.editStatus ? `Wijzig een ${titelEnkelvoud.toLowerCase()}` : `Voeg een nieuwe ${titelEnkelvoud.toLowerCase()} toe`}</h1>
                        <form className="sm:w-full w-2/3 mt-6" onSubmit={this.props.handleSubmit}>
                            
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

                            {/* Weblink */}
                            { crudObject["Weblink"] !== undefined ? 
                                <Weblink 
                                    handleChange={this.props.handleChange}
                                    fieldValue={crudObject["Weblink"]}
                                    fieldLabel="Weblink"
                                    dataObjectProperty="Weblink"
                                />
                            : null }
            
                            {/* Geldigheid */}
                            <div className="flex flex-wrap -mx-3 mb-6">
                            
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

                            </div>

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