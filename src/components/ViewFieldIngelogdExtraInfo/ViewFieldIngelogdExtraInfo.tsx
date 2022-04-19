import { faLink } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import UserContext from '@/App/UserContext'
import * as BELEIDSKEUZES from '@/constants/beleidskeuzes'
import * as MAATREGELEN from '@/constants/maatregelen'

const eigenarenProperties = [
    'Eigenaar_1',
    'Eigenaar_2',
    'Portefeuillehouder_1',
    'Portefeuillehouder_2',
    'Opdrachtgever',
]

/**
 * Displays a owner list and a button to open the list in the admin area.
 *
 * @param {object} crudObject - Contains a collection of data from the parent state.
 * @param {boolean} hideEdit - Used to hide the edit field.
 * @param {string} className - Used to set the style of the div.
 */

interface ViewFieldIngelogdExtraInfoProps {
    crudObject: any
    hideEdit?: boolean
    className?: string
}

const ViewFieldIngelogdExtraInfo = ({
    crudObject,
    hideEdit,
    className,
}: ViewFieldIngelogdExtraInfoProps) => {
    const [canUserEdit, setCanUserEdit] = useState(false)
    const [eigenaren, setEigenaren] = useState<{ [key: string]: any }>({})

    const { user } = useContext(UserContext)

    useEffect(() => {
        const newEigenaren: { [key: string]: any } = {}

        eigenarenProperties
            .filter(item => crudObject[item] !== null)
            .forEach(property => {
                newEigenaren[property as keyof typeof newEigenaren] =
                    crudObject[property]
                return { [property]: crudObject[property] }
            })
        setEigenaren(newEigenaren)
    }, [crudObject])

    const getCanUserEdit = useCallback(
        user => {
            const userExists = user && user !== null && user.UUID
            if (!userExists) return false

            const userCreatedObjectOrIsOwner =
                crudObject.Created_By?.UUID === user.UUID ||
                (user && eigenaren.Eigenaar_1?.UUID === user.UUID) ||
                (user && eigenaren.Eigenaar_2?.UUID === user.UUID) ||
                (user && eigenaren.Opdrachtgever?.UUID === user.UUID)
            const userCanEdit = userExists && userCreatedObjectOrIsOwner
            return userCanEdit
        },
        [crudObject, eigenaren]
    )

    // Check if user can edit the object
    // If so we display the extra information
    useEffect(() => {
        const newCanUserEdit = getCanUserEdit(user)
        setCanUserEdit(newCanUserEdit)
    }, [crudObject, getCanUserEdit, user])

    return (
        <div
            className={`px-3 py-3 bg-gray-100 border border-gray-200 rounded-md ${
                className ? className : ''
            }`}>
            <span className="text-sm text-gray-700">
                Deze informatie zien alleen gebruikers die zijn ingelogd.
            </span>
            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                    <EigenarenList eigenaren={eigenaren} />
                    {crudObject['Weblink'] ? (
                        <a
                            href={crudObject['Weblink']}
                            target="_blank"
                            className="mr-4 text-sm font-bold text-gray-600 hover:underline"
                            rel="noopener noreferrer">
                            <FontAwesomeIcon
                                className="mr-2 text-gray-600"
                                icon={faLink}
                            />
                            IDMS-koppeling
                        </a>
                    ) : null}
                </div>
                {canUserEdit && !hideEdit ? (
                    <Link
                        to={`/muteer/${
                            crudObject.hasOwnProperty('Ref_Beleidskeuzes')
                                ? MAATREGELEN.SLUG_OVERVIEW
                                : BELEIDSKEUZES.SLUG_OVERVIEW
                        }/${crudObject.ID}`}
                        className="px-3 py-2 text-xs font-bold tracking-wide border rounded cursor-pointer text-pzh-blue border-pzh-blue">
                        Openen in beheeromgeving
                    </Link>
                ) : null}
            </div>
        </div>
    )
}

/**
 * Displays a list of owners.
 */
const EigenarenList = ({ eigenaren }: { eigenaren: any }) => {
    if (Object.keys(eigenaren).length === 0) return null

    const getUsername = (item: any) => {
        if (!item) return null
        return item.Gebruikersnaam
    }

    /**
     * Function that gets the abbrevation from the username.
     */
    const getAbbrevationFromUsername = (item: string) => {
        const username = getUsername(item)
        if (!username) return null

        const stringArray = username.split(' ')
        const voornaam = stringArray[0]
        const achternaam = stringArray[stringArray.length - 1]

        return voornaam[0] + achternaam[0]
    }

    /**
     * Returns the Role name of a user based on the value of the item parameter.
     */
    const getPersonenRol = (item: string) => {
        if (item === 'Eigenaar_1') {
            return 'Eerste eigenaar'
        } else if (item === 'Eigenaar_2') {
            return 'Tweede eigenaar'
        } else if (item === 'Portefeuillehouder_1') {
            return 'Eerste portefeuillehouder'
        } else if (item === 'Portefeuillehouder_2') {
            return 'Tweede portefeuillehouder'
        } else if (item === 'Opdrachtgever') {
            return 'Ambtelijk opdrachtgever'
        } else {
            return null
        }
    }

    return (
        <ul className="flex mr-8">
            {Object.keys(eigenaren)
                .filter(item => eigenaren[item])
                .map((item, index) => (
                    <li
                        key={item}
                        className={`relative ${index === 0 ? '' : '-ml-2'}`}>
                        <div className="flex items-center justify-center w-8 h-8 mr-1 text-xs text-white border border-white rounded-full bg-pzh-blue circle-gebruiker font-lg">
                            <span className="font-bold">
                                {getAbbrevationFromUsername(eigenaren[item])}
                            </span>

                            <div className="absolute top-0 left-0 z-10 hidden inline-block px-4 py-3 mt-10 rounded whitespace-nowrap popup-gebruikersinfo">
                                <div className="block text-xs">
                                    {getPersonenRol(item)}
                                </div>
                                <div className="block text-sm font-bold">
                                    {getUsername(eigenaren[item])}
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
        </ul>
    )
}

export default ViewFieldIngelogdExtraInfo
