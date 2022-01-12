import PropTypes from 'prop-types'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

// Import API
import axios from './../../API/axios'

// Import Componenten
import UserContext from './../../App/UserContext'
import ButtonAddNewObject from './../../components/ButtonAddNewObject'
import CardObjectDetails from './../../components/CardObjectDetails'
import LoaderCardHalfWidth from './../../components/LoaderCardHalfWidth'

// Import All the dimension constants. These contain the dimensions and there variables, e.g. API_ENDPOINT and TITLE_SINGULAR
import allDimensies from './../../constants/dimensies'
import filterOutArchivedObjects from './../../utils/filterOutArchivedObjects'

/**
 * Displays a list of beleidskeuzes.
 *
 * @param {boolean} hideAddNew - Used to display/hide the AddNewSection based on value.
 */
const MijnBeleid = ({ hideAddNew }) => {
    const { user } = useContext(UserContext)

    const [dataReceived, setDataReceived] = useState(false)
    const [policies, setPolicies] = useState([])

    useEffect(() => {
        if (!user) return

        const getAndSetBeleidVanGebruiker = () => {
            const skipDimensies = [
                'BELEIDSRELATIES',
                'VERORDENINGSTRUCTUUR',
                'VERORDENINGSARTIKEL',
                'BELEIDSMODULES',
            ]

            const policyEndpointsAndTypes = Object.keys(allDimensies)
                .filter(dimensie => !skipDimensies.includes(dimensie))
                .map(dimensie => {
                    return {
                        endpoint: allDimensies[dimensie].API_ENDPOINT,
                        type: dimensie,
                    }
                })

            const axiosRequests = policyEndpointsAndTypes.map(dimensie =>
                axios
                    .get(
                        dimensie.endpoint === 'beleidskeuzes' ||
                            dimensie.endpoint === 'maatregelen'
                            ? `/${dimensie.endpoint}?any_filters=Created_By:${user.UUID},Eigenaar_1:${user.UUID},Eigenaar_2:${user.UUID},Opdrachtgever:${user.UUID}`
                            : `/${dimensie.endpoint}?any_filters=Created_By:${user.UUID}`
                    )
                    .then(res => {
                        if (res.data.length === 0) return

                        const filteredResponse = filterOutArchivedObjects(
                            res.data
                        )

                        // Assign type of dimensie to the object
                        const newArray = filteredResponse.map(
                            (array, index) => {
                                return {
                                    type: dimensie.type,
                                    object: array,
                                }
                            }
                        )
                        return newArray
                    })
            )

            Promise.all(axiosRequests)
                .then(res => {
                    setPolicies(res)
                    setDataReceived(true)
                })
                .catch(err => {
                    console.log(err)
                    toast(process.env.REACT_APP_ERROR_MSG)
                })
        }

        getAndSetBeleidVanGebruiker()

        return () => null
    }, [user])

    return (
        <div className="MijnBeleid">
            {dataReceived ? (
                <>
                    {!hideAddNew ? <AddNewSection /> : null}
                    <ul className="grid grid-cols-2 gap-4">
                        {policies.map(dimensie => {
                            if (!dimensie) return null

                            return dimensie.map((policy, index) => {
                                const overzichtSlug =
                                    allDimensies[policy.type].SLUG_OVERVIEW
                                const titleSingular =
                                    allDimensies[policy.type].TITLE_SINGULAR

                                return (
                                    <li
                                        key={policy.object.UUID}
                                        className={`w-full h-28 display-inline`}
                                    >
                                        {
                                            <CardObjectDetails
                                                index={index}
                                                showTippy={true}
                                                mijnBeleid={true}
                                                object={policy.object}
                                                titleSingular={titleSingular}
                                                hoofdOnderdeelSlug={
                                                    overzichtSlug
                                                }
                                            />
                                        }
                                    </li>
                                )
                            })
                        })}
                        {policies.length === 0 ? (
                            <span className="mb-4 text-gray-600 font-italic">
                                Je hebt nog geen beleid
                            </span>
                        ) : null}
                    </ul>
                </>
            ) : (
                <div className="mt-8">
                    <div className="flex flex-row w-full">
                        <LoaderCardHalfWidth mr={true} />
                        <LoaderCardHalfWidth />
                    </div>
                    <div className="flex flex-row w-full">
                        <LoaderCardHalfWidth mr={true} />
                        <LoaderCardHalfWidth />
                    </div>
                </div>
            )}
        </div>
    )
}

/**
 * Displays two buttons, one to add a Beleidskeuze and one to add a Maatregel
 */
const AddNewSection = () => {
    return (
        <div className="flex">
            <div className="w-full mr-6">
                <ButtonAddNewObject
                    titleSingular={'Beleidskeuze'}
                    createNewSlug={'nieuwe-beleidskeuze#mijn-beleid'}
                    hoofdOnderdeelSlug={'beleidskeuzes'}
                />
            </div>
            <ButtonAddNewObject
                titleSingular={'Maatregel'}
                createNewSlug={'nieuwe-maatregel#mijn-beleid'}
                hoofdOnderdeelSlug={'maatregelen'}
            />
        </div>
    )
}

MijnBeleid.propTypes = {
    hideAddNew: PropTypes.bool,
}

MijnBeleid.defaultProps = {
    hideAddNew: false,
}

export default MijnBeleid
