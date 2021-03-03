import React from 'react'

// Pages met aparte container:
// /pages/Login
// /pages/MuteerUniversalObjectCRUD/ContainerMain
// /components/Navigation

/**
 * Component that renders a ContainerMain component that contains a div containing a id or without with props.children, depending if the props.id contains a value.
 * This component is used within the following pages:
 * MuteerBeleidsrelaties,
 * ContainerCrudFields,
 * MuteerDashboard,
 * MuteerMeldingen,
 * MuteerMijnAccount,
 * MuteerMijnBeleid,
 * MuteerUniversalObjectCRUD,
 * MuteerUniversalObjectDetail,
 * MuteerUniversalObjectDetailWithStatuses,
 * MuteerUniversalObjectOverzicht,
 * ContainerCrudFields,
 * MuteerVerordeningenstructuurDetail,
 * Afdeling,
 * Paragraaf,
 * MuteerVerordeningenstructuurOverzicht.
 *
 * @component
 *
 * @param {props} props - Parameter that contains a collection of values used to see if it contains an id to show a div with id and props.children or without the id.
 */

function ContainerMain(props) {
    return props.id ? (
        <div
            className="container flex pb-8 mx-auto sm:px-6 lg:px-8"
            id={props.id}
        >
            {props.children}
        </div>
    ) : (
        <div className="container flex pb-8 mx-auto sm:px-6 lg:px-8">
            {props.children}
        </div>
    )
}

export default ContainerMain
