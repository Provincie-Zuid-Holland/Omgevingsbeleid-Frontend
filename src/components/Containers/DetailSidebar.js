import React, { Component } from 'react';

// Import API Model for UI Variables: Title
import APIDataModel from './../../dataModel/ApiModel'

// Import UI Components
import Eigenaar from './../UI/ApiView/Eigenaar'
import Weblink from './../UI/ApiView/Weblink'
import Datum from './../UI/ApiView/Datum'
import RevisieOverzicht from './../UI/ApiView/RevisieOverzicht'
import TextField from './../UI/ApiView/TextField'
import Gebied from './../UI/ApiView/Gebied'
import GebiedLeaflet from './../UI/ApiView/GebiedLeaflet'

// Function to get the Title Variable for each component
function getTitle(dataModel, propertyName) {
    return dataModel.properties[propertyName].UI.UIVariables.UITitle
}


// Component - Sidebar Content
function DetailSidebarContent(props) {

    // Create Page Variables
    const dataObject = props.dataObject
    const pageType = props.pageType
    const overzichtSlug = props.overzichtSlug
    const revisieObject = props.revisieObject
    const dataModel = props.dataModel

    // Return UI Components (condtional on object properties)
    return (

        <div className="overflow-hidden max-w-xs w-full">

            { dataObject["UUID"] ? 
                <Eigenaar 
                    UITitle={getTitle(dataModel, "UUID")} 
                    userID={dataObject["Created_By"]}
                />
            : null }

            { dataObject["Weblink"] ? 
                <Weblink 
                    UITitle={getTitle(dataModel, "Weblink")} 
                    UIContent={dataObject["Weblink"]} 
                /> 
            : null }


            { dataObject["Beleids_Document"] ? 
                <Weblink 
                UITitle={getTitle(dataModel, "Beleids_Document")} 
                    UIContent={dataObject["Beleids_Document"]} 
                    /> 
                    : null }
            
            { dataObject["Gebied"] ? 
                <Gebied 
                    UITitle={getTitle(dataModel, "Gebied")}
                    gebiedUUID={dataObject["Gebied"]} 
                /> 
            : null }

            { dataObject["Gebied"] ?
                <div className="bg-red-500 w-full h-48 mb-6">
                    <GebiedLeaflet
                        gebiedUUID={dataObject["Gebied"]} 
                    />
                </div> 
            : null }

            { dataObject["Verplicht_Programma"] ? 
                <TextField 
                    UITitle={getTitle(dataModel, "Verplicht_Programma")}
                    UIContent={dataObject["Verplicht_Programma"]} 
                /> 
            : null }

            { dataObject["Specifiek_Of_Generiek"] ? 
                <TextField 
                    UITitle={getTitle(dataModel, "Specifiek_Of_Generiek")}
                    UIContent={dataObject["Specifiek_Of_Generiek"]} 
                /> 
            : null }

            { dataObject["Status"] ? 
                <TextField 
                    UITitle={getTitle(dataModel, "Status")} 
                    UIContent={dataObject["Status"]} 
                /> 
            : null }

            { dataObject["Aanvraag_Datum"] ? 
                <Datum 
                    UITitle={getTitle(dataModel, "Aanvraag_Datum")} 
                    UIContent={dataObject["Aanvraag_Datum"]} 
                /> 
            : null }

            { dataObject["Datum_Akkoord"] ? 
                <Datum 
                    UITitle={getTitle(dataModel, "Datum_Akkoord")} 
                    UIContent={dataObject["Datum_Akkoord"]} 
                /> 
            : null }

            { dataObject["Begin_Geldigheid"] ? 
                <Datum 
                    UITitle={getTitle(dataModel, "Begin_Geldigheid")} 
                    UIContent={dataObject["Begin_Geldigheid"]} 
                /> 
            : null }

            { dataObject["Eind_Geldigheid"] ? 
                <Datum 
                    UITitle={getTitle(dataModel, "Eind_Geldigheid")} 
                    UIContent={dataObject["Eind_Geldigheid"]} 
                /> 
            : null }

            { dataObject["Van_Beleidsbeslissing"] ? 
                <TextField 
                    UITitle={getTitle(dataModel, "Van_Beleidsbeslissing")} 
                    UIContent={dataObject["Van_Beleidsbeslissing"]} 
                /> 
            : null }

            { dataObject["Naar_Beleidsbeslissing"] ? 
                <TextField 
                    UITitle={getTitle(dataModel, "Naar_Beleidsbeslissing")} 
                    UIContent={dataObject["Naar_Beleidsbeslissing"]} 
                /> 
            : null }


            { dataObject["Modified_Date"] ? 
                <Datum 
                    UITitle={getTitle(dataModel, "Modified_Date")} 
                    UIContent={dataObject["Modified_Date"]} 
                /> 
            : null }

            { dataObject["Created_Date"] ? 
                <Datum 
                    UITitle={getTitle(dataModel, "Created_Date")} 
                    UIContent={dataObject["Created_Date"]} 
                /> 
            : null }

            { (pageType === "detail" && revisieObject.length >= 2 ) ?
                <RevisieOverzicht 
                    revisieObject={revisieObject} 
                    overzichtSlug={overzichtSlug} 
                />
            : null }

        </div>

    );

}


// Main Component - Sidebar Container
class DetailSidebar extends Component {

  render() {
    return (

        <div className="inline-block w-1/4">
            <div className="flex items-center justify-center w-full">
                <DetailSidebarContent 
                    dataObject={this.props.dataObject} 
                    revisieObject={this.props.revisieObject} 
                    pageType={this.props.pageType} 
                    overzichtSlug={this.props.overzichtSlug} 
                    dataModel={this.props.dataModel}
                />
            </div>
        </div>

    );
  }
  
}


export default DetailSidebar;