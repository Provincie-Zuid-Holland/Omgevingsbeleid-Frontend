import React, { Component } from 'react';

// Import API Model for UI Variables: Title
import APIDataModel from './../../dataModel/ApiModel'

// Import UI Components
import Eigenaar from './../UI/ApiView/Eigenaar'
import Weblink from './../UI/ApiView/Weblink'
import Datum from './../UI/ApiView/Datum'
import RevisieOverzicht from './../UI/ApiView/RevisieOverzicht'



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
                    UIContent={dataObject["UUID"]} 
                />
            : null }

            { dataObject["Weblink"] ? 
                <Weblink 
                    UITitle={getTitle(dataModel, "Weblink")} 
                    UIContent={dataObject["Weblink"]} 
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