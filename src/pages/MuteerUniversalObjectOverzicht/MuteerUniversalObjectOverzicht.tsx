import { isBefore, isValid } from 'date-fns'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
    ThemasWrite,
    MaatregelenWrite,
    BeleidsregelsWrite,
    BeleidsprestatiesWrite,
    BeleidsmodulesWrite,
    BeleidskeuzesWrite,
    BeleidsdoelenWrite,
    BelangenWrite,
    AmbitiesWrite,
} from '@/api/fetchers.schemas'
import axios from '@/api/instance'
import UserContext from '@/App/UserContext'
import ButtonAddNewObject from '@/components/ButtonAddNewObject'
import CardObjectDetails from '@/components/CardObjectDetails'
import { ContainerMain } from '@/components/Container'
import { LoaderCard } from '@/components/Loader'
import SidebarMain from '@/components/SidebarMain'
import allDimensies, { filteredDimensieConstants } from '@/constants/dimensies'
import { getFetcherForType } from '@/utils/getFetchers'

/**
 * A component to display all the objects from a specific dimension
 * @param {Object} dimensieConstants - Contains the variables of the dimension
 */

interface MuteerUniversalObjectOverzichtProps {
    dimensieConstants: filteredDimensieConstants
    hideAddObject?: boolean
}

type PossibleWriteObjects =
    | ThemasWrite
    | MaatregelenWrite
    | BeleidsregelsWrite
    | BeleidsprestatiesWrite
    | BeleidsmodulesWrite
    | BeleidskeuzesWrite
    | BeleidsdoelenWrite
    | BelangenWrite
    | AmbitiesWrite

const MuteerUniversalObjectOverzicht = ({
    dimensieConstants,
    hideAddObject,
}: MuteerUniversalObjectOverzichtProps) => {
    const { user } = useContext(UserContext)

    const titleSingular = dimensieConstants.TITLE_SINGULAR
    const titelMeervoud = dimensieConstants.TITLE_PLURAL
    const overzichtSlug = dimensieConstants.SLUG_OVERVIEW
    const createNewSlug = dimensieConstants.SLUG_CREATE_NEW
    const hoofdOnderdeelSlug = dimensieConstants.SLUG_OVERVIEW

    const useGetAllLineages = getFetcherForType(titleSingular)
    const { isLoading, data } = useGetAllLineages()

    // const [objecten, setObjecten] = useState<any[]>([])

    const history = useHistory()

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

        history.push('/muteer/mijn-beleid')
    }, [user, history])

    useEffect(() => {
        // The only page that is allowed for nonAuth users is the Beleidsmodules page
        const isBeleidsmodulePage =
            dimensieConstants.TITLE_SINGULAR === 'Beleidsmodule'

        if (!isBeleidsmodulePage) {
            checkAuth()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, checkAuth, dimensieConstants])

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

                        {data
                            ? data
                                  // Filter out archived objects
                                  .filter((obj: any) => {
                                      if (
                                          isValid(new Date(obj.Eind_Geldigheid))
                                      ) {
                                          return isBefore(
                                              new Date(),
                                              new Date(obj.Eind_Geldigheid)
                                          )
                                      } else {
                                          return false
                                      }
                                  })
                                  .sort((a, b) =>
                                      a.Titel! > b.Titel! ? 1 : -1
                                  )
                                  .map((object, index) => (
                                      <li
                                          key={object.ID}
                                          className="w-full mb-6 display-inline">
                                          <CardObjectDetails
                                              index={index}
                                              object={object}
                                              titleSingular={titleSingular}
                                              hoofdOnderdeelSlug={
                                                  overzichtSlug || ''
                                              }
                                          />
                                      </li>
                                  ))
                            : null}
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
