import React, { Component } from 'react';

// Import Components
import MainSidebar from './../MainSidebar';
import BackToButton from './../UI/BackToButton'
import DetailSidebar from './../Containers/DetailSidebar'
import DetailMain from './../Containers/DetailMain'

// Import Axios instance to connect with the API
import axiosAPI from '../../API/axios'

// Generate Back Button for Detail or Version page
function GenerateBackToButton(props) {

  const overzichtSlug = props.overzichtSlug
  const pageType = props.pageType
  const titelEnkelvoud = props.titelEnkelvoud
  const hoofdOnderdeelSlug = props.hoofdOnderdeelSlug
  const apiTest = props.apiTest

  if (pageType === "detail") {
    return(
      <BackToButton 
        terugNaar={`${titelEnkelvoud} overzicht`} 
        // url={`/${hoofdOnderdeel}/${overzichtSlug}`}
        url={
          apiTest === true ?
          `/${hoofdOnderdeelSlug}/${overzichtSlug}` :
          `/${hoofdOnderdeelSlug}`
        }
      />
    )
  } else if (pageType === "version") {
    const dataObjectID = props.dataObject.ID
    return(
      <BackToButton 
        terugNaar={`huidige versie`}
        url={
          apiTest === true ?
          `/${hoofdOnderdeelSlug}/${overzichtSlug}/${dataObjectID}` :
          `/${hoofdOnderdeelSlug}/${dataObjectID}`
        }
      />
    )
  }

}

// Main Component - APITest Detail
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

  // Met d to set the page type: detail/version
  returnPageType() {
    let pageType = "detail"
    if (this.props.match.params.version) {
      pageType = "version"
    }
    return pageType
  }

  // Method to create the API endpoint, based on the page type
  getDataFromApi () {
   
    const ApiEndpointBase = this.props.dataModel.variables.Api_Endpoint
    let apiEndpoint = ""

    if (this.state.pageType === "detail") {
      let detail_id = this.props.match.params.single;
      apiEndpoint = `${ApiEndpointBase}/${detail_id}`
    } else if (this.state.pageType === "version") {
      let version_id = this.props.match.params.version;
      apiEndpoint = `${ApiEndpointBase}/version/${version_id}`
    }

    // Connect With the API
    axiosAPI.get(apiEndpoint)
    .then(res => {
      const dataObject = res.data;
      this.setState({ dataObject: dataObject })
    }).catch((error) => {
      if (error.response !== undefined) {
        if (error.response.status === 401) {
          localStorage.removeItem('access_token')
          this.props.history.push('/login')
        }
      } else {
        console.log(error);
      }
    })

  }


  render() {

    // Variables to give as props
    const titelEnkelvoud = this.props.dataModel.variables.Titel_Enkelvoud;
    const overzichtSlug = this.props.dataModel.variables.Overzicht_Slug;
    const objectName = this.props.dataModel.variables.Object_Name;
    const dataModel = this.props.dataModel
    const hoofdOnderdeelSlug = this.props.hoofdOnderdeelSlug
    const apiTest = this.props.apiTest
    

    // False if data is loading, true if there is a response
    let dataReceived = (this.state.dataObject !== null);

    // Create dataObject and revisieObject to pass down to the sidebar
    let dataObject = {}
    let revisieObject = {}

    if (dataReceived && this.state.pageType === "detail") {
    
      dataObject = this.state.dataObject[0]
      revisieObject = this.state.dataObject

    } else if (dataReceived && this.state.pageType === "version") {

      dataObject = this.state.dataObject

    }

    return (

      <div className="container mx-auto flex px-6 pb-8">      
        
        {/* Main Menu - Sidebar */}
        <MainSidebar />
        
        {/* Dimensie Container */}
        <div className="w-3/4 rounded inline-block pl-8">

          <GenerateBackToButton 
            dataObject={dataObject} 
            titelEnkelvoud={titelEnkelvoud} 
            overzichtSlug={overzichtSlug} 
            hoofdOnderdeelSlug={hoofdOnderdeelSlug}
            apiTest={apiTest}
            pageType={this.state.pageType}
          />
        	
          <div className="flex mt-3">
            { dataReceived ? 
              <DetailMain 
                dataObject={dataObject} 
                ambitie_id={this.props.match.params.single} 
                pageType={this.state.pageType}
                overzichtSlug={overzichtSlug}
              /> 
            : null }
            { dataReceived ? 
              <DetailSidebar 
                dataObject={dataObject} 
                revisieObject={revisieObject} 
                pageType={this.state.pageType} 
                overzichtSlug={overzichtSlug} 
                objectName={objectName}
                dataModel={dataModel}
              /> 
            : null }
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