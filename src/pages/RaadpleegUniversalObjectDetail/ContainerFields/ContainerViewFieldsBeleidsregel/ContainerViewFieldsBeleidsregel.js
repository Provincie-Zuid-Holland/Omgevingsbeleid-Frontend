import React, { Component } from "react"

import ViewFieldTitelEnInhoud from "./../../ViewFieldTitelEnInhoud"
import ViewFieldExternalURL from "./../../ViewFieldExternalURL"

class ContainerViewFieldsBeleidsregel extends Component {
    render() {
        const crudObject = this.props.crudObject
        return (
            <React.Fragment>
                {crudObject["Omschrijving"] !== undefined ? (
                    <ViewFieldTitelEnInhoud
                        fieldTitel="Omschrijving"
                        fieldValue={crudObject["Omschrijving"]}
                    />
                ) : null}
                <ViewFieldExternalURL externalURL={crudObject["Externe_URL"]} />
            </React.Fragment>
        )
    }
}

export default ContainerViewFieldsBeleidsregel
