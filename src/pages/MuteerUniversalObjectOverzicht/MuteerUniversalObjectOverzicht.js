import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'

// Import Componenents
import ContainerMain from './../../components/ContainerMain'
import SidebarMain from './../../components/SidebarMain'
import ButtonAddNewObject from './../../components/ButtonAddNewObject'
import CardObjectDetails from './../../components/CardObjectDetails'
import LoaderCard from './../../components/LoaderCard'

// Import Axios instance to connect with the API
import axios from './../../API/axios'

// Import user context
import UserContext from './../../App/UserContext'

const MuteerUniversalObjectOverzicht = ({ dimensieConstants }) => {
    const { user } = React.useContext(UserContext)

    const [objecten, setObjecten] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)

    let history = useHistory()

    const getAndSetDataFromAPI = (ApiEndpoint) => {
        axios
            .get(ApiEndpoint)
            .then((res) => {
                let objecten = res.data
                setObjecten(objecten)
                setIsLoading(false)
            })
            .catch((err) => {
                setIsLoading(false)
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }

    const checkAuth = () => {
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
    }

    React.useLayoutEffect(() => {
        const apiEndpoint = dimensieConstants.API_ENDPOINT
        getAndSetDataFromAPI(apiEndpoint)
        checkAuth()
    }, [user])

    const titelEnkelvoud = dimensieConstants.TITEL_ENKELVOUD
    const titelMeervoud = dimensieConstants.TITEL_MEERVOUD
    const overzichtSlug = dimensieConstants.SLUG_OVERZICHT
    const createNewSlug = dimensieConstants.SLUG_CREATE_NEW
    const hoofdOnderdeelSlug = dimensieConstants.SLUG_OVERZICHT

    return (
        <ContainerMain>
            <Helmet>
                <title>Omgevingsbeleid - {'Beheer ' + titelMeervoud}</title>
            </Helmet>

            {/* Sidebar */}
            <SidebarMain />

            {/* Container */}
            <div className="flex-grow inline-block w-3/4 pl-8 rounded">
                <h2 className="mb-4 text-gray-800 heading-serif">
                    {titelMeervoud}
                </h2>

                {!isLoading ? (
                    <ul className="flex flex-wrap mt-8">
                        <ButtonAddNewObject
                            titelEnkelvoud={titelEnkelvoud}
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
                                        titelEnkelvoud={titelEnkelvoud}
                                        hoofdOnderdeelSlug={overzichtSlug}
                                        hideParagraaf={true}
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
