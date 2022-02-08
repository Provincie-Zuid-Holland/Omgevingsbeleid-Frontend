import { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { getBeleidskeuzes, getBeleidsrelaties } from '@/api/fetchers'
import { BeleidskeuzesRead, BeleidsrelatiesRead } from '@/api/fetchers.schemas'
import UserContext from '@/App/UserContext'
import { ContainerMain } from '@/components/Container'

import MuteerBeleidsrelatiesDetail from '../MuteerBeleidsrelatieDetail'
import MuteerBeleidsrelatiesOverzicht from '../MuteerBeleidsrelatiesOverzicht'

/**
 * @returns Components that renders the overzicht or detail pages of beleidsrelaties, depending on the currentView state
 */
function MuteerBeleidsrelaties() {
    const [currentView, setCurrentView] = useState('overzicht')
    const [beleidsrelaties, setBeleidsrelaties] = useState<
        BeleidsrelatiesRead[]
    >([])
    const [beleidskeuzes, setBeleidskeuzes] = useState<BeleidskeuzesRead[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const { user } = useContext(UserContext)
    const { UUID } = useParams<{ UUID: string }>()

    const updateBeleidsrelaties = (
        beleidsrelatieUUID?: string,
        status?: string
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
            getBeleidskeuzes({
                any_filters: `Created_By:${UserUUID},Eigenaar_1:${UserUUID},Eigenaar_2:${UserUUID},Opdrachtgever:${UserUUID}`,
            }),
            getBeleidsrelaties(),
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
                <MuteerBeleidsrelatiesOverzicht
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
                <MuteerBeleidsrelatiesDetail
                    updateBeleidsrelaties={updateBeleidsrelaties}
                    backToOverzicht={() => setCurrentView('overzicht')}
                />
            </ContainerMain>
        )
    } else {
        throw new Error('Not a valid currentView')
    }
}

export default MuteerBeleidsrelaties
