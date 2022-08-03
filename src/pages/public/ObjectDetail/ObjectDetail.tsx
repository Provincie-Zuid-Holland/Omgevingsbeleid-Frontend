import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
    AmbitiesRead,
    BeleidskeuzesRead,
    VerordeningenRead,
} from '@/api/fetchers.schemas'
import BackButton from '@/components/BackButton'
import { Container } from '@/components/Container'
import Heading from '@/components/Heading'
import { LoaderContent } from '@/components/Loader'
import RelatiesKoppelingen from '@/components/RelatiesKoppelingen'
import {
    DetailPageEndpoint,
    DetailPageVersionEndpoint,
} from '@/utils/detailPages'
import handleError from '@/utils/handleError'
import { prepareRevisions, Revisions } from '@/utils/prepareRevisions'

import RaadpleegObjectDetailHead from './RaadpleegObjectDetailHead'
import RaadpleegObjectDetailMain from './RaadpleegObjectDetailMain'
import RaadpleegObjectDetailNewVersionNotification from './RaadpleegObjectDetailNewVersionNotification'
import RaadpleegObjectDetailSidebar from './RaadpleegObjectDetailSidebar'
import TableOfContents from './TableOfContents'

/**
 * A detail page for policy objects.
 * Every object has its own fields. For example the dimension Maatregelen has <ContainerViewFieldsMaatregel />)
 * @param {object} dataModel - Contains the dimensieConstants of the object (e.g. titleSingular)
 */

interface ObjectDetailProps {
    dataModel?: {
        TITLE_SINGULAR: string
        TITLE_SINGULAR_PREFIX: string
    }
    dataEndpoint?: DetailPageEndpoint
    dataVersionEndpoint?: DetailPageVersionEndpoint
}

const ObjectDetail = ({
    dataModel,
    dataEndpoint,
    dataVersionEndpoint,
}: ObjectDetailProps) => {
    const { id } = useParams<{ id: string }>()

    const [dataObject, setDataObject] = useState<
        AmbitiesRead | BeleidskeuzesRead | VerordeningenRead | null
    >(null) // The object we want to display
    const [lineageID, setLineageID] = useState<number | null>(null) // Used to get the whole history of the object

    // Contains the history of an object (all the edits)
    const [revisionObjects, setRevisionObjects] = useState<Revisions | null>(
        null
    )

    // Boolean if data is loaded
    const [dataLoaded, setDataLoaded] = useState(false)

    const titleSingular = dataModel?.TITLE_SINGULAR
    const titleSingularPrefix = dataModel?.TITLE_SINGULAR_PREFIX

    /** Scroll to top */
    useEffect(() => {
        if (!dataLoaded) return
        window.scrollTo(0, 0)
    }, [dataLoaded])

    /** Initialize data */
    useEffect(() => {
        if (id === dataObject?.UUID) return

        const getVersionOfObject = () =>
            dataVersionEndpoint?.(id!).catch(err => handleError(err))

        setDataLoaded(false)
        getVersionOfObject()
            ?.then(data => {
                if (!data) return

                setDataObject(data)
                return data.ID
            })
            .then(newLineageID => {
                if (!newLineageID) return

                if (newLineageID === lineageID) {
                    // User is on the same lineageID
                    setDataLoaded(true)
                } else {
                    // The user navigated to a different lineageID
                    setLineageID(newLineageID)
                }
            })
    }, [dataVersionEndpoint, id, lineageID, dataObject])

    const getAndSetRevisionObjects = useCallback(() => {
        if (!lineageID) return

        dataEndpoint?.(lineageID)
            .then(data => {
                const preppedRevisions = prepareRevisions(
                    data as BeleidskeuzesRead[]
                )
                setRevisionObjects(preppedRevisions)
                setDataLoaded(true)
            })
            .catch(err => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }, [lineageID, dataEndpoint])

    // useEffect triggered when there is a new lineageID set
    useEffect(() => {
        if (!lineageID && lineageID !== 0) return

        // We only want to show the revisions on the type of Beleidskeuze
        if (titleSingular !== 'Beleidskeuze') {
            return setDataLoaded(true)
        }

        getAndSetRevisionObjects()
    }, [getAndSetRevisionObjects, lineageID, titleSingular])

    if (!dataLoaded) return <LoaderContent />

    return (
        <>
            <RaadpleegObjectDetailHead
                titleSingular={titleSingular || ''}
                dataObject={dataObject}
            />
            <Container
                id="raadpleeg-detail-container-main"
                className="mb-6 md:mb-4">
                <div className="block col-span-6 xl:hidden">
                    <BackButton className="block xl:hidden" />
                    <Heading
                        level="3"
                        className="font-bold"
                        color="text-pzh-blue-dark">
                        {titleSingular}
                    </Heading>
                    <RaadpleegObjectDetailNewVersionNotification
                        titleSingular={titleSingular || ''}
                        dataObject={dataObject}
                    />
                    <Heading level="1" color="text-pzh-blue" className="mt-4">
                        {dataObject ? dataObject.Titel : null}
                    </Heading>
                </div>
                <RaadpleegObjectDetailSidebar
                    titleSingular={titleSingular || ''}
                    revisionObjects={revisionObjects}
                    dataObject={dataObject}
                />
                <TableOfContents display="block" />
                <RaadpleegObjectDetailMain
                    dataLoaded={dataLoaded}
                    dataObject={dataObject as any}
                    titleSingular={titleSingular || ''}
                />
                <TableOfContents display="fixed" />
                {/* <TableOfContents /> */}
            </Container>
            {dataLoaded ? (
                <RelatiesKoppelingen
                    titleSingular={titleSingular || ''}
                    titleSingularPrefix={titleSingularPrefix || ''}
                    dataObject={dataObject as any}
                />
            ) : null}
        </>
    )
}

export default ObjectDetail
