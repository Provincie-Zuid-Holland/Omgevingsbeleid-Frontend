import React from "react"
import ViewFieldTitelEnInhoud from "../../ViewFieldTitelEnInhoud"

const ContainerViewFieldsAmbitie = ({ crudObject }) => {
    return (
        <React.Fragment>
            {crudObject["Omschrijving"] !== undefined ? (
                <ViewFieldTitelEnInhoud
                    fieldTitel="Omschrijving"
                    fieldValue={crudObject["Omschrijving"]}
                />
            ) : null}
        </React.Fragment>
    )
}

export default ContainerViewFieldsAmbitie
