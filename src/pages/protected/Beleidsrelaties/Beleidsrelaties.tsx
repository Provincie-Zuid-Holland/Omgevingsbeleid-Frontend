import { useLayoutEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUpdateEffect } from 'react-use'

import { useReadBeleidskeuzes, useReadBeleidsrelaties } from '@/api/fetchers'
import { Beleidsrelatie, RelatieStatus } from '@/api/fetchers.schemas'
import { ContainerMain } from '@/components/Container'
import useAuth from '@/hooks/useAuth'

import BeleidsrelatiesDetail from '../BeleidsrelatieDetail'
import BeleidsrelatiesOverzicht from '../BeleidsrelatiesOverzicht'

/**
 * @returns Components that renders the overzicht or detail pages of beleidsrelaties, depending on the currentView state
 */
function Beleidsrelaties() {
    const [currentView, setCurrentView] = useState('overzicht')
    const [beleidsrelatiesData, setBeleidsrelatiesData] = useState<
        Beleidsrelatie[]
    >([])

    const { user } = useAuth()
    const { UUID } = useParams<{ UUID: string }>()

    useLayoutEffect(() => {
        if (UUID) {
            setCurrentView('detail')
        } else {
            setCurrentView('overzicht')
        }
    }, [UUID])

    const { data: beleidskeuzes = [], isLoading: beleidskeuzesLoading } =
        useReadBeleidskeuzes({
            any_filters: `Created_By_UUID:${user?.UUID},Eigenaar_1_UUID:${user?.UUID},Eigenaar_2_UUID:${user?.UUID},Opdrachtgever_UUID:${user?.UUID}`,
        })
    const { data: beleidsrelaties = [], isLoading: beleidsrelatiesLoading } =
        useReadBeleidsrelaties()

    const updateBeleidsrelaties = (
        beleidsrelatieUUID: string,
        status: RelatieStatus
    ) => {
        const index = beleidsrelatiesData.findIndex(
            x => x.UUID === beleidsrelatieUUID
        )

        if (index !== -1) {
            beleidsrelatiesData[index].Status = status
            setBeleidsrelatiesData([...beleidsrelatiesData])
        }
    }

    useUpdateEffect(
        () => setBeleidsrelatiesData(beleidsrelaties),
        [beleidsrelaties]
    )

    if (currentView === 'overzicht') {
        return (
            <ContainerMain>
                <BeleidsrelatiesOverzicht
                    beleidskeuzes={beleidskeuzes}
                    beleidsrelaties={beleidsrelatiesData}
                    parentDataLoaded={
                        !beleidskeuzesLoading && !beleidsrelatiesLoading
                    }
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
