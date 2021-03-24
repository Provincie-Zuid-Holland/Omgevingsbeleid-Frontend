import React, { Component } from 'react'
import { toast } from 'react-toastify'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

// Import Components
import ContainerCrudFields from './ContainerCrudFields'
import ButtonBackToPage from './../../components/ButtonBackToPage'

import eindDateIsBeforeBeginDate from './../../utils/eindDateIsBeforeBeginDate'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

// Create Context
import APIcontext from './APIContext'

/**
 * @returns The CRUD page for beleidsrelaties
 */
class MuteerBeleidsrelatiesCRUD extends Component {
    constructor(props) {
        super(props)
        // CrudObject contains the editable fields
        this.state = {
            crudObject: {
                Begin_Geldigheid: '',
                Eind_Geldigheid: '',
                Naar_Beleidskeuze: '',
                Omschrijving: '',
                Titel: '',
                Van_Beleidskeuze: this.props.match.params.UUID,
                Status: 'Open',
                Aanvraag_Datum: new Date(),
            },
            Van_Beleidskeuze_Titel: '...',
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setEditorState = this.setEditorState.bind(this)
        this.voegKoppelingRelatieToe = this.voegKoppelingRelatieToe.bind(this)
        this.wijzigKoppelingRelatie = this.wijzigKoppelingRelatie.bind(this)
        this.verwijderKoppelingRelatieToe = this.verwijderKoppelingRelatieToe.bind(
            this
        )
    }

    componentDidMount() {
        const UUID = this.props.match.params.UUID
        axios
            .get(`version/beleidskeuzes/${UUID}`)
            .then((res) =>
                this.setState({
                    Van_Beleidskeuze_Titel: res.data.Titel,
                })
            )
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    handleChange(event) {
        const name = event.target.name
        const type = event.target.type

        let value = event.target.value
        if (type === 'date') {
            value = event.target.value
        }

        this.setState((prevState) => ({
            crudObject: {
                ...prevState.crudObject,
                [name]: value,
            },
        }))
    }

    // Algemene State Handler voor de Editor
    setEditorState(stateValue, fieldName) {
        this.setState((prevState) => ({
            crudObject: {
                ...prevState.crudObject,
                [fieldName]: stateValue,
            },
        }))
    }

    validateDate(dateObject) {
        if (Object.prototype.toString.call(dateObject) === '[object Date]') {
            // it is a date
            if (isNaN(dateObject.getTime())) {
                // date is not valid
                return false
            } else {
                // date is valid
                return true
            }
        } else {
            // not a date
            return false
        }
    }

    handleSubmit(event) {
        event.preventDefault()

        let crudObject = this.state.crudObject

        if (
            crudObject.Naar_Beleidskeuze === '' ||
            !crudObject.Naar_Beleidskeuze
        ) {
            toast('Selecteer een beleidskeuze')
            return
        }
        if (!this.validateDate(new Date(crudObject.Begin_Geldigheid))) {
            toast('Vul een inwerkingtreding datum in')
            return
        }

        if (!this.validateDate(new Date(crudObject.Eind_Geldigheid))) {
            toast('Vul een uitwerkingtreding datum in')
            return
        }

        if (
            eindDateIsBeforeBeginDate(this.props.dataModel.TITLE_SINGULAR, {
                Begin_Geldigheid: new Date(crudObject.Begin_Geldigheid),
                Eind_Geldigheid: new Date(crudObject.Eind_Geldigheid),
            })
        ) {
            return
        }

        crudObject.Begin_Geldigheid = new Date(crudObject.Begin_Geldigheid)
        crudObject.Eind_Geldigheid = new Date(crudObject.Eind_Geldigheid)

        axios
            .post(`/beleidsrelaties`, JSON.stringify(crudObject))
            .then(() => {
                this.props.history.push(
                    `/muteer/beleidsrelaties/${this.props.match.params.UUID}`
                )
                toast('Opgeslagen')
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    voegKoppelingRelatieToe(propertyName, object, omschrijving) {
        const nieuwObject = {
            UUID: object.UUID,
            Omschrijving: omschrijving,
        }

        // let nieuweArray = this.state.crudObject[propertyName]
        let nieuwCrudObject = this.state.crudObject
        // Als de relatie Array nog niet initialized is, maak deze aan
        if (typeof nieuwCrudObject[propertyName] === 'string') {
            nieuwCrudObject[propertyName] = []
        }
        nieuwCrudObject[propertyName].push(nieuwObject)

        this.setState(
            {
                crudObject: nieuwCrudObject,
            },
            () => toast('Koppeling toegevoegd')
        )
    }

    wijzigKoppelingRelatie(koppelingObject, nieuweOmschrijving) {
        let nieuwCrudObject = this.state.crudObject
        const index = nieuwCrudObject[koppelingObject.propertyName].findIndex(
            (item) => item.UUID === koppelingObject.item.UUID
        )
        nieuwCrudObject[koppelingObject.propertyName][
            index
        ].Omschrijving = nieuweOmschrijving

        this.setState(
            {
                crudObject: nieuwCrudObject,
            },
            () => toast('Koppeling gewijzigd')
        )
    }

    verwijderKoppelingRelatieToe(koppelingObject) {
        let nieuwCrudObject = this.state.crudObject
        const index = nieuwCrudObject[koppelingObject.propertyName].findIndex(
            (item) => item.UUID === koppelingObject.item.UUID
        )
        nieuwCrudObject[koppelingObject.propertyName].splice(index, 1)

        this.setState(
            {
                crudObject: nieuwCrudObject,
            },
            () => toast('Koppeling verwijderd')
        )
    }

    render() {
        const contextObject = {
            objectUUID: this.state.UUID,
            titleSingular: this.props.dataModel.TITLE_SINGULAR,
            titelMeervoud: this.props.dataModel.TITLE_PLURAL,
            overzichtSlug: this.props.overzichtSlug,
            objectID: this.props.match.params.single,
            editStatus: this.state.edit,
            handleSubmit: this.handleSubmit,
            voegKoppelingRelatieToe: this.voegKoppelingRelatieToe,
            wijzigKoppelingRelatie: this.wijzigKoppelingRelatie,
            verwijderKoppelingRelatieToe: this.verwijderKoppelingRelatieToe,
            handleChange: this.handleChange,
            crudObject: this.state.crudObject,
            setEditorState: this.setEditorState,
            Van_Beleidskeuze_Titel: this.state.Van_Beleidskeuze_Titel,
            Van_Beleidskeuze_UUID: this.props.match.params.UUID,
        }

        return (
            <div>
                <Helmet>
                    <title>
                        {contextObject.editStatus
                            ? `Omgevingsbeleid - Wijzig ${
                                  contextObject.titleSingular
                              }${' '}
                            ${contextObject.objectID}`
                            : `Omgevingsbeleid - Voeg een nieuwe${' '}
                            ${contextObject.titleSingular}${' '}
                              toe`}
                    </title>
                </Helmet>
                <div className="relative w-full px-6 py-32 bg-pzh-blue edit-header">
                    <div className="container flex items-center justify-center mx-auto lg:px-10">
                        <div className="w-full pr-20">
                            <ButtonBackToPage
                                terugNaar={`beleidsrelatie`}
                                color="text-white"
                                url={`/muteer/beleidsrelaties/${this.props.match.params.UUID}`}
                            />
                            <h1 className="text-4xl text-white">
                                Voeg een nieuwe beleidsrelatie toe
                            </h1>
                        </div>
                    </div>
                </div>
                <APIcontext.Provider value={contextObject}>
                    <ContainerCrudFields />
                </APIcontext.Provider>
            </div>
        )
    }
}

export default withRouter(MuteerBeleidsrelatiesCRUD)
