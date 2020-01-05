import React, { Component } from 'react'
import ViewFieldTitelEnInhoud from './../../ViewFieldTitelEnInhoud'
import ViewFieldTags from './../../ViewFieldTags'

class ContainerViewFieldsBeleidsbeslissing extends Component {
    render() {
        const crudObject = this.props.crudObject
        return (
            <React.Fragment>
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

export default ContainerViewFieldsBeleidsbeslissing
