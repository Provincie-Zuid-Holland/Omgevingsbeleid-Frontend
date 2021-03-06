import React, { Component } from 'react'
import ViewFieldTitelEnInhoud from './../../ViewFieldTitelEnInhoud'

class ContainerViewFieldsBelang extends Component {
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

export default ContainerViewFieldsBelang
