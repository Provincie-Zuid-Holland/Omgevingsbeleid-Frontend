import { useCallback, useContext, useLayoutEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

// Import Componenents
import axios from '../../api/axios'
import UserContext from './../../App/UserContext'
import ButtonAddNewObject from './../../components/ButtonAddNewObject'
import CardObjectDetails from './../../components/CardObjectDetails'
import { ContainerMain } from './../../components/Container'
import { LoaderCard } from './../../components/Loader'
import SidebarMain from './../../components/SidebarMain'
import filterOutArchivedObjects from './../../utils/filterOutArchivedObjects'

// Import Axios instance to connect with the API

// Import user context

/**
 * A component to display all the objects from a specific dimension
 * @param {Object} dimensieConstants - Contains the variables of the dimension
 */
const MuteerUniversalObjectOverzicht = ({
    dimensieConstants,
    hideAddObject,
}) => {
    const { user } = useContext(UserContext)

    const [objecten, setObjecten] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    let history = useHistory()

    const getAndSetDataFromAPI = ApiEndpoint => {
        axios
            .get(ApiEndpoint)
            .then(res => {
                let objecten = filterOutArchivedObjects(res.data)
                setObjecten(objecten)
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    const checkAuth = useCallback(() => {
        if (!user) return

        const gebruikersRol = user.Rol
        if (
            gebruikersRol === 'Beheerder' ||
            gebruikersRol === 'Functioneel beheerder' ||
            gebruikersRol === 'Technisch beheerder' ||
            gebruikersRol === 'Test runner' ||
            gebruikersRol === 'Tester'
        )
            return

        history.push('/muteer/mijn-beleid')
    }, [user, history])

    useLayoutEffect(() => {
        const apiEndpoint = dimensieConstants.API_ENDPOINT
        getAndSetDataFromAPI(apiEndpoint)

        // The only page that is allowed for nonAuth users is the Beleidsmodules page
        const isBeleidsmodulePage =
            dimensieConstants.TITLE_SINGULAR === 'Beleidsmodule'

        if (!isBeleidsmodulePage) {
            checkAuth()
        }
    }, [user, checkAuth, dimensieConstants])

    const titleSingular = dimensieConstants.TITLE_SINGULAR
    const titelMeervoud = dimensieConstants.TITLE_PLURAL
    const overzichtSlug = dimensieConstants.SLUG_OVERVIEW
    const createNewSlug = dimensieConstants.SLUG_CREATE_NEW
    const hoofdOnderdeelSlug = dimensieConstants.SLUG_OVERVIEW

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

                {!isLoading ? (
                    <ul className="flex flex-wrap mt-8">
                        {hideAddObject ? null : (
                            <ButtonAddNewObject
                                titleSingular={titleSingular}
                                createNewSlug={createNewSlug}
                                hoofdOnderdeelSlug={hoofdOnderdeelSlug}
                            />
                        )}

                        {objecten
                            .sort((a, b) => (a.Titel > b.Titel ? 1 : -1))
                            .map((object, index) => (
                                <li
                                    key={object.ID}
                                    className="w-full mb-6 display-inline">
                                    <CardObjectDetails
                                        index={index}
                                        object={object}
                                        overzichtSlug={overzichtSlug}
                                        titleSingular={titleSingular}
                                        hoofdOnderdeelSlug={overzichtSlug}
                                    />
                                </li>
                            ))}
                    </ul>
                ) : (
                    <>
                        <LoaderCard />
                        <LoaderCard />
                        <LoaderCard />
                    </>
                )}
            </div>
        </ContainerMain>
    )
}

export default MuteerUniversalObjectOverzicht
