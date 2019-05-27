import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Import UI Components
import MainSidebar from './../MainSidebar';
import BackToButton from './../UI/BackToButton'
import EditButton from './../UI/ApiView/EditButton'
import MainTitel from './../UI/ApiView/MainTitel'
import MainOmschrijving from './../UI/ApiView/MainOmschrijving'



// Main Component - Main Container
class DetailMain extends Component {

  render() {

    // Create Page Variables
    const pageType = this.props.pageType
    const overzichtSlug = this.props.overzichtSlug
    const objectID = this.props.dataObject.ID
    const titel = this.props.dataObject.Titel
    const omschrijving = this.props.dataObject.Omschrijving

    return (

      <div className="w-3/4 inline-block pr-8">
        <div className="relative inline-block w-full px-4 pb-6 pt-4 shadow-md rounded overflow-hidden bg-white">

          <MainTitel titel={titel} />
          <MainOmschrijving omschrijving={omschrijving} />

          { (pageType === "detail" ) ?
            <EditButton overzichtSlug={overzichtSlug} objectID={objectID} />
          : null }

        </div>
      </div>

    );

  }
  
}


export default DetailMain;