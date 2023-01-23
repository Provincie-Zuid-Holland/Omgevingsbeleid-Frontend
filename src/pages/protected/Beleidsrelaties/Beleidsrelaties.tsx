import { useEffect, useLayoutEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { readBeleidskeuzes, readBeleidsrelaties } from '@/api/fetchers'
import {
    BeleidskeuzeListable,
    Beleidsrelatie,
    BeleidsrelatiesReadStatus,
} from '@/api/fetchers.schemas'
import { ContainerMain } from '@/components/Container'
import useAuth from '@/hooks/useAuth'

import BeleidsrelatiesDetail from '../BeleidsrelatieDetail'
import BeleidsrelatiesOverzicht from '../BeleidsrelatiesOverzicht'

/**
 * @returns Components that renders the overzicht or detail pages of beleidsrelaties, depending on the currentView state
 */
function Beleidsrelaties() {
    const [currentView, setCurrentView] = useState('overzicht')
    const [beleidsrelaties, setBeleidsrelaties] = useState<Beleidsrelatie[]>([])
    const [beleidskeuzes, setBeleidskeuzes] = useState<BeleidskeuzeListable[]>(
        []
    )
    const [isLoading, setIsLoading] = useState(true)

    const { user } = useAuth()
    const { UUID } = useParams<{ UUID: string }>()

    const updateBeleidsrelaties = (
        beleidsrelatieUUID?: string,
        status?: BeleidsrelatiesReadStatus
    ) => {
        const index = beleidsrelaties.findIndex(
            x => x.UUID === beleidsrelatieUUID
        )

        if (index !== -1) {
            beleidsrelaties[index].Status = status
            setBeleidsrelaties([...beleidsrelaties])
        }
    }

    useLayoutEffect(() => {
        if (UUID) {
            setCurrentView('detail')
        } else {
            setCurrentView('overzicht')
        }
    }, [UUID])

    useEffect(() => {
        const UserUUID = user ? user.UUID : null

        if (!UserUUID) return

        Promise.all([
            readBeleidskeuzes({
                any_filters: `Created_By:${UserUUID},Eigenaar_1:${UserUUID},Eigenaar_2:${UserUUID},Opdrachtgever:${UserUUID}`,
            }),
            readBeleidsrelaties(),
        ])
            .then(([beleidskeuzes, beleidsrelaties]) => {
                setBeleidskeuzes(beleidskeuzes)
                setBeleidsrelaties(beleidsrelaties)
                setIsLoading(false)
            })
            .catch(err => {
                console.log(err)
                toast(process.env.REACT_APP_ERROR_MSG)
            })
    }, [user])

    if (currentView === 'overzicht') {
        return (
            <ContainerMain>
                <BeleidsrelatiesOverzicht
                    beleidskeuzes={beleidskeuzes}
                    beleidsrelaties={beleidsrelaties}
                    parentDataLoaded={!isLoading}
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                />
            </ContainerMain>
        )
    } else if (currentView === 'detail') {
        return (
            <ContainerMain>
                <BeleidsrelatiesDetail
                    updateBeleidsrelaties={updateBeleidsrelaties}
                    backToOverzicht={() => setCurrentView('overzicht')}
                />
            </ContainerMain>
        )
    } else {
        throw new Error('Not a valid currentView')
    }
}

export default Beleidsrelaties
