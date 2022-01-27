import { faPlus } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import {
    Link,
    RouteComponentProps,
    useHistory,
    useParams,
    withRouter,
} from 'react-router-dom'
import { toast } from 'react-toastify'
import { useEffectOnce } from 'react-use'

import axios from '@/api/axios'
import { GetTokeninfo200Identifier } from '@/api/fetchers.schemas'
import ButtonBackToPage from '@/components/ButtonBackToPage'
import { ContainerDetailMain, ContainerMain } from '@/components/Container'
import EigenaarsDriehoek from '@/components/EigenaarsDriehoek'
import allDimensies from '@/constants/dimensies'
import { checkIfUserIsAllowedOnPage } from '@/utils/checkIfUserIsAllowedOnPage'
import formatDate from '@/utils/formatDate'

/** pageType 'detail' is based on a UUID, 'version' is based on the the ID of a policy object*/
const returnPageType = (version: string) => {
    let pageType = 'detail'

    if (version) {
        pageType = 'version'
    }

    return pageType
}

/**
 * @returns a detail page where a dimension object can be displayed
 */

interface MuteerUniversalObjectDetailProps extends RouteComponentProps {
    authUser: GetTokeninfo200Identifier
    dimensieConstants: typeof allDimensies[keyof typeof allDimensies]
}

const MuteerUniversalObjectDetail = ({
    authUser,
    dimensieConstants,
}: MuteerUniversalObjectDetailProps) => {
    const history = useHistory()
    const { version, single } = useParams<{ version: string; single: string }>()
    const [dataObject, setDataObject] = useState<any>(null)
    const [pageType, setPageType] = useState(returnPageType(version))
    const [dataReceived, setDataReceived] = useState(false)

    /**
     * @returns {string} - Returns the API endpoint to get the lineage or the version based on the pageType
     */
    const getApiEndpoint = () => {
        const apiEndpoint = dimensieConstants.API_ENDPOINT

        if (pageType === 'detail') {
            const objectID = single
            return `${apiEndpoint}/${objectID}`
        } else if (pageType === 'version') {
            const objectUUID = version
            return `/version/${apiEndpoint}/${objectUUID}`
        }

        return ''
    }

    /**
     * Iniate policy object(s) from the API
     */
    const getAndSetDimensieDataFromApi = () => {
        const apiEndpoint = getApiEndpoint()

        axios
            .get(apiEndpoint)
            .then(res => {
                const data = res.data

                /** Check if user is authenticated to visit current page */
                const isUserAllowed = checkIfUserIsAllowedOnPage({
                    object: data,
                    authUser: authUser,
                })

                if (!isUserAllowed) {
                    toast(
                        'Je bent niet geauthenticeerd om deze pagina te bekijken'
                    )
                    history.push('/muteer/dashboard')
                }

                /** Sort the objects if the pageType is 'detail' (which contains whole history of an object) */
                if (pageType === 'detail') {
                    /** pageType is of 'detail' */
                    setDataObject(
                        data.sort(function (a: any, b: any) {
                            return (
                                (new Date(b.Modified_Date) as any) -
                                (new Date(a.Modified_Date) as any)
                            )
                        })
                    )
                    setDataReceived(true)
                } else {
                    /** pageType is of 'version' */
                    setDataObject(data)
                    setDataReceived(true)
                }
            })
            .catch(err => {
                if (err.response !== undefined) {
                    setDataReceived(true)
                } else {
                    setDataReceived(true)
                    console.log(err)
                    toast(process.env.REACT_APP_ERROR_MSG)
                }
            })
    }

    useEffectOnce(() => {
        getAndSetDimensieDataFromApi()
    })

    /** Update state when the user switches from pageType */
    useEffect(() => {
        if (returnPageType(version) !== pageType) {
            setDataObject(null)
            setPageType(returnPageType(version))
            setDataReceived(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageType])

    const titleSingular = dimensieConstants.TITLE_SINGULAR
    const overzichtSlug = dimensieConstants.SLUG_OVERVIEW

    /**
     * dataObject is currently a array when the pageType is of version,
     * and a object when the pageType is detail. TODO: Refactor this into better state.
     */
    let newDataObject: any = {}

    if (dataReceived && pageType === 'detail') {
        newDataObject = dataObject[0]
    } else if (dataReceived && pageType === 'version') {
        newDataObject = dataObject
    }

    const displayEigenaarsDriehoek =
        dataReceived &&
        newDataObject &&
        (newDataObject.Opdrachtgever !== undefined ||
            newDataObject.Eigenaar_1 !== undefined ||
            newDataObject.Eigenaar_2 !== undefined ||
            newDataObject.Portefeuillehouder_1 !== undefined ||
            newDataObject.Portefeuillehouder_2 !== undefined)

    return (
        <ContainerMain>
            <Helmet>
                <title>
                    Omgevingsbeleid{' '}
                    {newDataObject.Titel ? ' - ' + newDataObject.Titel : ''}
                </title>
            </Helmet>

            {/* Dimensie Container */}
            <div className="inline-block w-full">
                <GenerateBackToButton
                    hash={location.hash}
                    dataObject={newDataObject}
                    overzichtSlug={overzichtSlug || ''}
                    pageType={pageType}
                />

                <div className="flex">
                    <div
                        className={`${
                            overzichtSlug !== 'beleidskeuzes'
                                ? 'w-full'
                                : 'w-9/12'
                        } pr-8`}>
                        {pageType === 'detail' ? (
                            <div className="h-10 mt-5 ">
                                <Link
                                    className="flex items-center w-1/2 mt-5"
                                    to={
                                        location.hash === '#mijn-beleid'
                                            ? `/muteer/${overzichtSlug}/edit/${single}#mijn-beleid`
                                            : `/muteer/${overzichtSlug}/edit/${single}`
                                    }
                                    id={`href-ontwerp-maken`}>
                                    <span className="relative flex items-center justify-end w-24 h-10 pb-5 mr-2 border-r-2 border-gray-300">
                                        <div className="absolute flex items-center justify-center w-8 h-8 text-center bg-gray-300 rounded-full -right-4">
                                            <FontAwesomeIcon
                                                className="relative text-gray-600"
                                                icon={faPlus}
                                            />
                                        </div>
                                    </span>
                                    <span className="inline pl-5 -mt-5 text-sm text-gray-700 cursor-pointer hover:underline">
                                        Ontwerp maken
                                    </span>
                                </Link>
                            </div>
                        ) : null}

                        <ContainerDetailMain
                            dataObject={newDataObject}
                            overzichtSlug={overzichtSlug || ''}
                            titleSingular={titleSingular}
                            dataReceived={dataReceived}
                        />

                        {/* List of Revisions */}
                        {dataReceived && pageType === 'detail' ? (
                            <RevisieList
                                dataObject={dataObject}
                                overzichtSlug={overzichtSlug || ''}
                                hash={location.hash}
                            />
                        ) : null}
                    </div>

                    {displayEigenaarsDriehoek ? (
                        <EigenaarsDriehoek dataObject={newDataObject} />
                    ) : null}
                </div>
            </div>
        </ContainerMain>
    )
}

// Generate Back Button for Detail or Version page

interface GenerateBackToButtonProps {
    overzichtSlug: string
    pageType: string
    hash: string
    dataObject: any
}

function GenerateBackToButton({
    overzichtSlug,
    pageType,
    hash,
    dataObject,
}: GenerateBackToButtonProps) {
    if (pageType === 'detail') {
        if (hash === '#mijn-beleid') {
            return (
                <ButtonBackToPage
                    terugNaar={` mijn beleid`}
                    url={`/muteer/mijn-beleid`}
                />
            )
        } else {
            return (
                <ButtonBackToPage
                    terugNaar={` overzicht`}
                    url={`/muteer/${overzichtSlug}`}
                />
            )
        }
    } else if (pageType === 'version') {
        const dataObjectID = dataObject.ID
        return (
            <ButtonBackToPage
                terugNaar={`huidige versie`}
                url={`/muteer/${overzichtSlug}/${dataObjectID}`}
            />
        )
    }

    return <></>
}

// Generate list for revisies

interface RevisieListProps {
    dataObject: any[]
    overzichtSlug: string
    hash: string
}

function RevisieList({ dataObject, overzichtSlug, hash }: RevisieListProps) {
    dataObject.shift() // remove First object, as we already got that in the parent element view

    return (
        <div>
            <div className="flex items-center justify-end w-24 h-6 pt-5 mr-2 border-r-2 border-gray-300 " />
            <ul className="relative revisie-list">
                {dataObject.map((item: any, index: number) => (
                    <li key={item.UUID}>
                        <div className="flex items-center justify-between">
                            <Link
                                id={`revisie-item-${index}`}
                                to={makeURLForRevisieObject(
                                    overzichtSlug,
                                    item.ID,
                                    item.UUID,
                                    hash
                                )}
                                className="relative flex items-end h-6 mr-2 hover:underline">
                                <span
                                    className="w-24 pr-4 pr-5 text-xs text-right text-gray-600"
                                    title="Laatst gewijzigd op">
                                    {formatDate(
                                        new Date(item.Modified_Date),
                                        'd MMM yyyy'
                                    )}
                                </span>
                                <div className="relative w-3 h-3 text-center bg-gray-300 rounded-full revisie-list-bolletje" />
                                <span className="w-24 pl-4 pr-5 text-xs text-gray-600">
                                    Revisie
                                </span>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

// Link naar detail pagina's van de revisies
function makeURLForRevisieObject(
    overzichtSlug: string,
    objectID: string,
    objectUUID: string,
    hash: string
) {
    if (hash === '#mijn-beleid') {
        return `/muteer/${overzichtSlug}/${objectID}/${objectUUID}#mijn-beleid`
    } else {
        return `/muteer/${overzichtSlug}/${objectID}/${objectUUID}`
    }
}

export default withRouter(MuteerUniversalObjectDetail)
