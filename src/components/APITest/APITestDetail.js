import React, { Component } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

// Import Components
// import Sidebar from './../Sidebar';
import Detail from './../ambitions/AmbitionsDetail';
import MainSidebar from './../MainSidebar';
import BackToButton from './../BackToButton'

// Import Axios instance to connect with the API
import axiosAPI from './../../axios'

// sidebarSingle(this.props.content, this.props.contentType)
function DetailSidebar(props) {

  const dataObject = props.dataObject
  const pageType = props.pageType
  const overzichtSlug = props.overzichtSlug
  const revisieObject = props.revisieObject

  return (
    <div className="inline-block w-1/4">
      <div className="flex items-center justify-center w-full">
        <div className="overflow-hidden max-w-xs w-full">

          <div className="block pb-4 border-b no-underline">
            <h4 className="text-gray-800 font-bold text-sm">Eigenaar</h4>
            <p className="text-gray-700 text-sm">
              { dataObject ? dataObject.UUID : "Loading..." }
            </p>
          </div>

          <div className="block py-4 border-b no-underline">
            <h4 className="text-gray-800 font-bold text-sm">Weblink</h4>
            <a href={dataObject.Weblink} className="text-gray-700 text-sm block">
              { dataObject ? dataObject.Weblink : "Loading..." }
            </a>
          </div>

          <div className="block group py-4 border-b no-underline">
            <h4 className="text-gray-800 font-bold text-sm">Laatste Wijziging</h4>
            <p className="text-gray-700 text-sm">
              { dataObject ? format(new Date(dataObject.Modified_Date), 'D MMM YYYY') : "Loading..." }
            </p>
          </div>

          <div className="block group py-4 border-b no-underline">
            <h4 className="text-gray-800 font-bold text-sm">Aangemaakt op</h4>
            <p className="text-gray-700 text-sm">
              { dataObject ? format(new Date(dataObject.Created_Date), 'D MMM YYYY') : "Loading..." }
            </p>
          </div>

          { (pageType === "detail") ? 

            <div className="block group py-4 no-underline">
              <h4 className="text-gray-800 font-bold text-sm">Revisies</h4>
              <ul className="text-gray-700 text-sm">
              { revisieObject.slice(1).map((revisieObject, index) =>
                <li key={revisieObject.UUID}>
                  <span>{}</span>
                  <Link className="text-blue" to={`/${overzichtSlug}/${revisieObject.ID}/${revisieObject.UUID}`}>
                  {format(new Date(revisieObject.Modified_Date), 'D MMM YYYY')}
                  </Link>
                </li>
                )
              }
              </ul>
            </div> : null

          }

        </div>
      </div>
    </div>
  );

}


function GenerateBackToButton(props) {

  const overzichtSlug = props.overzichtSlug
  const pageType = props.pageType
  const titelEnkelvoud = props.titelEnkelvoud

  if (pageType === "detail") {
    return(
      <BackToButton terugNaar={`${titelEnkelvoud} overzicht`} url={`/${overzichtSlug}`} />
    )
  } else if (pageType === "version") {
    const dataObjectID = props.dataObject.ID
    return(
      <BackToButton terugNaar={`huidige versie`} url={`/${overzichtSlug}/${dataObjectID}`} />
    )
  }

}


class APITestDetail extends Component {


  state = {
    dataObject: null,
    pageType: ""
  }


  constructor(props) {
    
    super(props);
    
    this.returnPageType = this.returnPageType.bind(this)
    this.getDataFromApi = this.getDataFromApi.bind(this)

    this.state = {
      dataObject: null,
      pageType: this.returnPageType()
    }

  }


  // Function to set the page type: detail/version
  returnPageType() {
   
    let pageType = "detail"
    if (this.props.match.params.version) {
      pageType = "version"
    }

    return pageType

  }


  // Function to create the API endpoint, based on the page type
  getDataFromApi () {

    console.log(">>>>> GETTING FRESH API DATA <<<<<")
   
    const overzichtSlug = this.props.dataModel.variables.Overzicht_Slug;
    let apiEndpoint = ""

    if (this.state.pageType === "detail") {
      let detail_id = this.props.match.params.single;
      apiEndpoint = `${overzichtSlug}/${detail_id}`
    } else if (this.state.pageType === "version") {
      let version_id = this.props.match.params.version;
      apiEndpoint = `${overzichtSlug}/version/${version_id}`
    }

    // Connect With the API
    axiosAPI.get(apiEndpoint)
    .then(res => {
      const dataObject = res.data;
      console.log("API Response:")
      console.log(dataObject)
      this.setState({ dataObject: dataObject }, () => {
        console.log("Current state:")
        console.log(this.state)
      })
    }).catch((error) => {
      if (error.response !== undefined) {
        if (error.response.status === 401) {
          localStorage.removeItem('access_token')
        }
      } else {
        console.log(error);
      }
    })

  }


  render() {

    // Variables to give as props
    const titelEnkelvoud = this.props.dataModel.variables.Titel_Enkelvoud;
    const titelMeervoud = this.props.dataModel.variables.Titel_Meervoud;
    const createNewSlug = this.props.dataModel.variables.Create_New_Slug;
    const overzichtSlug = this.props.dataModel.variables.Overzicht_Slug;

    // False if data is loading, true if there is a response
    let dataReceived = (this.state.dataObject !== null);

    // When API Data received: 
    // Create dataObject to pass down to the sidebar
    let dataObject = {}
    if (dataReceived && this.state.pageType === "detail") {
      dataObject = this.state.dataObject[0]
    } else if (dataReceived && this.state.pageType === "version"){
      dataObject = this.state.dataObject
    }

    return (
      <div className="container mx-auto flex px-6 pb-8">      
        
        {/* Main Menu - Sidebar */}
        <MainSidebar />
        
        {/* Dimensie Container */}
        <div className="w-3/4 rounded inline-block pl-8">
          <GenerateBackToButton dataObject={dataObject} titelEnkelvoud={titelEnkelvoud} overzichtSlug={overzichtSlug} pageType={this.state.pageType}/>
        	<div className="flex mt-3">
            { dataReceived ? 
              <Detail dataObject={dataObject} ambitie_id={this.props.match.params.single} /> : null }
            { dataReceived ? 
              <DetailSidebar dataObject={dataObject} revisieObject={this.state.dataObject} pageType={this.state.pageType} overzichtSlug={overzichtSlug} /> : null }
          </div>
        </div>
	    </div>
    );

  }


  // On initial mount, set pagetype and get data from API
  componentDidMount() {

    this.getDataFromApi()

  }


  // Handle switch from 'detail <-> version'
  componentDidUpdate(prevProps) {
    
    console.log("!! Updated !!")

    if (this.returnPageType() !== this.state.pageType) {
      this.setState({
        dataObject: null,
        pageType: this.returnPageType()
      }, () => {
        this.getDataFromApi()
      });
    }

  }


}


export default APITestDetail;