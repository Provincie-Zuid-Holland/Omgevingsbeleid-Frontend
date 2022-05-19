import { useCallback, useLayoutEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import axios from '@/api/instance'
import ButtonAddNewObject from '@/components/ButtonAddNewObject'
import CardObjectDetails from '@/components/CardObjectDetails'
import { ContainerMain } from '@/components/Container'
import { LoaderCard } from '@/components/Loader'
import SidebarMain from '@/components/SidebarMain'
import allDimensies from '@/constants/dimensies'
import useAuth from '@/hooks/useAuth'
import filterOutArchivedObjects from '@/utils/filterOutArchivedObjects'

/**
 * A component to display all the objects from a specific dimension
 * @param {Object} dimensieConstants - Contains the variables of the dimension
 */

interface MuteerUniversalObjectOverzichtProps {
    dimensieConstants: typeof allDimensies[keyof typeof allDimensies]
    hideAddObject?: boolean
}

const MuteerUniversalObjectOverzicht = ({
    dimensieConstants,
    hideAddObject,
}: MuteerUniversalObjectOverzichtProps) => {
    const { user } = useAuth()

    const [objecten, setObjecten] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate()

    const getAndSetDataFromAPI = (
        ApiEndpoint: typeof dimensieConstants.API_ENDPOINT
    ) => {
        axios
            .get(ApiEndpoint || '')
            .then(res => {
                const objecten = filterOutArchivedObjects(res.data)

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
        ) {
            return
        }

        navigate('/muteer/mijn-beleid', { replace: true })
    }, [user, navigate])

    useLayoutEffect(() => {
        const apiEndpoint = dimensieConstants.API_ENDPOINT
        getAndSetDataFromAPI(apiEndpoint)

        // The only page that is allowed for nonAuth users is the Beleidsmodules page
        const isBeleidsmodulePage =
            dimensieConstants.TITLE_SINGULAR === 'Beleidsmodule'

        if (!isBeleidsmodulePage) {
            checkAuth()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                            <li className="w-full">
                                <ButtonAddNewObject
                                    titleSingular={titleSingular}
                                    createNewSlug={createNewSlug || ''}
                                    hoofdOnderdeelSlug={
                                        hoofdOnderdeelSlug || ''
                                    }
                                />
                            </li>
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
                                        titleSingular={titleSingular}
                                        hoofdOnderdeelSlug={overzichtSlug || ''}
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
