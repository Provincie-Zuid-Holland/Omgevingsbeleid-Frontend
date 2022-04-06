import { faPlus } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import axios from '@/api/instance'
import ButtonBackToPage from '@/components/ButtonBackToPage'
import { ContainerDetailMain, ContainerMain } from '@/components/Container'
import EigenaarsDriehoek from '@/components/EigenaarsDriehoek'
import allDimensies from '@/constants/dimensies'
import useAuth from '@/hooks/useAuth'
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

interface MuteerUniversalObjectDetailProps {
    dimensieConstants: typeof allDimensies[keyof typeof allDimensies]
}

const MuteerUniversalObjectDetail = ({
    dimensieConstants,
}: MuteerUniversalObjectDetailProps) => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { version, single } = useParams<{ version: string; single: string }>()
    const [dataObject, setDataObject] = useState<any>({})
    const [revisions, setRevisions] = useState<any[]>([])
    const [pageType, setPageType] = useState(returnPageType(version!))
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
                    user,
                })

                if (!isUserAllowed) {
                    toast(
                        'Je bent niet geauthenticeerd om deze pagina te bekijken'
                    )
                    navigate('/muteer/dashboard', { replace: true })
                }

                /** Sort the objects if the pageType is 'detail' (which contains whole history of an object) */
                if (pageType === 'detail') {
                    /** pageType is of 'detail' */

                    const sortedData = data.sort(function (a: any, b: any) {
                        return (
                            (new Date(b.Modified_Date) as any) -
                            (new Date(a.Modified_Date) as any)
                        )
                    })

                    setDataObject(sortedData[0])
                    setRevisions(sortedData.slice(1))
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => getAndSetDimensieDataFromApi(), [pageType])

    /** Update state when the user switches from pageType */
    useEffect(() => {
        if (returnPageType(version!) !== pageType) {
            setDataObject(
                revisions.find(revision => revision.UUID === version) ||
                    revisions[0]
            )
            setPageType(returnPageType(version!))
            setDataReceived(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageType, version])

    const titleSingular = dimensieConstants.TITLE_SINGULAR
    const overzichtSlug = dimensieConstants.SLUG_OVERVIEW

    const displayEigenaarsDriehoek =
        dataReceived &&
        dataObject &&
        (dataObject.Opdrachtgever ||
            dataObject.Eigenaar_1 ||
            dataObject.Eigenaar_2 ||
            dataObject.Portefeuillehouder_1 ||
            dataObject.Portefeuillehouder_2)

    return (
        <ContainerMain>
            <Helmet>
                <title>
                    Omgevingsbeleid{' '}
                    {dataObject.Titel ? ' - ' + dataObject.Titel : ''}
                </title>
            </Helmet>

            {/* Dimensie Container */}
            <div className="inline-block w-full">
                <GenerateBackToButton
                    hash={location.hash}
                    dataObject={dataObject}
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
                            dataObject={dataObject}
                            overzichtSlug={overzichtSlug || ''}
                            titleSingular={titleSingular}
                            dataReceived={dataReceived}
                        />

                        {/* List of Revisions */}
                        {dataReceived &&
                        pageType === 'detail' &&
                        revisions.length ? (
                            <RevisieList
                                revisions={revisions}
                                overzichtSlug={overzichtSlug || ''}
                                hash={location.hash}
                            />
                        ) : null}
                    </div>

                    {displayEigenaarsDriehoek ? (
                        <EigenaarsDriehoek dataObject={dataObject} />
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
    revisions: any[]
    overzichtSlug: string
    hash: string
}

const RevisieList = ({ revisions, overzichtSlug, hash }: RevisieListProps) => (
    <>
        <div className="flex items-center justify-end w-24 h-6 pt-5 mr-2 border-r-2 border-gray-300 " />
        <ul className="relative revisie-list">
            {revisions.map((item: any, index: number) => (
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
                                className="w-24 pr-5 text-xs text-right text-gray-600"
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
    </>
)

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

export default MuteerUniversalObjectDetail
