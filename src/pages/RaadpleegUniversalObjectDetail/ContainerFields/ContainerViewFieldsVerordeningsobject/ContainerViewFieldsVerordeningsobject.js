import React, { Component } from 'react'

import ViewFieldTitelEnInhoud from './../../ViewFieldTitelEnInhoud'

class ContainerViewFieldsVerordeningsobject extends Component {
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

ContainerViewFieldsVerordeningsobject.propTypes = {}

ContainerViewFieldsVerordeningsobject.defaultProps = {}

export default ContainerViewFieldsVerordeningsobject
