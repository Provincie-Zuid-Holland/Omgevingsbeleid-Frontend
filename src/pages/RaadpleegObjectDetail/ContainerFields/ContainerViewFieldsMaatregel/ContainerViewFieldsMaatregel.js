import React, { Component } from "react"

import ViewFieldInnerHTML from "../../ViewFieldInnerHTML"

import ViewFieldIngelogdExtraInfo from "../../../../components/ViewFieldIngelogdExtraInfo"

import UserContext from "../../../../App/UserContext"

class ContainerViewFieldsMaatregel extends Component {
    render() {
        const crudObject = this.props.crudObject
        return (
            <UserContext.Consumer>
                {(context) => (
                    <React.Fragment>
                        {context && context.user ? (
                            <ViewFieldIngelogdExtraInfo
                                className="mb-5"
                                crudObject={crudObject}
                            />
                        ) : null}
                        {crudObject["Toelichting"] !== undefined ? (
                            <ViewFieldInnerHTML
                                html={crudObject["Toelichting"]}
                            />
                        ) : null}
                    </React.Fragment>
                )}
            </UserContext.Consumer>
        )
    }
}

export default ContainerViewFieldsMaatregel