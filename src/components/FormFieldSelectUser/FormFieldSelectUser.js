import React from 'react'
import Select from 'react-select'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

// Import Components
import LoaderSelect from './../LoaderSelect'

function makeSelection(objectenArray, dataObjectProperty) {
    if (objectenArray.length === 1) {
        return null
    } else {
        let options = []
        objectenArray.slice(1).forEach(arrayItem => {
            options.push({
                label: arrayItem.Gebruikersnaam,
                value: arrayItem.UUID,
                target: {
                    type: 'relatie',
                    value: arrayItem.UUID,
                    name: dataObjectProperty,
                },
            })
        })
        return options
    }
}

class FormFieldSelectUser extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectionArray: [],
            selected: null,
            dataLoaded: false,
        }
    }

    render() {
        return (
            <div
                className={`mb-6 ${this.props.marginRight ? 'mr-8' : null} ${
                    this.props.halfWidth ? 'w-full mr-4' : 'w-1/2'
                }`}
            >
                <p className="form-field-description">{`${this.props.pValue}`}</p>
                {this.state.dataLoaded ? (
                    <Select
                        value={this.state.selected}
                        name={this.props.dataObjectProperty}
                        onChange={this.props.handleChange}
                        options={this.state.selectionArray}
                    />
                ) : (
                    <LoaderSelect />
                )}
            </div>
        )
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.fieldValue !== prevProps.fieldValue) {
            const selected = this.state.selectionArray.find(
                arrayItem => arrayItem.value === this.props.fieldValue
            )
            this.setState({
                selected: selected,
                dataLoaded: true,
            })
        }
    }

    componentDidMount() {
        const ApiEndpoint = 'gebruikers'

        const objecten = this.props.gebruikersLijst
        const selectionArray = makeSelection(
            objecten,
            this.props.dataObjectProperty
        )

        if (this.props.editStatus === true) {
            const selected = selectionArray.find(
                arrayItem => arrayItem.value === this.props.fieldValue
            )

            this.setState({
                selectionArray: selectionArray,
                selected: selected,
                dataLoaded: true,
            })
        } else {
            this.setState({ selectionArray: selectionArray, dataLoaded: true })
        }
    }

    // componentDidMount() {
    //     console.log('this.props.gebruikersLijst')
    //     console.log(this.props.gebruikersLijst)
    //     const selectionArray = makeSelection(
    //         this.props.gebruikersLijst,
    //         this.props.dataObjectProperty
    //     )
    //     if (this.props.editStatus === true) {
    //         const selected = selectionArray.find(
    //             arrayItem => arrayItem.value === this.props.fieldValue
    //         )
    //         this.setState({
    //             selectionArray,
    //             selected,
    //         })
    //     } else {
    //         this.setState({ selectionArray })
    //     }

    //     // if (this.props.editStatus === true) {
    //     //     const selected = this.props.gebruikersLijst.find(
    //     //         arrayItem => arrayItem.value === this.props.fieldValue
    //     //     )
    //     //     this.setState({
    //     //         selected: selected,
    //     //     })
    //     // }
    // }
}
export default FormFieldSelectUser
