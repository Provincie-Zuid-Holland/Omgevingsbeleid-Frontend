import { isBefore, isValid } from 'date-fns'

import { PossiblePolicyRead } from '@/types/PossiblePolicyRead'

type FilterOptions = {
    filterQuery?: string
    filterOutArchived?: boolean
}

type SortOptions = {
    property: 'Titel'
    direction: 'asc' | 'desc'
}

export type filterSortPoliciesProps = {
    policies: PossiblePolicyRead[]
    sortOptions?: SortOptions
    filterOptions?: FilterOptions
}

/**
 * Utility to sort and filter an array of policies
 * - Sort an array of policies based on a property
 * - Filter out policies that are archived (current date > Eind_Geldigheid date)
 * - Filter out policies based on a search query
 */
const filterSortPolicies = ({
    policies,
    filterOptions,
    sortOptions,
}: filterSortPoliciesProps) =>
    policies
        // Optionally sort policies by a property
        .sort((a, b) => {
            if (sortOptions === undefined) {
                return 0
            }

            if (sortOptions.property === 'Titel' && a.Titel && b.Titel) {
                if (sortOptions.direction === 'asc') {
                    return a.Titel > b.Titel ? 1 : -1
                } else {
                    return a.Titel < b.Titel ? 1 : -1
                }
            } else {
                return 0
            }
        })
        // Optionally filter policies by a query
        .filter(policyObject =>
            filterOptions && filterOptions.filterQuery
                ? policyObject
                      .Titel!.toLowerCase()
                      .includes(filterOptions.filterQuery)
                : true
        )
        // Optionally filter out archived policies
        // A policy is considered archived when the Current date is > Eind Geldigheid
        .filter(policy =>
            filterOptions && filterOptions.filterOutArchived
                ? policy.Eind_Geldigheid &&
                  isValid(new Date(policy.Eind_Geldigheid)) &&
                  isBefore(new Date(), new Date(policy.Eind_Geldigheid))
                : true
        )

export default filterSortPolicies
