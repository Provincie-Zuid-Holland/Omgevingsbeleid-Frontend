import React, { Component } from 'react'

import ViewFieldTitelEnInhoud from './../../ViewFieldTitelEnInhoud'
import ViewFieldTags from './../../ViewFieldTags'
import ViewFieldBelangen from './../../ViewFieldBelangen'
import ViewFieldIngelogdExtraInfo from './../../ViewFieldIngelogdExtraInfo'

import WrapperUserInfo from './../../../../components/WrapperUserInfo'

class ContainerViewFieldsBeleidsbeslissing extends Component {
    render() {
        console.log(this.props)
        const crudObject = this.props.crudObject
        return (
            <React.Fragment>
                {this.props.user !== null ? (
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
                {crudObject['Aanleiding'] ? (
                    <ViewFieldTitelEnInhoud
                        fieldTitel="Aanleiding"
                        fieldValue={crudObject['Aanleiding']}
                    />
                ) : null}
                {crudObject['Afweging'] ? (
                    <ViewFieldTitelEnInhoud
                        fieldTitel="Afwegingen"
                        fieldValue={crudObject['Afweging']}
                    />
                ) : null}
                {crudObject['Provinciaal_Belang'] ? (
                    <ViewFieldTitelEnInhoud
                        fieldTitel="Provinciaal belang"
                        fieldValue={crudObject['Provinciaal_Belang']}
                    />
                ) : null}
                {crudObject['Belangen'] && crudObject['Belangen'].length > 0 ? (
                    <ViewFieldBelangen fieldValue={crudObject['Belangen']} />
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
        )
    }
}

export default WrapperUserInfo(ContainerViewFieldsBeleidsbeslissing)
