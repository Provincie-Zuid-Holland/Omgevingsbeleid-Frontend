import { Component } from 'react'

import ViewFieldTitelEnInhoud from './../../ViewFieldTitelEnInhoud'

class ContainerViewFieldsVerordeningsobject extends Component {
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

ContainerViewFieldsVerordeningsobject.propTypes = {}

ContainerViewFieldsVerordeningsobject.defaultProps = {}

export default ContainerViewFieldsVerordeningsobject
