import React from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

// Import API
import axios from './../../API/axios'

// Import Componenten
import LoaderCardHalfWidth from './../../components/LoaderCardHalfWidth'
import CardObjectDetailsHalfWidth from './../../components/CardObjectDetailsHalfWidth'
import ButtonAddNewObject from './../../components/ButtonAddNewObject'

// Import All the dimension constants. These contain the dimensions and there variables, e.g. API_ENDPOINT and TITLE_SINGULAR
import allDimensies from './../../constants/dimensies'

import UserContext from './../../App/UserContext'

const MijnBeleid = ({ hideAddNew }) => {
    const { user } = React.useContext(UserContext)

    const [dataReceived, setDataReceived] = React.useState(false)
    const [policies, setPolicies] = React.useState([])

    React.useEffect(() => {
        if (!user) return

        const getAndSetBeleidVanGebruiker = () => {
            const skipDimensies = [
                'BELEIDSRELATIES',
                'DOELEN',
                'VERORDENINGSTRUCTUUR',
                'VERORDENINGSARTIKEL',
            ]

            const policyEndpointsAndTypes = Object.keys(allDimensies)
                .filter((dimensie) => !skipDimensies.includes(dimensie))
                .map((dimensie) => {
                    return {
                        endpoint: allDimensies[dimensie].API_ENDPOINT,
                        type: dimensie,
                    }
                })

            const axiosRequests = policyEndpointsAndTypes.map((dimensie) => {
                return axios
                    .get(
                        dimensie.endpoint === 'beleidsbeslissingen'
                            ? `/${dimensie.endpoint}?Created_By=${user.UUID}&Eigenaar_1=${user.UUID}&Eigenaar_2=${user.UUID}&Opdrachtgever=${user.UUID}`
                            : `/${dimensie.endpoint}?Created_By=${user.UUID}`
                    )
                    .then((res) => {
                        if (res.data.length === 0) return

                        // Assign type of dimensie to the object
                        const newArray = res.data.map((array, index) => {
                            return {
                                type: dimensie.type,
                                object: array,
                            }
                        })
                        return newArray
                    })
            })

            Promise.all(axiosRequests)
                .then((res) => {
                    setPolicies(res)
                    setDataReceived(true)
                })
                .catch((err) => {
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
                <React.Fragment>
                    {!hideAddNew ? <AddNewSection /> : null}
                    <ul className="flex flex-wrap mt-5">
                        {policies.map((dimensie) => {
                            if (!dimensie) return null

                            return dimensie.map((policy, index) => {
                                const overzichtSlug =
                                    allDimensies[policy.type].SLUG_OVERVIEW
                                const titleSingular =
                                    allDimensies[policy.type].TITLE_SINGULAR

                                return (
                                    <li
                                        key={policy.object.UUID}
                                        className={`mb-6 w-1/2 display-inline odd-pr-3 even-pl-3`}
                                    >
                                        {
                                            <CardObjectDetailsHalfWidth
                                                fullWidth={true}
                                                index={index}
                                                mijnBeleid={true}
                                                object={policy.object}
                                                titleSingular={titleSingular}
                                                hideParagraaf={true}
                                                overzichtSlug={overzichtSlug}
                                            />
                                        }
                                    </li>
                                )
                            })
                        })}
                        {policies.length === 0 ? (
                            <span className="mb-4 text-gray-600 font-italic">
                                U heeft nog geen beleid
                            </span>
                        ) : null}
                    </ul>
                </React.Fragment>
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
