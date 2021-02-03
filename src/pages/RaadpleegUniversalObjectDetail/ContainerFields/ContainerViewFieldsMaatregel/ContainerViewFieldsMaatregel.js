import React, { Component } from 'react'
import ViewFieldTitelEnInhoud from './../../ViewFieldTitelEnInhoud'
import ViewFieldInnerHTML from './../../ViewFieldInnerHTML'

class ContainerViewFieldsMaatregel extends Component {
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
                {crudObject['Toelichting'] !== undefined ? (
                    <ViewFieldInnerHTML html={crudObject['Toelichting']} />
                ) : null}
            </React.Fragment>
        )
    }
}

export default ContainerViewFieldsMaatregel
