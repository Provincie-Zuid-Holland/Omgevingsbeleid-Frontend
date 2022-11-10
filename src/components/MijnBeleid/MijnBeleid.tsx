import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import allDimensies from '@/constants/dimensies'
import useAuth from '@/hooks/useAuth'
import filterOutArchivedObjects from '@/utils/filterOutArchivedObjects'

import ButtonAddNewObject from '../ButtonAddNewObject'
import CardObjectDetails from '../CardObjectDetails'
import { LoaderCardHalfWidth } from '../Loader'

/**
 * Displays a list of beleidskeuzes.
 */

type Dimensie = keyof typeof allDimensies
type FilteredDimensies = Exclude<
    Dimensie,
    | 'BELEIDSRELATIES'
    | 'VERORDENINGSTRUCTUUR'
    | 'VERORDENINGSARTIKEL'
    | 'BELEIDSMODULES'
>

interface MijnBeleidProps {
    hideAddNew?: boolean
}

const MijnBeleid = ({ hideAddNew }: MijnBeleidProps) => {
    const { user } = useAuth()

    const [dataReceived, setDataReceived] = useState(false)
    const [policies, setPolicies] = useState<
        { type: FilteredDimensies; object: any }[][]
    >([])

    useEffect(() => {
        if (!user) return

        const getAndSetBeleidVanGebruiker = () => {
            const skipDimensies: Dimensie[] = [
                'BELEIDSRELATIES',
                'VERORDENINGSTRUCTUUR',
                'VERORDENINGSARTIKEL',
                'BELEIDSMODULES',
            ]

            const policyEndpointsAndTypes = Object.keys(allDimensies)
                .filter(
                    dimensie => !skipDimensies.includes(dimensie as Dimensie)
                )
                .map(dimensie => {
                    return {
                        endpoint:
                            allDimensies[dimensie as FilteredDimensies].apiCall,
                        type: dimensie,
                    }
                })

            const axiosRequests = policyEndpointsAndTypes.map(dimensie =>
                dimensie
                    .endpoint({
                        any_filters:
                            dimensie.type === 'BELEIDSKEUZES' ||
                            dimensie.type === 'MAATREGELEN'
                                ? `Created_By:${user.UUID},Eigenaar_1:${user.UUID},Eigenaar_2:${user.UUID},Opdrachtgever:${user.UUID}`
                                : `Created_By:${user.UUID}`,
                    })
                    .then(data => {
                        if (data.length === 0) return

                        const filteredResponse = filterOutArchivedObjects(data)

                        // Assign type of dimensie to the object
                        const newArray = filteredResponse.map((array: any) => {
                            return {
                                type: dimensie.type,
                                object: array,
                            }
                        })

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

        return getAndSetBeleidVanGebruiker()
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
                                        className={`w-full h-28 display-inline`}>
                                        {
                                            <CardObjectDetails
                                                index={index}
                                                showTippy
                                                mijnBeleid
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
                        <LoaderCardHalfWidth mr />
                        <LoaderCardHalfWidth />
                    </div>
                    <div className="flex flex-row w-full">
                        <LoaderCardHalfWidth mr />
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
                    titleSingular="Beleidskeuze"
                    createNewSlug="nieuw#mijn-beleid"
                    hoofdOnderdeelSlug="beleidskeuzes"
                />
            </div>
            <ButtonAddNewObject
                titleSingular="Maatregel"
                createNewSlug="nieuw#mijn-beleid"
                hoofdOnderdeelSlug="maatregelen"
            />
        </div>
    )
}

export default MijnBeleid
