import { Component } from 'react'

import UserContext from '../../../../App/UserContext'
import ViewFieldIngelogdExtraInfo from '../../../../components/ViewFieldIngelogdExtraInfo'
import ViewFieldInnerHTML from '../../ViewFieldInnerHTML'

class ContainerViewFieldsMaatregel extends Component {
    render() {
        const crudObject = this.props.crudObject
        return (
            <UserContext.Consumer>
                {context => (
                    <>
                        {context && context.user ? (
                            <ViewFieldIngelogdExtraInfo
                                className="mb-5"
                                crudObject={crudObject}
                            />
                        ) : null}
                        {crudObject['Toelichting'] !== undefined ? (
                            <ViewFieldInnerHTML
                                html={crudObject['Toelichting']}
                            />
                        ) : null}
                    </>
                )}
            </UserContext.Consumer>
        )
    }
}

export default ContainerViewFieldsMaatregel
