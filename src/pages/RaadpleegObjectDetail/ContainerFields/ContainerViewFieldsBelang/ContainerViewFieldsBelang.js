import React from "react"
import ViewFieldTitelEnInhoud from "../../ViewFieldTitelEnInhoud"

const ContainerViewFieldsBelang = ({ crudObject }) => {
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

export default ContainerViewFieldsBelang
