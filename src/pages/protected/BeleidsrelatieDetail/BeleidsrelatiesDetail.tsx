import { Button } from '@pzh-ui/components'
import { AngleLeft, Plus } from '@pzh-ui/icons'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
    readBeleidsrelaties,
    readBeleidskeuzeVersion,
    updateBeleidsrelatie,
} from '@/api/fetchers'
import {
    Beleidskeuze,
    Beleidsrelatie,
    RelatieStatus,
} from '@/api/fetchers.schemas'
import { LoaderIndicator, LoaderMainTitle } from '@/components/Loader'

import SwitchToTabbladButton from './SwitchToTabbladButton'
import TabDisconnected from './TabDisconnected'
import TabRejected from './TabRejected'
import TabRelations from './TabRelations'
import TabRequests from './TabRequests'

/**
 *
 * @param {function} updateBeleidsrelaties - Updates the beleidsrelaties in the parentstate
 * @param {function} backToOverzicht - Sets the page type to 'overzicht'
 * @returns The detail page for the relations of beleidskeuzes.
 * Here the user can accept, reject, delete existing, and create new relations between beleidskeuzes.
 */

interface BeleidsrelatiesDetailProps {
    updateBeleidsrelaties: (UUID: string, status: RelatieStatus) => void
    backToOverzicht: () => void
}

const BeleidsrelatiesDetail = ({
    updateBeleidsrelaties,
    backToOverzicht,
}: BeleidsrelatiesDetailProps) => {
    const [isLoading, setIsLoading] = useState(true)
    const [savingInProgress, setSavingInProgress] = useState(false)

    const [activeTab, setActiveTab] = useState('relaties')

    /** Incoming and outgoing relations */
    const [incoming_Beleidskeuzes, setIncoming_Beleidskeuzes] = useState<
        Beleidsrelatie[]
    >([])
    const [outgoing_Beleidskeuzes, setOutgoing_Beleidskeuzes] = useState<
        Beleidsrelatie[]
    >([])

    /** State for the beleidsObject that the user is viewing the detail page of */
    const [beleidsObject, setBeleidsObject] = useState<Beleidskeuze | null>(
        null
    )

    /** Popup State */
    const [motivationPopUp, setMotivationPopUp] = useState<
        string | null | undefined
    >(null)
    const [disconnectPopup, setDisconnectPopup] = useState<
        string | null | undefined
    >(null)

    /** State containing the filtered relations */
    const [relations, setRelations] = useState<Beleidsrelatie[]>([])
    const [rejected, setRejected] = useState<Beleidsrelatie[]>([])
    const [disconnected, setDisconnected] = useState<Beleidsrelatie[]>([])
    const [requests, setRequests] = useState<Beleidsrelatie[]>([])

    /** Contains the UUID from the URL */
    const { UUID } = useParams<{ UUID: string }>()

    /**
     * Retrieve specific version of the beleidskeuze
     * @param {string} UUID - UUID of the beleidskeuze we want to retrieve
     */
    const getAndSetBeleidskeuze = (UUID: string) =>
        readBeleidskeuzeVersion(UUID).then(data => setBeleidsObject(data))

    /**
     * Function that gets all relations from a specific beleidskeuze
     * @param {string} UUID - UUID of the beleidskeuze
     */
    const getBeleidsrelatiesVanBeleidskeuze = (UUID: string) =>
        readBeleidsrelaties({ all_filters: `Van_Beleidskeuze:${UUID}` }).then(
            data => {
                if (data.length !== 0) setOutgoing_Beleidskeuzes(data)
            }
        )

    /**
     * Function that gets all outgoing relations to a specific beleidskeuze
     * @param {string} UUID - UUID of the beleidskeuze
     */
    const getBeleidsrelatiesNaarBeleidskeuze = (UUID: string) =>
        readBeleidsrelaties({ all_filters: `Naar_Beleidskeuze:${UUID}` }).then(
            data => {
                if (data.length !== 0) setIncoming_Beleidskeuzes(data)
            }
        )

    /**
     * Function to accept an incoming relation
     * @param {object} beleidsrelatieObject - Contains the relation object
     */
    const relationshipAccept = (beleidsrelatieObject: Beleidsrelatie) => {
        const patchedBeleidsrelatieObject = {
            Status: 'Akkoord' as RelatieStatus,
            Begin_Geldigheid: beleidsrelatieObject.Begin_Geldigheid,
            Eind_Geldigheid: beleidsrelatieObject.Eind_Geldigheid,
            Datum_Akkoord: new Date().toString(),
        }

        setSavingInProgress(true)

        updateBeleidsrelatie(
            beleidsrelatieObject.ID,
            patchedBeleidsrelatieObject
        )
            .then(() => {
                toast('Beleidsrelatie geaccepteerd')
                if (
                    outgoing_Beleidskeuzes.find(
                        x => x.UUID === beleidsrelatieObject.UUID
                    )
                ) {
                    const itemIndex = outgoing_Beleidskeuzes.findIndex(
                        x => x.UUID === beleidsrelatieObject.UUID
                    )
                    const newStateObject = outgoing_Beleidskeuzes
                    newStateObject[itemIndex].Status = 'Akkoord'
                    newStateObject[itemIndex].Datum_Akkoord =
                        new Date().toString()
                    setOutgoing_Beleidskeuzes([...newStateObject])
                    setSavingInProgress(false)
                } else if (
                    incoming_Beleidskeuzes.find(
                        x => x.UUID === beleidsrelatieObject.UUID
                    )
                ) {
                    const itemIndex = incoming_Beleidskeuzes.findIndex(
                        x => x.UUID === beleidsrelatieObject.UUID
                    )
                    const newStateObject = incoming_Beleidskeuzes
                    newStateObject[itemIndex].Status = 'Akkoord'
                    newStateObject[itemIndex].Datum_Akkoord =
                        new Date().toString()
                    setIncoming_Beleidskeuzes([...newStateObject])
                    setSavingInProgress(false)
                }
            })
            .catch(err => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
                setSavingInProgress(false)
            })
    }

    /**
     * Function to refuse an incoming relation
     * @param {object} beleidsrelatieObject - Contains the relation object
     */
    const relationshipReject = (beleidsrelatieObject: Beleidsrelatie) => {
        const patchedBeleidsrelatieObject = {
            Begin_Geldigheid: beleidsrelatieObject.Begin_Geldigheid,
            Eind_Geldigheid: beleidsrelatieObject.Eind_Geldigheid,
            Datum_Akkoord: new Date().toString(),
            Status: 'NietAkkoord' as RelatieStatus,
        }

        setSavingInProgress(true)

        updateBeleidsrelatie(
            beleidsrelatieObject.ID,
            patchedBeleidsrelatieObject
        )
            .then(() => {
                toast('Beleidsrelatie afgewezen')
                setSavingInProgress(false)
                updateBeleidsrelaties(beleidsrelatieObject.UUID, 'NietAkkoord')
                updateStatus(beleidsrelatieObject.UUID, 'NietAkkoord')
            })
            .catch(err => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
                setSavingInProgress(false)
            })
    }

    /**
     * Function to disconnect a relation
     * @param {object} beleidsrelatieObject - Contains the relation object
     */
    const relationshipDisconnect = (beleidsrelatieObject: Beleidsrelatie) => {
        const patchedBeleidsrelatieObject = {
            Begin_Geldigheid: beleidsrelatieObject.Begin_Geldigheid,
            Eind_Geldigheid: beleidsrelatieObject.Eind_Geldigheid,
            Datum_Akkoord: new Date().toString(),
            Status: 'Verbroken' as RelatieStatus,
        }

        setSavingInProgress(true)

        updateBeleidsrelatie(
            beleidsrelatieObject.ID,
            patchedBeleidsrelatieObject
        )
            .then(() => {
                toast('Beleidsrelatie verbroken')
                setSavingInProgress(false)
                updateBeleidsrelaties(beleidsrelatieObject.UUID, 'Verbroken')
            })
            .catch(err => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
                setSavingInProgress(false)
            })
    }

    /**
     * This function is used to update the local component state.
     * E.g. is when the user declines an incoming relation request.
     */
    const updateStatus = (
        uuid: string,
        nieuweStatus: RelatieStatus,
        updateDatumAkkoord?: boolean
    ) => {
        const fromIndex = outgoing_Beleidskeuzes.findIndex(x => x.UUID === uuid)

        if (fromIndex !== -1) {
            outgoing_Beleidskeuzes[fromIndex].Status = nieuweStatus
            if (updateDatumAkkoord)
                outgoing_Beleidskeuzes[fromIndex].Datum_Akkoord =
                    new Date().toString()
        }

        const toIndex = incoming_Beleidskeuzes.findIndex(x => x.UUID === uuid)

        if (toIndex !== -1) {
            incoming_Beleidskeuzes[toIndex].Status = nieuweStatus
            if (updateDatumAkkoord)
                incoming_Beleidskeuzes[toIndex].Datum_Akkoord =
                    new Date().toString()
        }

        setIncoming_Beleidskeuzes([...incoming_Beleidskeuzes])
        setOutgoing_Beleidskeuzes([...outgoing_Beleidskeuzes])
    }

    /** Initialize detail page */
    useEffect(() => {
        if (!UUID) return

        Promise.all([
            getAndSetBeleidskeuze(UUID),
            getBeleidsrelatiesVanBeleidskeuze(UUID),
            getBeleidsrelatiesNaarBeleidskeuze(UUID),
        ]).then(() => {
            setIsLoading(false)
        })
    }, [UUID])

    /** Generate all necessary data for the different tabs */
    useEffect(() => {
        const alleBeleidsrelaties = outgoing_Beleidskeuzes.concat(
            incoming_Beleidskeuzes
        )

        const newRelatieArray = alleBeleidsrelaties.filter(
            beleidsrelatie =>
                ((beleidsrelatie.Van_Beleidskeuze?.UUID === UUID ||
                    beleidsrelatie.Naar_Beleidskeuze?.UUID === UUID) &&
                    beleidsrelatie.Status === 'Akkoord') ||
                (beleidsrelatie.Van_Beleidskeuze?.UUID === UUID &&
                    beleidsrelatie.Status === 'Open')
        )

        const newAfgewezenArray = alleBeleidsrelaties.filter(
            beleidsrelatie =>
                (beleidsrelatie.Van_Beleidskeuze?.UUID === UUID &&
                    beleidsrelatie.Status === 'NietAkkoord') ||
                (beleidsrelatie.Naar_Beleidskeuze?.UUID === UUID &&
                    beleidsrelatie.Status === 'NietAkkoord')
        )

        const newVerbrokenArray = alleBeleidsrelaties.filter(
            beleidsrelatie =>
                (beleidsrelatie.Van_Beleidskeuze?.UUID === UUID &&
                    beleidsrelatie.Status === 'Verbroken') ||
                (beleidsrelatie.Naar_Beleidskeuze?.UUID === UUID &&
                    beleidsrelatie.Status === 'Verbroken')
        )

        const newVerzoekArray = alleBeleidsrelaties.filter(
            beleidsrelatie =>
                beleidsrelatie.Naar_Beleidskeuze?.UUID === UUID &&
                beleidsrelatie.Status === 'Open'
        )

        setRelations(newRelatieArray)
        setRejected(newAfgewezenArray)
        setDisconnected(newVerbrokenArray)
        setRequests(newVerzoekArray)
    }, [incoming_Beleidskeuzes, outgoing_Beleidskeuzes, UUID])

    return (
        <div className="flex-grow inline-block w-3/4 pt-8 rounded">
            <div className="container w-full mx-auto text-sm text-gray-600">
                <Link
                    onClick={backToOverzicht}
                    className="inline-block mb-2 text-gray-600 cursor-pointer text-l"
                    to={`/muteer/beleidsrelaties`}>
                    <AngleLeft className="mr-2 -mt-0.5 inline-block" />
                    <span>Terug naar overzicht</span>
                </Link>
            </div>

            <div className="p-5 bg-white rounded shadow">
                <div className="flex justify-between">
                    <div>
                        <span className="block mb-1 text-sm text-gray-500">
                            Beleidskeuze
                        </span>
                        <h1 className="inline-block mb-8 text-xl font-bold text-gray-800">
                            {isLoading ? (
                                <LoaderMainTitle />
                            ) : (
                                beleidsObject?.Titel
                            )}

                            {!isLoading ? (
                                <span
                                    className={`absolute inline-block px-1 ml-4 pt-1 text-xs font-bold border rounded ${
                                        beleidsObject?.Status === 'Vigerend'
                                            ? 'text-pzh-blue border-pzh-blue'
                                            : 'text-pzh-yellow-dark border-pzh-yellow-dark'
                                    }`}>
                                    {beleidsObject?.Status}
                                </span>
                            ) : null}
                        </h1>
                    </div>
                    <div className="flex-shrink-0">
                        <Link to={`/muteer/beleidsrelaties/${UUID}/nieuw`}>
                            <Button variant="cta" icon={Plus}>
                                Nieuwe relatie
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="w-full mb-5 border-b border-gray-200">
                    <ul>
                        <SwitchToTabbladButton
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                            tabName="relaties"
                        />
                        <SwitchToTabbladButton
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                            tabName="verzoeken"
                            showLength
                            arrayLength={requests.length}
                        />
                        <SwitchToTabbladButton
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                            tabName="afgewezen"
                        />
                        <SwitchToTabbladButton
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                            tabName="verbroken"
                        />
                    </ul>
                </div>

                {activeTab === 'relaties' ? (
                    <TabRelations
                        updateStatus={updateStatus}
                        relationshipDisconnect={relationshipDisconnect}
                        relations={relations}
                        loaded={!isLoading}
                        setMotivationPopUp={setMotivationPopUp}
                        motivationPopUp={motivationPopUp}
                        setDisconnectPopup={setDisconnectPopup}
                        disconnectPopUp={disconnectPopup}
                        beleidskeuzeTitle={beleidsObject?.Titel}
                    />
                ) : null}

                {activeTab === 'verzoeken' ? (
                    <TabRequests
                        relationshipReject={relationshipReject}
                        relationshipAccept={relationshipAccept}
                        loaded={!isLoading}
                        setMotivationPopUp={setMotivationPopUp}
                        motivationPopUp={motivationPopUp}
                        requests={requests}
                    />
                ) : null}

                {activeTab === 'afgewezen' ? (
                    <TabRejected
                        loaded={!isLoading}
                        setMotivationPopUp={setMotivationPopUp}
                        motivationPopUp={motivationPopUp}
                        rejected={rejected}
                    />
                ) : null}

                {activeTab === 'verbroken' ? (
                    <TabDisconnected
                        loaded={!isLoading}
                        setMotivationPopUp={setMotivationPopUp}
                        motivationPopUp={motivationPopUp}
                        disconnected={disconnected}
                    />
                ) : null}

                {savingInProgress ? (
                    <LoaderIndicator text="Opslaan..." />
                ) : null}
            </div>
        </div>
    )
}

export default BeleidsrelatiesDetail
