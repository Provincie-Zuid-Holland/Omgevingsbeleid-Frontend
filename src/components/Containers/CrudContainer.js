import React from 'react';
import { format } from 'date-fns'

import MainSidebar from './../MainSidebar'
import BackToButton from './../UI/BackToButton'

import TextInput from './../UI/ApiCrud/TextInput'

class Datum extends React.Component {

    arrayToObject = (array, keyField, valueField) => 
        array.reduce((obj, item) => {
            obj[item[keyField]] = item[valueField]
            return obj
        }, {})


    render() {

        const crudObject = this.arrayToObject(this.props.crudObject, "name", "value")
        console.log(crudObject)
        // Functie 

        return (
        
            <div className="container mx-auto flex px-6 pb-8">      
                
                {/* Sidebar */}
                <MainSidebar />

                {/* Ambition Container */}
                <div className="w-3/4 inline-block flex-grow pl-8">	
                    <BackToButton terugNaar="ambitie" url={`/ambities/${this.props.objectID}`} />
                    <div>
                        <h1 className="font-serif text-gray-800 text-2xl">{this.props.editStatus ? "Wijzig een ambitie" : "Voeg een nieuwe ambitie toe"}</h1>
                        <form className="sm:w-full w-2/3 mt-6" onSubmit={this.props.handleSubmit}>
                            
                            { crudObject["Titel"] ? 
                                <TextInput 
                                    onChange={this.props.onChange}
                                    fieldValue={crudObject["Titel"]}
                                    fieldLabel="Titel"
                                />
                            : null }

                            {/* Omschrijving */}
                            <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="omschrijving">
                                Omschrijving
                                </label>
                                <textarea value={this.props.crudObject.Omschrijving} required onChange={this.handleChange} name="Omschrijving" className="appearance-none block w-full bg-gray-400er text-gray-700 border border-gray-400er rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-500" id="omschrijving" type="text" placeholder="Aiden heeft vele ambities"/>
                            </div>
                            </div>

                            {/* Weblink */}
                            <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="weblink">
                                Weblink
                                </label>
                                <input required value={this.props.crudObject.Weblink} onChange={this.handleChange} name="Weblink" className="appearance-none block w-full bg-gray-400er text-gray-700 border border-gray-400er rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-500" id="weblink" type="text" placeholder="https://www.nu.nl"/>
                            </div>
                            </div>
            
                            {/* Geldigheid */}
                            <div className="flex flex-wrap -mx-3 mb-6">
                            
                            {/* Begin Geldigheid */}
                            <div className="w-50 px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="omschrijving">
                                Begin Geldigheid
                                </label>
                                <input required value={format(this.props.crudObject.Begin_Geldigheid, "YYYY-MM-DD")} onChange={this.handleChange} name="Begin_Geldigheid" className="appearance-none block w-full bg-gray-400er text-gray-700 border border-gray-400er rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-500" id="begin-geldigheid" type="date"/>
                            </div>
                            {/* Eind Geldigheid */}
                            <div className="w-50 px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="omschrijving">
                                Eind Geldigheid
                                </label>
                                <input required value={format(this.props.crudObject.Eind_Geldigheid, "YYYY-MM-DD")} onChange={this.handleChange} name="Eind_Geldigheid" className="appearance-none block w-full bg-gray-400er text-gray-700 border border-gray-400er rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-500" id="eind-geldigheid" type="date"/>
                            </div>
                            </div>

                            {/* Submit */}
                            <div className="flex flex-wrap -mx-3">
                            <div className="w-full px-3">
                                <input className="font-bold py-2 px-4 text-sm rounded bg-green-200 text-green-700 hover:bg-green-300" type="submit" value={this.props.editStatus ? "Wijzig Ambitie" : "Voeg Ambitie toe"}>
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

export default Datum;