import React from "react"
import { Link } from "react-router-dom"
// import { faLink } from "@fortawesome/pro-solid-svg-icons"
import { faLink } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import UserContext from "../../App/UserContext"

import * as MAATREGELEN from "./../../constants/maatregelen"
import * as BELEIDSKEUZES from "./../../constants/beleidskeuzes"

import * as MAATREGELEN from './../../constants/maatregelen'
import * as BELEIDSKEUZES from './../../constants/beleidskeuzes'

const eigenarenProperties = [
    "Eigenaar_1",
    "Eigenaar_2",
    "Portefeuillehouder_1",
    "Portefeuillehouder_2",
    "Opdrachtgever",
]

const ViewFieldIngelogdExtraInfo = ({ crudObject, hideEdit, className }) => {
    const [canUserEdit, setCanUserEdit] = React.useState(false)
    const [eigenaren, setEigenaren] = React.useState({})

    const { user } = React.useContext(UserContext)

    React.useEffect(() => {
        const newEigenaren = {}

        eigenarenProperties
            .filter((item) => crudObject[item] !== null)
            .forEach((property) => {
                newEigenaren[property] = crudObject[property]
                return { [property]: crudObject[property] }
            })

        setEigenaren(newEigenaren)
    }, [crudObject])

    const getCanUserEdit = React.useCallback(
        (user) => {
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
    React.useEffect(() => {
        const newCanUserEdit = getCanUserEdit(user)
        setCanUserEdit(newCanUserEdit)
    }, [crudObject, getCanUserEdit, user])

    return (
        <UserContext.Consumer>
            {(context) => (
                <div
                    className={`px-3 py-3 bg-gray-100 border border-gray-200 rounded-md ${
                        className ? className : ""
                    }`}
                >
                    <span className="text-sm text-gray-600">
                        Deze informatie zien alleen gebruikers die zijn
                        ingelogd.
                    </span>
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                            <EigenarenList eigenaren={eigenaren} />
                            {crudObject["Weblink"] ? (
                                <a
                                    href={crudObject["Weblink"]}
                                    target="_blank"
                                    className="mr-4 text-sm font-bold text-gray-600 hover:underline"
                                    rel="noopener noreferrer"
                                >
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
                                    crudObject.hasOwnProperty(
                                        "Ref_Beleidskeuzes"
                                    )
                                        ? MAATREGELEN.SLUG_OVERVIEW
                                        : BELEIDSKEUZES.SLUG_OVERVIEW
                                }/${crudObject.ID}`}
                                className="px-3 py-2 text-xs font-bold tracking-wide border rounded cursor-pointer text-pzh-blue border-pzh-blue"
                            >
                                Openen in beheeromgeving
                            </Link>
                        ) : null}
                    </div>
                </div>
            )}
        </UserContext.Consumer>
    )
}

const EigenarenList = ({ eigenaren }) => {
    const getUsername = (item) => {
        if (!item) return null
        return item.Gebruikersnaam
    }

    const getAbbrevationFromUsername = (item) => {
        const username = getUsername(item)
        if (!username) return null

        const stringArray = username.split(" ")
        const voornaam = stringArray[0]
        const achternaam = stringArray[stringArray.length - 1]

        return voornaam[0] + achternaam[0]
    }

    const getPersonenRol = (item) => {
        if (item === "Eigenaar_1") {
            return "Eerste eigenaar"
        } else if (item === "Eigenaar_2") {
            return "Tweede eigenaar"
        } else if (item === "Portefeuillehouder_1") {
            return "Eerste portefeuillehouder"
        } else if (item === "Portefeuillehouder_2") {
            return "Tweede portefeuillehouder"
        } else if (item === "Opdrachtgever") {
            return "Ambtelijk opdrachtgever"
        } else {
            return null
        }
    }

    return (
        <ul className="flex mr-8">
            {Object.keys(eigenaren)
                .filter((item) => eigenaren[item])
                .map((item, index) => (
                    <li
                        key={item}
                        className={`relative ${index === 0 ? "" : "-ml-2"}`}
                    >
                        <div className="flex items-center justify-center w-8 h-8 mr-1 text-xs text-white border border-white rounded-full bg-pzh-blue circle-gebruiker font-lg">
                            <span className="font-bold">
                                {getAbbrevationFromUsername(eigenaren[item])}
                            </span>

                            <div className="absolute top-0 left-0 z-10 hidden inline-block px-4 py-3 mt-10 whitespace-nowrap rounded popup-gebruikersinfo">
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
