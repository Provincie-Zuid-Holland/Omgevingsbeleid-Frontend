import React, { Component } from 'react'
import { toast } from 'react-toastify'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

/**
 * Class that renders a EigenaarsDriehoekItem component for the EigenaarsDriehoek component. It uses the states dataloaded and gebruikersObject within the component and functions.
 * The state dataLoaded is used within the componentDidMount function to set the state to true.
 * The state gebruikersObject is used to store data from the axios get request within the componentDidmount function and the data is then used within the rendered component.
 *
 * @class
 * @extends Component
 */
class EigenaarsDriehoekItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataLoaded: false,
            gebruikersObject: null,
        }
    }
    /**
     * Function to get gebruikers with the given UUID through axios.
     *
     * @function
     */
    componentDidMount() {
        axios
            .get(`/gebruikers/${this.props.UUID}`)
            .then((res) => {
                const dataObject = res.data
                this.setState({
                    gebruikersObject: dataObject,
                    dataLoaded: true,
                })
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    render() {
        return (
            <div className="w-full p-2 mb-2 bg-white rounded shadow-md">
                <div className="flex items-center">
                    <div className="flex items-center justify-center w-12 h-12 mr-2 rounded-full bg-secondary">
                        {this.state.gebruikersObject ? (
                            <span className="text-xl font-bold text-white">
                                {this.state.gebruikersObject.Gebruikersnaam.substring(
                                    0,
                                    1
                                ).toUpperCase()}
                            </span>
                        ) : null}
                    </div>
                    <div>
                        <span className="block text-sm text-gray-700">
                            {this.props.eigenaarType}
                        </span>
                        <span className="block text-sm font-bold text-gray-800">
                            {this.state.gebruikersObject
                                ? this.state.gebruikersObject.Gebruikersnaam
                                : null}
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

export default EigenaarsDriehoekItem
