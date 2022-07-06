/* istanbul ignore file */
import { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

// Import Componenents
import axios from '../../../api/instance'
import CardObjectDetails from './../../../components/CardObjectDetails'
import { ContainerMain } from './../../../components/Container'
import { LoaderCard } from './../../../components/Loader'
import SidebarMain from './../../../components/SidebarMain'

/**
 * Component to display all the verordening structures that exist
 */
class VerordeningenstructuurOverzicht extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataReceived: false,
            objecten: [],
        }
    }

    getDataFromAPI(ApiEndpoint) {
        // Connect With the API
        axios
            .get(ApiEndpoint)
            .then(res => {
                let objecten = res.data

                this.setState({
                    objecten: objecten,
                    dataReceived: true,
                })
            })
            .catch(err => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
                this.setState({
                    dataReceived: true,
                })
            })
    }

    componentDidMount() {
        const ApiEndpoint = this.props.dataModel.API_ENDPOINT
        this.getDataFromAPI(ApiEndpoint)
    }

    render() {
        const titleSingular = this.props.dataModel.TITLE_SINGULAR
        const titelMeervoud = this.props.dataModel.TITLE_PLURAL
        const overzichtSlug = this.props.dataModel.SLUG_OVERVIEW
        const hoofdOnderdeelSlug = this.props.dataModel.SLUG_OVERVIEW

        return (
            <ContainerMain>
                <Helmet>
                    <title>Omgevingsbeleid - {'Beheer ' + titelMeervoud}</title>
                </Helmet>

                {/* Sidebar */}
                <SidebarMain />

                {/* Container */}
                <div className="flex-grow inline-block w-3/4 pl-8 rounded">
                    <h2 className="mb-4 text-gray-800">{titelMeervoud}</h2>

                    <ul className="flex flex-wrap mt-8">
                        {this.state.dataReceived ? (
                            <div
                                className={`mb-6 display-inline mb-6 display-inline w-full`}>
                                <Link
                                    id={`object-add-new-${hoofdOnderdeelSlug.toLowerCase()}`}
                                    className="flex items-center justify-center h-full px-4 py-4 overflow-hidden text-gray-600 no-underline border border-gray-300 border-dashed rounded hover:border-gray-400 transition-regular hover:text-gray-800"
                                    to={`/muteer/verordeningen/nieuw`}>
                                    <span className="px-4 py-2 font-bold text-center">
                                        + Voeg {titleSingular} Toe
                                    </span>
                                </Link>
                            </div>
                        ) : null}
                        {this.state.dataReceived ? (
                            this.state.objecten
                                .sort((a, b) => (a.Titel > b.Titel ? 1 : -1))
                                .map((object, index) => (
                                    <li
                                        key={object.ID}
                                        className="w-full mb-6 display-inline">
                                        {
                                            <CardObjectDetails
                                                index={index}
                                                object={object}
                                                overzichtSlug={overzichtSlug}
                                                titleSingular={titleSingular}
                                                hoofdOnderdeelSlug={
                                                    overzichtSlug
                                                }
                                            />
                                        }
                                    </li>
                                ))
                        ) : (
                            <>
                                <LoaderCard />
                                <LoaderCard />
                                <LoaderCard />
                            </>
                        )}
                    </ul>
                </div>
            </ContainerMain>
        )
    }
}

export default VerordeningenstructuurOverzicht
