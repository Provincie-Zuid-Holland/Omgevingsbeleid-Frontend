import { Component } from 'react'
import { Helmet } from 'react-helmet'
import { withRouter } from 'react-router-dom'
import { toast } from 'react-toastify'

import axios from '../../apiNew/axios'
// Import Components
import ButtonBackToPage from './../../components/ButtonBackToPage'
import isEndDateBeforeStartDate from './../../utils/isEndDateBeforeStartDate'
// Create Context
import APIcontext from './APIContext'
import ContainerCrudFields from './ContainerCrudFields'

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
    }

    componentDidMount() {
        const UUID = this.props.match.params.UUID
        axios
            .get(`version/beleidskeuzes/${UUID}`)
            .then(res =>
                this.setState({
                    Van_Beleidskeuze_Titel: res.data.Titel,
                })
            )
            .catch(err => {
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

        this.setState(prevState => ({
            crudObject: {
                ...prevState.crudObject,
                [name]: value,
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
            isEndDateBeforeStartDate(this.props.dataModel.TITLE_SINGULAR, {
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
            .catch(err => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
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
            handleChange: this.handleChange,
            crudObject: this.state.crudObject,
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
