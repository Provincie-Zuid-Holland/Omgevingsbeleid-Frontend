import { isBefore, isValid } from 'date-fns'

import { PossiblePolicyRead } from '@/types/PossiblePolicyRead'

type FilterOptions = {
    filterQuery: undefined | string
    filterOutArchived: boolean
}

type SortOptions = {
    property: 'Titel'
    direction: 'asc' | 'desc'
}

type FilterSortPolicyProps = {
    policies: PossiblePolicyRead[]
    sortOptions: SortOptions | null
    filterOptions: FilterOptions | null
}

export const filterSortPolicy = ({
    policies,
    filterOptions,
    sortOptions,
}: FilterSortPolicyProps) =>
    policies
        // Optionally sort policies by a property
        .sort((a, b) => {
            if (sortOptions === null) {
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
