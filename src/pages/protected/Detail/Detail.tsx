import { Text } from '@pzh-ui/components'
import { Plus } from '@pzh-ui/icons'
import { Fragment, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useIsFetching } from 'react-query'
import { useParams, Link } from 'react-router-dom'

import {
    useGetBeleidskeuzesLineageid,
    useGetMaatregelenLineageid,
} from '@/api/fetchers'
import { BeleidskeuzesRead, MaatregelenRead } from '@/api/fetchers.schemas'
import CheckedOutPolicyContainer from '@/components/CheckedOutPolicyContainer'
import { ContainerMain } from '@/components/Container'
import LineIndicatorArchived from '@/components/LineIndicatorArchived'
import { LoaderIndicator, LoaderPolicyDetail } from '@/components/Loader'
import PageSpecificNavBar from '@/components/PageSpecificNavBar'
import PolicyDetailCard from '@/components/PolicyDetailCard'
import allDimensies from '@/constants/dimensies'

const getFetcher = (titleSingular: 'Beleidskeuze' | 'Maatregel') => {
    switch (titleSingular) {
        case 'Beleidskeuze':
            return useGetBeleidskeuzesLineageid
        case 'Maatregel':
            return useGetMaatregelenLineageid
    }
}

export interface DetailProps {
    dimensieConstants:
        | typeof allDimensies.BELEIDSKEUZES
        | typeof allDimensies.MAATREGELEN
}

const initialState = {
    checkedOutPolicy: null,
    currentValidPolicy: null,
    archivedPolicies: [],
    originalLineage: [],
}

/**
 * Page that display the objects in a specific object lineage
 */
function Detail({ dimensieConstants }: DetailProps) {
    const { single: objectID } = useParams<{ single: string | undefined }>()

    const [state, setState] = useState<{
        checkedOutPolicy: null | BeleidskeuzesRead | MaatregelenRead
        currentValidPolicy: null | BeleidskeuzesRead | MaatregelenRead
        archivedPolicies: BeleidskeuzesRead[] | MaatregelenRead[]
        originalLineage: BeleidskeuzesRead[] | MaatregelenRead[]
    }>(initialState)

    const overviewSlug = dimensieConstants.SLUG_OVERVIEW
    const titleSingular = dimensieConstants.TITLE_SINGULAR
    const useGetLineage = getFetcher(titleSingular)

    const { isLoading: lineageIsLoading, data: lineage } = useGetLineage(
        parseInt(objectID!)
    )
    const isFetching = useIsFetching({
        queryKey: `/${overviewSlug}/${objectID}`,
    })

    /**
     * Prepare state when the lineage is set
     */
    useEffect(() => {
        if (!lineage) return

        const latestOriginalValidPolicyIndex = lineage.findIndex(
            policy =>
                policy.Status === 'Vigerend' && policy.Aanpassing_Op === null
        )

        const latestValidPolicyIndex = lineage.findIndex(
            policy => policy.Status === 'Vigerend'
        )

        const latestNonValidPolicyIndex = lineage.findIndex(
            policy => policy.Status !== 'Vigerend'
        )

        const lineageHasValidAndCheckedOutPolicy =
            latestOriginalValidPolicyIndex > latestNonValidPolicyIndex

        const lineageHasNoValidPolicyButHasCheckedOutPolicy =
            latestOriginalValidPolicyIndex === -1 &&
            latestNonValidPolicyIndex !== -1

        const checkedOutPolicy = lineageHasValidAndCheckedOutPolicy
            ? lineage[latestNonValidPolicyIndex]
            : lineageHasNoValidPolicyButHasCheckedOutPolicy
            ? lineage[latestNonValidPolicyIndex]
            : null

        const currentValidPolicy = lineage[latestValidPolicyIndex]

        /**
         * Get archived valid policies and filter out copies of the valid version
         * that have been edited while it was valid ('Wijzigen zonder besluitvormingsproces').
         * This is done by checking the value of the Aanpassing_Op property.
         * If a valid policy has been edited, it will have a reference to the previous version.
         */
        const archivedPolicies = lineage.filter(
            (policy, index) =>
                index > latestOriginalValidPolicyIndex &&
                policy.Status === 'Vigerend' &&
                lineage.find(
                    policyInLineage =>
                        policyInLineage.Aanpassing_Op === policy.UUID
                ) === undefined
        )

        const newState = {
            checkedOutPolicy,
            currentValidPolicy,
            archivedPolicies,
            originalLineage: lineage,
        }

        setState(newState)
    }, [lineage])

    const {
        checkedOutPolicy,
        currentValidPolicy,
        archivedPolicies,
        originalLineage,
    } = state

    const pageTitle = `Omgevingsbeleid ${
        checkedOutPolicy
            ? ' - ' + checkedOutPolicy.Titel!
            : currentValidPolicy
            ? ' - ' + currentValidPolicy.Titel!
            : ''
    }`

    if (lineageIsLoading || isFetching) {
        return (
            <Fragment>
                <LoaderPolicyDetail />
                <LoaderIndicator />
            </Fragment>
        )
    }

    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
            </Helmet>

            <PageSpecificNavBar
                link={`/muteer/${overviewSlug}`}
                text="Terug naar overzicht"
            />

            <ContainerMain>
                <div className="w-full mt-16 mb-10">
                    {currentValidPolicy && !checkedOutPolicy ? (
                        <div className="pl-6">
                            <Link
                                to={`/muteer/${overviewSlug}/${currentValidPolicy.ID}/bewerk?modus=ontwerp_maken`}
                                className="relative inline-flex h-6 border-l-2 group border-pzh-gray-300">
                                <div className="w-6 h-6 rounded-full -ml-[16px] -mt-[12px] relative bg-pzh-gray-300 flex items-center justify-center">
                                    <Plus className="text-pzh-gray-600 group-hover:text-pzh-blue" />
                                </div>
                                <Text className="relative ml-3 -mt-2 text-pzh-blue group-hover:underline group-hover:text-pzh-blue-dark">
                                    Ontwerp maken
                                </Text>
                            </Link>
                            <div className="h-4 border-l-2 border-pzh-gray-300" />
                        </div>
                    ) : null}

                    {checkedOutPolicy ? (
                        <CheckedOutPolicyContainer
                            originalLineage={originalLineage}
                            checkedOutPolicy={checkedOutPolicy}>
                            <PolicyDetailCard
                                dimensieConstants={dimensieConstants}
                                policy={checkedOutPolicy}
                                type="checked out"
                            />
                        </CheckedOutPolicyContainer>
                    ) : null}

                    {currentValidPolicy ? (
                        <PolicyDetailCard
                            dimensieConstants={dimensieConstants}
                            policy={currentValidPolicy}
                            type="valid"
                        />
                    ) : null}

                    {archivedPolicies
                        ? archivedPolicies.map((policy, index) => (
                              <div key={policy.UUID}>
                                  <LineIndicatorArchived />
                                  <PolicyDetailCard
                                      dimensieConstants={dimensieConstants}
                                      lastItem={
                                          index === archivedPolicies.length - 1
                                      }
                                      policy={policy}
                                      type="archived"
                                  />
                              </div>
                          ))
                        : null}
                </div>
            </ContainerMain>
        </>
    )
}

export default Detail
