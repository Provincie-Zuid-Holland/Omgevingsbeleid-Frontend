import React from 'react'

import ViewFieldTitelEnInhoud from './../../ViewFieldTitelEnInhoud'
import ViewFieldTags from './../../ViewFieldTags'
import ViewFieldBelangen from './../../ViewFieldBelangen'
import ViewFieldIngelogdExtraInfo from './../../ViewFieldIngelogdExtraInfo'

import UserContext from './../../../../App/UserContext'

const ContainerViewFieldsBeleidskeuze = ({ crudObject }) => {
    return (
        <UserContext.Consumer>
            {(context) => (
                <React.Fragment>
                    {context && context.user ? (
                        <ViewFieldIngelogdExtraInfo crudObject={crudObject} />
                    ) : null}
                    {crudObject['Omschrijving_Keuze'] ? (
                        <ViewFieldTitelEnInhoud
                            fieldTitel="Wat wil de provincie bereiken?"
                            fieldValue={crudObject['Omschrijving_Keuze']}
                        />
                    ) : null}
                    {crudObject['Omschrijving_Werking'] ? (
                        <ViewFieldTitelEnInhoud
                            fieldTitel="Werking"
                            fieldValue={crudObject['Omschrijving_Werking']}
                        />
                    ) : null}
                    {crudObject['Afweging'] ? (
                        <ViewFieldTitelEnInhoud
                            fieldTitel="Afweging"
                            fieldValue={crudObject['Afweging']}
                        />
                    ) : null}
                    {crudObject['Aanleiding'] ? (
                        <ViewFieldTitelEnInhoud
                            fieldTitel="Aanleiding"
                            fieldValue={crudObject['Aanleiding']}
                        />
                    ) : null}
                    {crudObject['Provinciaal_Belang'] ? (
                        <ViewFieldTitelEnInhoud
                            fieldTitel="Provinciaal belang"
                            fieldValue={crudObject['Provinciaal_Belang']}
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
