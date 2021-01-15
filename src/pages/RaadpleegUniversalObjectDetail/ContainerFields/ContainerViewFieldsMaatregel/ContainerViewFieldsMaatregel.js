import React, { Component } from 'react'
import ViewFieldInnerHTML from './../../ViewFieldInnerHTML'

class ContainerViewFieldsMaatregel extends Component {
    render() {
        const crudObject = this.props.crudObject
        return (
            <React.Fragment>
                {crudObject['Toelichting'] !== undefined ? (
                    <ViewFieldInnerHTML html={crudObject['Toelichting']} />
                ) : null}
            </React.Fragment>
        )
    }
}

export default ContainerViewFieldsMaatregel
