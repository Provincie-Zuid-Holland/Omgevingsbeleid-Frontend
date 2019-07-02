import React from 'react';
import Select from 'react-select'
import axiosAPI from '../../../API/axios'


function makeSelection(objectenArray, dataObjectProperty) {

  if (objectenArray.length === 1) {
    return null
  } else {
    let options = []
    objectenArray.slice(1).forEach((arrayItem, index) => {
      // Index om unieke values te hebben (puur voor het testen)
      options.push({
        label: arrayItem.Titel,
        value: `00000000-0000-0000-0000-000000000000`,
        target: {
          type: "relatie",
          value: `00000000-0000-0000-0000-000000000000`,
          name: dataObjectProperty
        }
      })
    })
    return options
  }

}


class DateInput extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectionArray: [],
      selected: {}
    }
  }

  render() {

    return (
      <div className="w-50 px-3 mb-6">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={this.props.dataObjectProperty}>
            {this.props.fieldLabel}
          </label>
          {
            this.state.selectionArray.length !== 0 
            ? <Select
              value={this.state.selected}
              onChange={this.props.handleChange}
              options={this.state.selectionArray}
            /> 
            : "Loading..."
          }
      </div>
    )
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.fieldValue !== prevProps.fieldValue) {
      const selected = this.state.selectionArray.find( arrayItem => arrayItem.value === this.props.fieldValue)
      this.setState({
        selected: selected
      })
    }
  }

  componentDidMount() {

    const ApiEndpoint = 'ambities';

    // Connect With the API
    axiosAPI.get(ApiEndpoint)
    .then(res => {
      const objecten = res.data
      const selectionArray = makeSelection(objecten, this.props.dataObjectProperty)

      if (this.props.editStatus === true) {
        const selected = selectionArray.find( arrayItem => arrayItem.value === this.props.fieldValue)
        this.setState({
          selectionArray,
          selected
        })
      } else {
        this.setState({ selectionArray })
      }

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