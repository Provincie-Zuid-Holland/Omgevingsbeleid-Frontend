import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Import UI Components
import MainSidebar from './../MainSidebar';
import BackToButton from './../UI/BackToButton'
import EditButton from './../UI/ApiView/EditButton'
import MainTitel from './../UI/ApiView/MainTitel'
import MainParagraaf from './../UI/ApiView/MainParagraaf'



// Main Component - Main Container
class DetailMain extends Component {

  render() {

    const dataObject = this.props.dataObject
    const pageType = this.props.pageType
    const overzichtSlug = this.props.overzichtSlug
    const objectID = dataObject.ID
    const titel = dataObject.Titel
    const omschrijving = dataObject.Omschrijving


    return (

      <div className="w-3/4 inline-block pr-8">
        <div className="relative inline-block w-full px-4 pb-6 pt-4 shadow-md rounded overflow-hidden bg-white">

          { (pageType === "detail" ) ?
            <EditButton overzichtSlug={overzichtSlug} objectID={objectID} />
          : null }


          <MainTitel titel={titel} />
          
          {/* Omschrijving */}
          { dataObject["Omschrijving"] !== undefined ? 
            <MainParagraaf
              paragraaf={dataObject.Omschrijving}
            />
          : null }

          {/* Motivering */}
          { dataObject["Motivering"] !== undefined ? 
            <MainParagraaf
              paragraaf={dataObject.Motivering}
            />
          : null }

        </div>
      </div>

    );

  }
  
}


export default DetailMain;