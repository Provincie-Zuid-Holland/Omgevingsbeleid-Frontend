import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ViewFieldTitelEnInhoud from './../../ViewFieldTitelEnInhoud'
import ViewFieldTags from './../../ViewFieldTags'

class ContainerViewFieldsBeleidsbeslissing extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const crudObject = this.props.crudObject
        return (
            <React.Fragment>
                {crudObject['Omschrijving_Keuze'] !== undefined ? (
                    <ViewFieldTitelEnInhoud
                        fieldTitel="Wat wil de provincie bereiken?"
                        fieldValue={crudObject['Omschrijving_Keuze']}
                    />
                ) : null}

                {crudObject['Omschrijving_Werking'] !== undefined ? (
                    <ViewFieldTitelEnInhoud
                        fieldTitel="Werking"
                        fieldValue={crudObject['Omschrijving_Werking']}
                    />
                ) : null}

                {crudObject['Aanleiding'] !== undefined ? (
                    <ViewFieldTitelEnInhoud
                        fieldTitel="Aanleiding"
                        fieldValue={crudObject['Aanleiding']}
                    />
                ) : null}

                {crudObject['Afweging'] !== undefined ? (
                    <ViewFieldTitelEnInhoud
                        fieldTitel="Afwegingen"
                        fieldValue={crudObject['Afweging']}
                    />
                ) : null}

                {crudObject['Provinciaal_Belang'] !== undefined ? (
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

ContainerViewFieldsBeleidsbeslissing.propTypes = {}

ContainerViewFieldsBeleidsbeslissing.defaultProps = {}

export default ContainerViewFieldsBeleidsbeslissing
