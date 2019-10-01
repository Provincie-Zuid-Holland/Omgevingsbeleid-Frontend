import React, { Component } from 'react'
import PropTypes from 'prop-types'

// Import Axios instance to connect with the API
import axios from '../../../API/axios'

class EigenaarsDriehoekItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataLoaded: false,
            gebruikersObject: null,
        }
    }

    componentDidMount() {
        console.log('this.props.UUID')
        console.log(this.props.UUID)
        axios
            .get(`/gebruikers/${this.props.UUID}`)
            .then(res => {
                const dataObject = res.data
                console.log(dataObject)
                this.setState({
                    gebruikersObject: dataObject,
                    dataLoaded: true,
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        return (
            <div className="bg-white shadow-md p-2 w-full rounded mb-2">
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-full mr-2" />
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

EigenaarsDriehoekItem.propTypes = {}

EigenaarsDriehoekItem.defaultProps = {}

export default EigenaarsDriehoekItem
