import React from "react"
import { Helmet } from "react-helmet"
import { toast } from "react-toastify"
import { useHistory } from "react-router-dom"
import { isBefore, isValid } from "date-fns"

// Import Componenents
import ContainerMain from "./../../components/ContainerMain"
import SidebarMain from "./../../components/SidebarMain"
import ButtonAddNewObject from "./../../components/ButtonAddNewObject"
import CardObjectDetails from "./../../components/CardObjectDetails"
import LoaderCard from "./../../components/LoaderCard"

// Import Axios instance to connect with the API
import axios from "./../../API/axios"

// Import user context
import UserContext from "./../../App/UserContext"

/**
 * A component to display all the objects from a specific dimension
 * @param {Object} dimensieConstants - Contains the variables of the dimension
 */
const MuteerUniversalObjectOverzicht = ({ dimensieConstants }) => {
    const { user } = React.useContext(UserContext)

    const [objecten, setObjecten] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)

    let history = useHistory()

    const getAndSetDataFromAPI = (ApiEndpoint) => {
        const filterOutArchivedObjects = (objects) =>
            objects.filter((obj) => {
                if (isValid(new Date(obj.Eind_Geldigheid))) {
                    return isBefore(new Date(), new Date(obj.Eind_Geldigheid))
                } else {
                    return false
                }
            })

        axios
            .get(ApiEndpoint)
            .then((res) => {
                let objecten = filterOutArchivedObjects(res.data)
                setObjecten(objecten)
                setIsLoading(false)
            })
            .catch((err) => {
                setIsLoading(false)
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    const checkAuth = React.useCallback(() => {
        if (!user) return

        const gebruikersRol = user.Rol
        if (
            gebruikersRol === "Beheerder" ||
            gebruikersRol === "Functioneel beheerder" ||
            gebruikersRol === "Technisch beheerder" ||
            gebruikersRol === "Test runner" ||
            gebruikersRol === "Tester"
        )
            return

        history.push("/muteer/mijn-beleid")
    }, [user, history])

    React.useLayoutEffect(() => {
        const apiEndpoint = dimensieConstants.API_ENDPOINT
        getAndSetDataFromAPI(apiEndpoint)
        checkAuth()
    }, [user, checkAuth, dimensieConstants])

    const titleSingular = dimensieConstants.TITLE_SINGULAR
    const titelMeervoud = dimensieConstants.TITLE_PLURAL
    const overzichtSlug = dimensieConstants.SLUG_OVERVIEW
    const createNewSlug = dimensieConstants.SLUG_CREATE_NEW
    const hoofdOnderdeelSlug = dimensieConstants.SLUG_OVERVIEW

    return (
        <ContainerMain>
            <Helmet>
                <title>Omgevingsbeleid - {"Beheer " + titelMeervoud}</title>
            </Helmet>

            {/* Sidebar */}
            <SidebarMain />

            {/* Container */}
            <div className="flex-grow inline-block w-3/4 pl-8 rounded">
                <h2 className="mb-4 text-gray-800">{titelMeervoud}</h2>

                {!isLoading ? (
                    <ul className="flex flex-wrap mt-8">
                        <ButtonAddNewObject
                            titleSingular={titleSingular}
                            createNewSlug={createNewSlug}
                            hoofdOnderdeelSlug={hoofdOnderdeelSlug}
                        />

                        {objecten
                            .sort((a, b) => (a.Titel > b.Titel ? 1 : -1))
                            .map((object, index) => (
                                <li
                                    key={object.ID}
                                    className="w-full mb-6 display-inline"
                                >
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
                    <React.Fragment>
                        <LoaderCard />
                        <LoaderCard />
                        <LoaderCard />
                    </React.Fragment>
                )}
            </div>
        </ContainerMain>
    )
}

export default MuteerUniversalObjectOverzicht
