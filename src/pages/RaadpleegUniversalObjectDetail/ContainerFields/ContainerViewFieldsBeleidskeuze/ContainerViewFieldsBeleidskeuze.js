import React from 'react'

import ViewFieldTitelEnInhoud from './../../ViewFieldTitelEnInhoud'
import ViewFieldTags from './../../ViewFieldTags'
import ViewFieldBelangen from './../../ViewFieldBelangen'
import ViewFieldIngelogdExtraInfo from '../../../../components/ViewFieldIngelogdExtraInfo'
import ViewFieldInnerHTML from './../../ViewFieldInnerHTML'

import UserContext from './../../../../App/UserContext'

const ContainerViewFieldsBeleidskeuze = ({ crudObject }) => {
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
                    {crudObject['Omschrijving_Keuze'] ? (
                        <ViewFieldInnerHTML
                            fieldTitel="Wat wil de provincie bereiken?"
                            html={crudObject['Omschrijving_Keuze']}
                        />
                    ) : null}
                    {crudObject['Afweging'] ? (
                        <ViewFieldInnerHTML
                            fieldTitel="Afweging"
                            html={crudObject['Afweging']}
                        />
                    ) : null}
                    {crudObject['Aanleiding'] ? (
                        <ViewFieldInnerHTML
                            fieldTitel="Aanleiding"
                            html={crudObject['Aanleiding']}
                        />
                    ) : null}
                    {crudObject['Provinciaal_Belang'] ? (
                        <ViewFieldInnerHTML
                            fieldTitel="Provinciaal belang"
                            html={crudObject['Provinciaal_Belang']}
                        />
                    ) : null}
                    {crudObject['Omschrijving_Werking'] ? (
                        <ViewFieldInnerHTML
                            fieldTitel="Toelichting"
                            html={crudObject['Omschrijving_Werking']}
                        />
                    ) : null}
                    {crudObject['Belangen'] &&
                    crudObject['Belangen'].length > 0 ? (
                        <ViewFieldBelangen
                            fieldValue={crudObject['Belangen']}
                        />
                    ) : null}
                    {crudObject['Tags'] !== undefined &&
                    crudObject['Tags'] !== null &&
                    crudObject['Tags'] !== '' ? (
                        <ViewFieldTags
                            fieldTitel="Tags"
                            fieldValue={crudObject['Tags']}
                        />
                    ) : null}
                </React.Fragment>
            )}
        </UserContext.Consumer>
    )
}

export default ContainerViewFieldsBeleidskeuze
