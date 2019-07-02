import React from 'react';

import axiosAPI from '../../../API/axios'

class SidebarString extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataObject: null
    }
  }  

  render() {
    return (
      <div className="block pb-2 border-b no-underline">
        <h4 className="text-gray-800 font-bold text-sm">{ this.props.UITitle }</h4>
        <p className="text-gray-700 text-sm">
          { this.state.dataObject !== null ? this.state.dataObject.Gebruikersnaam : null }
        </p>
      </div>
    );
  }

  componentDidMount() {
    
    let apiEndpoint = `gebruikers/${this.props.userID}`

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

}

export default SidebarString;