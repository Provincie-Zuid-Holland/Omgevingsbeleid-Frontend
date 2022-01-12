import { Component } from 'react'
import ViewFieldTitelEnInhoud from '../../ViewFieldTitelEnInhoud'

class ContainerViewFieldsBeleidsprestatie extends Component {
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

export default ContainerViewFieldsBeleidsprestatie
