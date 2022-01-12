import { Component } from 'react'

import ViewFieldTitelEnInhoud from '../../ViewFieldTitelEnInhoud'
import ViewFieldExternalURL from '../../ViewFieldExternalURL'

class ContainerViewFieldsBeleidsregel extends Component {
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
                <ViewFieldExternalURL externalURL={crudObject['Externe_URL']} />
            </>
        )
    }
}

export default ContainerViewFieldsBeleidsregel
