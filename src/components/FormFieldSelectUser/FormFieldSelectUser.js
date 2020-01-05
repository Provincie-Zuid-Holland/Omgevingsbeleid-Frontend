import React from 'react'
import Select from 'react-select'

// Import Components
import LoaderSelect from './../LoaderSelect'

function makeSelection(objectenArray, dataObjectProperty) {
    if (objectenArray.length === 0) {
        return []
    } else {
        let options = []
        objectenArray.forEach(arrayItem => {
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
                        id={`form-field-${this.props.titelEnkelvoud.toLowerCase()}-${this.props.dataObjectProperty.toLowerCase()}`}
                        name={this.props.dataObjectProperty}
                        value={this.state.selected}
                        onChange={(e, metaInfo) =>
                            this.props.handleChange(
                                e,
                                metaInfo,
                                this.props.dataObjectProperty
                            )
                        }
                        isClearable={true}
                        options={this.state.selectionArray}
                        placeholder={`Selecteer...`}
                    ></Select>
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
        const objecten = this.props.gebruikersLijst
            .sort((a, b) => (a.Gebruikersnaam > b.Gebruikersnaam ? 1 : -1))
            .filter(e => e.Rol === this.props.filter)

        const selectionArray = makeSelection(
            objecten,
            this.props.dataObjectProperty
        )

        if (this.props.editStatus === true && selectionArray) {
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
}
export default FormFieldSelectUser
