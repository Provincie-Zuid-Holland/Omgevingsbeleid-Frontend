import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ViewFieldTitelEnInhoud from './../../ViewFieldTitelEnInhoud'
import ViewFieldTags from './../../ViewFieldTags'

class ContainerViewFieldsAmbitie extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const crudObject = this.props.crudObject
        return (
            <React.Fragment>
                {crudObject['Omschrijving'] !== undefined ? (
                    <ViewFieldTitelEnInhoud
                        fieldTitel="Omschrijving"
                        fieldValue={crudObject['Omschrijving']}
                    />
                ) : null}
            </React.Fragment>
        )
    }
}

export default ContainerViewFieldsAmbitie
