import React from 'react';
import { format } from 'date-fns'

// Import Axios instance to connect with the API
import axiosAPI from '../../../axios'

import Select from 'react-select'

function makeSelection(objectenArray) {
  console.log(objectenArray.length)
  if (objectenArray.length === 1) {
    return null
  } else {
    let options = []
    objectenArray.slice(1).map(arrayItem => {
      options.push({
        value: arrayItem.UUID,
        label: arrayItem.Titel
      })
    })
    return options
  }

}


class DateInput extends React.Component {

    state = {
      objecten: []
    }

  render() {
    
    return (
      <div className="w-50 px-3 mb-6">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={this.props.dataObjectProperty}>
            {this.props.fieldLabel}
          </label>
          {
            this.state.objecten.length !== 0 ? <Select options={makeSelection(this.state.objecten)} /> : "Loading..."
          }
      </div>
    )

  }

  componentDidMount() {

    const ApiEndpoint = 'ambities';

    // Connect With the API
    axiosAPI.get(ApiEndpoint)
    .then(res => {
        const objecten = res.data
        this.setState({ objecten })
    }).catch((error) => {
      if (error.response !== undefined) {
          if (error.response.status === 401) {
              localStorage.removeItem('access_token')
              this.props.history.push('/login')
          }
      } else {
          console.log(error)
      }
    })

  }

}
export default DateInput