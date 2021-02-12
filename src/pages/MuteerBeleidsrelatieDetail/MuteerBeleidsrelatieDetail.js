import React from 'react'
import { Link } from 'react-router-dom'
import { withRouter, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faPlus } from '@fortawesome/free-solid-svg-icons'

import axios from './../../API/axios'

import LoaderMainTitle from '../../components/LoaderMainTitle'
import LoaderSaving from '../../components/LoaderSaving'

import TabRelations from './TabRelations'
import TabRequests from './TabRequests'
import TabRejected from './TabRejected'
import TabDisconnected from './TabDisconnected'
import SwitchToTabbladButton from './SwitchToTabbladButton'

/**
 *
 * @param {function} updateBeleidsrelaties - Updates the beleidsrelaties in the parentstate
 * @param {function} backToOverzicht - Sets the page type to 'overzicht'
 * @returns The detail page for the relations of beleidskeuzes.
 * Here the user can accept, reject, delete existing, and create new relations between beleidskeuzes.
 */
const MuteerBeleidsrelatieDetail = ({
    updateBeleidsrelaties,
    backToOverzicht,
}) => {
    const [activeTab, setActiveTab] = React.useState('relaties')
    const [isLoading, setIsLoading] = React.useState(true)
    const [savingInProgress, setSavingInProgress] = React.useState(false)
    const [
        incoming_Beleidsbeslissingen,
        setIncoming_Beleidsbeslissingen,
    ] = React.useState([])
    const [
        outgoing_Beleidsbeslissingen,
        setOutgoing_Beleidsbeslissingen,
    ] = React.useState([])
    const [motivationPopUp, setMotivationPopUp] = React.useState(null)
    const [disconnectPopup, setDisconnectPopup] = React.useState(null)
    const [beleidsObject, setBeleidsObject] = React.useState({})

    // Arrays containing the relations
    const [relations, setRelations] = React.useState([])
    const [rejected, setRejected] = React.useState([])
    const [disconnected, setDisconnected] = React.useState([])
    const [requests, setRequests] = React.useState([])

    const { UUID } = useParams()

    const getAndSetBeleidsbeslissing = (UUID) =>
        axios.get(`/beleidsbeslissingen/version/${UUID}`).then((res) => {
            setBeleidsObject(res.data)
            // setState({
            //     beleidsbeslissingStatus: res.data.Status,
            //     beleidsbeslissingTitle: res.data.Titel,
            //     titelLoaded: true,
            // })
        })

    // Get alle beleidsrelaties die een Van_Beleidsbeslissing relatie hebben met de beleidskeuze die bekeken wordt
    const getBeleidsrelatiesVanBeleidsbeslissing = (UUID) =>
        axios
            .get(`/beleidsrelaties?Van_Beleidsbeslissing=${UUID}`)
            .then((res) => {
                const outgoing = res.data
                if (outgoing.length === 0) return

                // Als er outgoing zijn mappen we over de array. De return waarde van de map is een array met axios promises. Voor elke relatie binnen de map functie halen we de gekoppelde beleidsrelatie op. Als de data hiervan binnen is is koppelen we deze aan het relatie object.
                // Zodra alle promises zijn voldaan kunnen we de van_beleidsbeslissingen opslaan in de state
                Promise.all(
                    outgoing.map((relatie) =>
                        axios
                            .get(
                                `/beleidsbeslissingen/version/${relatie.Naar_Beleidsbeslissing}`
                            )
                            .then(
                                (res) => (relatie.beleidsbeslissing = res.data)
                            )
                    )
                ).then(() => setOutgoing_Beleidsbeslissingen([...outgoing]))
            })

    // Get alle beleidsrelaties die een Naar_Beleidsbeslissing relatie hebben met de beleidsbeslissing die bekeken wordt
    const getBeleidsrelatiesNaarBeleidsbeslissing = (UUID) =>
        axios
            .get(`/beleidsrelaties?Naar_Beleidsbeslissing=${UUID}`)
            .then((res) => {
                const incoming = res.data
                if (incoming.length === 0) return

                // Als er incoming zijn mappen we over de array. De return waarde van de map is een array met axios promises. Voor elke relatie binnen de map functie halen we de gekoppelde beleidsrelatie op. Als de data hiervan binnen is is koppelen we deze aan het relatie object.
                // Zodra alle promises zijn voldaan kunnen we de van_beleidsbeslissingen opslaan in de state
                return Promise.all(
                    incoming.map((relatie) =>
                        axios
                            .get(
                                `/beleidsbeslissingen/version/${relatie.Van_Beleidsbeslissing}`
                            )
                            .then(
                                (res) => (relatie.beleidsbeslissing = res.data)
                            )
                    )
                ).then(() => setIncoming_Beleidsbeslissingen([...incoming]))
            })

    const relationshipAccept = (beleidsrelatieObject) => {
        const patchedBeleidsrelatieObject = {
            Status: 'Akkoord',
            Begin_Geldigheid: beleidsrelatieObject.Begin_Geldigheid,
            Eind_Geldigheid: beleidsrelatieObject.Eind_Geldigheid,
            Datum_Akkoord: new Date(),
        }

        setSavingInProgress(true)

        axios
            .patch(
                `/beleidsrelaties/${beleidsrelatieObject.ID}`,
                patchedBeleidsrelatieObject
            )
            .then(() => {
                toast('Beleidsrelatie geaccepteerd')
                if (
                    outgoing_Beleidsbeslissingen.find(
                        (x) => x.UUID === beleidsrelatieObject.UUID
                    )
                ) {
                    const itemIndex = outgoing_Beleidsbeslissingen.findIndex(
                        (x) => x.UUID === beleidsrelatieObject.UUID
                    )
                    let newStateObject = outgoing_Beleidsbeslissingen
                    newStateObject[itemIndex].Status = 'Akkoord'
                    newStateObject[itemIndex].Datum_Akkoord = new Date()
                    setOutgoing_Beleidsbeslissingen([...newStateObject])
                    setSavingInProgress(false)
                } else if (
                    incoming_Beleidsbeslissingen.find(
                        (x) => x.UUID === beleidsrelatieObject.UUID
                    )
                ) {
                    const itemIndex = incoming_Beleidsbeslissingen.findIndex(
                        (x) => x.UUID === beleidsrelatieObject.UUID
                    )
                    let newStateObject = incoming_Beleidsbeslissingen

                    newStateObject[itemIndex].Status = 'Akkoord'
                    newStateObject[itemIndex].Datum_Akkoord = new Date()

                    setIncoming_Beleidsbeslissingen([...newStateObject])
                    setSavingInProgress(false)
                }
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
                setSavingInProgress(false)
            })
    }

    const relationshipReject = (beleidsrelatieObject) => {
        const patchedBeleidsrelatieObject = {
            Begin_Geldigheid: beleidsrelatieObject.Begin_Geldigheid,
            Eind_Geldigheid: beleidsrelatieObject.Eind_Geldigheid,
            Datum_Akkoord: new Date(),
            Status: 'NietAkkoord',
        }

        setSavingInProgress(true)

        axios
            .patch(
                `/beleidsrelaties/${beleidsrelatieObject.ID}`,
                patchedBeleidsrelatieObject
            )
            .then((res) => {
                toast('Beleidsrelatie afgewezen')
                setSavingInProgress(false)
                updateBeleidsrelaties(beleidsrelatieObject.UUID, 'NietAkkoord')
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
                setSavingInProgress(false)
            })
    }

    const relationshipDisconnect = (beleidsrelatieObject) => {
        const patchedBeleidsrelatieObject = {
            Begin_Geldigheid: beleidsrelatieObject.Begin_Geldigheid,
            Eind_Geldigheid: beleidsrelatieObject.Eind_Geldigheid,
            Datum_Akkoord: new Date(),
            Status: 'Verbroken',
        }

        setSavingInProgress(true)

        axios
            .patch(
                `/beleidsrelaties/${beleidsrelatieObject.ID}`,
                patchedBeleidsrelatieObject
            )
            .then((res) => {
                toast('Beleidsrelatie verbroken')
                setSavingInProgress(false)
                updateBeleidsrelaties(beleidsrelatieObject.UUID, 'Verbroken')
            })
            .catch((err) => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
                setSavingInProgress(false)
            })
    }

    // Wordt gebruikt om de lokale state te updaten bij bijvoorbeeld het intrekken van een relatie verzoek
    const updateStatus = (uuid, nieuweStatus) => {
        const vanIndex = outgoing_Beleidsbeslissingen.findIndex(
            (x) => x.UUID === uuid
        )
        if (vanIndex !== -1) {
            outgoing_Beleidsbeslissingen[vanIndex].Status = nieuweStatus
            outgoing_Beleidsbeslissingen[vanIndex].Datum_Akkoord = new Date()
        }

        const naarIndex = incoming_Beleidsbeslissingen.findIndex(
            (x) => x.UUID === uuid
        )
        if (naarIndex !== -1) {
            incoming_Beleidsbeslissingen[naarIndex].Status = nieuweStatus
            incoming_Beleidsbeslissingen[naarIndex].Datum_Akkoord = new Date()
        }

        setIncoming_Beleidsbeslissingen([...incoming_Beleidsbeslissingen])
        setOutgoing_Beleidsbeslissingen([...outgoing_Beleidsbeslissingen])
    }

    React.useEffect(() => {
        // Beleidsrelaties bestaan met twee relaties, naar en van een beleidsbeslissing.
        // Beidde worden opgehaald met de onderstaande functies.
        // Van de beleidsbeslissing hebben we enkel de titel nodig.
        Promise.all([
            getAndSetBeleidsbeslissing(UUID),
            getBeleidsrelatiesVanBeleidsbeslissing(UUID),
            getBeleidsrelatiesNaarBeleidsbeslissing(UUID),
        ]).then(() => {
            setIsLoading(false)
        })
    }, [UUID])

    React.useEffect(() => {
        const alleBeleidsrelaties = outgoing_Beleidsbeslissingen.concat(
            incoming_Beleidsbeslissingen
        )

        const newRelatieArray = alleBeleidsrelaties.filter(
            (beleidsrelatie) =>
                ((beleidsrelatie.Van_Beleidsbeslissing === UUID ||
                    beleidsrelatie.Naar_Beleidsbeslissing === UUID) &&
                    beleidsrelatie.Status === 'Akkoord') ||
                (beleidsrelatie.Van_Beleidsbeslissing === UUID &&
                    beleidsrelatie.Status === 'Open')
        )

        const newAfgewezenArray = alleBeleidsrelaties.filter(
            (beleidsrelatie) =>
                (beleidsrelatie.Van_Beleidsbeslissing === UUID &&
                    beleidsrelatie.Status === 'NietAkkoord') ||
                (beleidsrelatie.Naar_Beleidsbeslissing === UUID &&
                    beleidsrelatie.Status === 'NietAkkoord')
        )

        const newVerbrokenArray = alleBeleidsrelaties.filter(
            (beleidsrelatie) =>
                (beleidsrelatie.Van_Beleidsbeslissing === UUID &&
                    beleidsrelatie.Status === 'Verbroken') ||
                (beleidsrelatie.Naar_Beleidsbeslissing === UUID &&
                    beleidsrelatie.Status === 'Verbroken')
        )

        const newVerzoekArray = alleBeleidsrelaties.filter(
            (beleidsrelatie) =>
                beleidsrelatie.Naar_Beleidsbeslissing === UUID &&
                beleidsrelatie.Status === 'Open'
        )

        setRelations(newRelatieArray)
        setRejected(newAfgewezenArray)
        setDisconnected(newVerbrokenArray)
        setRequests(newVerzoekArray)
    }, [incoming_Beleidsbeslissingen, outgoing_Beleidsbeslissingen, UUID])

    return (
        <div className="flex-grow inline-block w-3/4 rounded">
            <div className="container w-full mx-auto text-sm text-gray-600">
                <Link
                    onClick={backToOverzicht}
                    className="inline-block mb-2 text-gray-600 cursor-pointer text-l"
                    id="button-back-to-previous-page"
                    to={`/muteer/beleidsrelaties`}
                >
                    <FontAwesomeIcon className="mr-2" icon={faAngleLeft} />
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
                            {!isLoading ? (
                                beleidsObject.Titel
                            ) : (
                                <LoaderMainTitle />
                            )}
                            {!isLoading ? (
                                <span
                                    className={`absolute inline-block px-1 py-1 ml-4 -mt-1 text-xs font-semibold border rounded  ${
                                        beleidsObject.Status === 'Vigerend'
                                            ? 'm-color m-base-border-color'
                                            : 'text-secondary border-secondary'
                                    } 
                                                                    `}
                                >
                                    {beleidsObject.Status}
                                </span>
                            ) : null}
                        </h1>
                    </div>
                    <div>
                        <Link
                            to={`/muteer/beleidsrelaties/${UUID}/nieuwe-relatie`}
                            className="px-2 py-2 text-sm font-semibold text-white bg-green-600 rounded cursor-pointer hover:bg-green-700"
                        >
                            <FontAwesomeIcon
                                className="mr-2 text-white"
                                icon={faPlus}
                            />
                            Nieuwe relatie
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
                            showLength={true}
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
                        relationshipReject={relationshipReject}
                        loaded={!isLoading}
                        setMotivationPopUp={setMotivationPopUp}
                        motivationPopUp={motivationPopUp}
                        setDisconnectPopup={setDisconnectPopup}
                        disconnectPopUp={disconnectPopup}
                        beleidsbeslissingTitle={beleidsObject.Titel}
                    />
                ) : null}

                {activeTab === 'verzoeken' ? (
                    <TabRequests
                        updateStatus={updateStatus}
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
                        updateStatus={updateStatus}
                        relationshipReject={relationshipReject}
                        relationshipAccept={relationshipAccept}
                        loaded={!isLoading}
                        setMotivationPopUp={setMotivationPopUp}
                        motivationPopUp={motivationPopUp}
                        rejected={rejected}
                    />
                ) : null}

                {activeTab === 'verbroken' ? (
                    <TabDisconnected
                        updateStatus={updateStatus}
                        relationshipReject={relationshipReject}
                        relationshipAccept={relationshipAccept}
                        loaded={!isLoading}
                        setMotivationPopUp={setMotivationPopUp}
                        motivationPopUp={motivationPopUp}
                        disconnected={disconnected}
                    />
                ) : null}

                {savingInProgress ? <LoaderSaving /> : null}
            </div>
        </div>
    )
}

export default withRouter(MuteerBeleidsrelatieDetail)
