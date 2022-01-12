import { Component } from 'react'
import ViewFieldTitelEnInhoud from '../../ViewFieldTitelEnInhoud'

class ContainerViewFieldsThema extends Component {
    render() {
        const crudObject = this.props.crudObject
        return (
            <>
                {crudObject['Omschrijving'] !== undefined ? (
                    <ViewFieldTitelEnInhoud
                        fieldTitel="Omschrijving"
                        fieldValue={crudObject['Omschrijving']}
                    />
                ) : null}
            </>
        )
    }
}

export default ContainerViewFieldsThema
