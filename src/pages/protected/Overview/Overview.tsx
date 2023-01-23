import { Button, FieldInput, Heading } from '@pzh-ui/components'
import {
    MagnifyingGlass,
    ArrowDownZA,
    ArrowDownAZ,
    EllipsisVertical,
} from '@pzh-ui/icons'
import { useQueryClient, useIsFetching } from '@tanstack/react-query'
import { FC, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import {
    Beleidskeuze,
    Gebiedsprogramma,
    Maatregel,
} from '@/api/fetchers.schemas'
import { ContainerMain } from '@/components/Container'
import Dropdown from '@/components/Dropdown'
import { LoaderCard } from '@/components/Loader'
import PageSpecificNavBar from '@/components/PageSpecificNavBar'
import { PopUpAddPolicyToModule } from '@/components/Popup'
import { filteredDimensieConstants } from '@/constants/dimensies'
import useAuth from '@/hooks/useAuth'
import { PossiblePolicyRead } from '@/types/PossiblePolicyRead'
import filterSortPolicies from '@/utils/filterSortPolicies'
import formatDate from '@/utils/formatDate'
import { getFetcherForType } from '@/utils/getFetchers'
import { removePolicyFromModule } from '@/utils/removePolicyFromModule'

/**
 * A component to display all the objects from a specific dimension
 * @param {Object} dimensieConstants - Contains the variables of the dimension
 */
interface OverviewProps {
    dimensieConstants: filteredDimensieConstants
}

const Overview = ({ dimensieConstants }: OverviewProps) => {
    const { user } = useAuth()

    const [filterQuery, setFilterQuery] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [ascending, setAscending] = useState(true)
    const [policyObjects, setPolicyObjects] = useState<PossiblePolicyRead[]>([])

    const titleSingular = dimensieConstants.TITLE_SINGULAR
    const titlePlural = dimensieConstants.TITLE_PLURAL
    const overviewSlug = dimensieConstants.SLUG_OVERVIEW
    const isFetching = useIsFetching([`/${overviewSlug}`])
    const useGetLineage = getFetcherForType(titleSingular)
    const queryOptions = {
        query: {
            staleTime: 0,
            refetchOnMount: true,
        },
    } as const

    const { data: policyObjectsFromAPI } = useGetLineage(
        undefined,
        queryOptions
    )

    /**
     * When the component mounts, fetch the objects from the API and prepare state
     */
    useEffect(() => {
        if (!policyObjectsFromAPI) return

        const sortedAndFilteredPolicyObjects = filterSortPolicies({
            policies: policyObjectsFromAPI,
            filterOptions: {
                filterQuery,
                filterOutArchived: true,
            },
            sortOptions: {
                property: 'Titel',
                direction: ascending ? 'asc' : 'desc',
            },
        })

        setPolicyObjects(sortedAndFilteredPolicyObjects)
        setIsLoading(false)
    }, [policyObjectsFromAPI, ascending, filterQuery])

    const isBeleidsmodule = titleSingular === 'Beleidsmodule'

    const hideAddButton =
        isBeleidsmodule &&
        user?.Rol !== 'Beheerder' &&
        user?.Rol !== 'Functioneel beheerder' &&
        user?.Rol !== 'Technisch beheerder' &&
        user?.Rol !== 'Test runner' &&
        user?.Rol !== 'Tester'

    const addNewPolicyObjectText = `${
        titleSingular === 'Belang' ||
        titleSingular === 'Beleidsdoel' ||
        titleSingular === 'Thema'
            ? 'Nieuw'
            : 'Nieuwe'
    } ${titleSingular.toLowerCase()}`

    return (
        <>
            <Helmet>
                <title>Omgevingsbeleid - {'Beheer ' + titlePlural}</title>
            </Helmet>

            <PageSpecificNavBar
                link="/muteer/dashboard"
                text="Terug naar dashboard"
            />

            <ContainerMain>
                <div className="flex-grow inline-block pt-12 pb-12 rounded">
                    <div className="flex justify-between">
                        <Heading>{titlePlural}</Heading>
                        <div className="flex">
                            <FieldInput
                                onChange={e =>
                                    setFilterQuery(e.target.value.toLowerCase())
                                }
                                value={filterQuery}
                                placeholder="Zoeken in lijst"
                                name="filter"
                                icon={MagnifyingGlass}
                            />
                            {hideAddButton ? null : (
                                <Link to={`/muteer/${overviewSlug}/nieuw`}>
                                    <Button variant="cta" className="ml-2">
                                        {addNewPolicyObjectText}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {!isLoading && !isFetching ? (
                        <div className="w-full mt-10">
                            <OverviewTableHeading
                                ascending={ascending}
                                setAscending={setAscending}
                                titleSingular={titleSingular}
                            />
                            <div>
                                {policyObjects.map(policyObject => (
                                    <OverviewTableRow
                                        titleSingular={titleSingular}
                                        key={policyObject.UUID}
                                        policyObject={policyObject}
                                        overviewSlug={overviewSlug}>
                                        <OverviewDropdown
                                            overviewSlug={overviewSlug}
                                            policy={policyObject}
                                            titleSingular={titleSingular}
                                        />
                                    </OverviewTableRow>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4">
                            <LoaderCard />
                            <LoaderCard />
                            <LoaderCard />
                        </div>
                    )}
                </div>
            </ContainerMain>
        </>
    )
}

type OverviewDropdownProps = {
    policy: PossiblePolicyRead
    overviewSlug: string
    titleSingular: string
}

const OverviewDropdown = ({
    policy,
    overviewSlug,
    titleSingular,
}: OverviewDropdownProps) => {
    const [modulesPopup, setModulesPopup] = useState(false)
    const [dropdown, setDropdown] = useState(false)

    const queryClient = useQueryClient()

    const policyIsInAModule =
        'Ref_Beleidsmodules' in policy
            ? policy?.Ref_Beleidsmodules?.length !== 0
            : false

    const isBeleidsmodule = titleSingular === 'Beleidsmodule'
    const isVerordening = titleSingular === 'Verordening'

    const linkToRaadpleegPage = `/${overviewSlug}/${policy.UUID}`
    const linkToEditPage = isVerordening
        ? `/muteer/${overviewSlug}/${policy.ID}`
        : `/muteer/${overviewSlug}/${policy.ID}/bewerk`

    const dropdownItems = [
        {
            text: 'Bewerken',
            link: linkToEditPage,
        },
        ...(isBeleidsmodule || isVerordening
            ? []
            : [
                  {
                      text: 'Raadpleegomgeving',
                      link: linkToRaadpleegPage,
                  },
              ]),
        ...(titleSingular === 'Maatregel' ||
        titleSingular === 'Beleidskeuze' ||
        titleSingular === 'Gebiedsprogramma'
            ? [
                  {
                      text: policyIsInAModule
                          ? 'Verwijderen uit module'
                          : 'Toevoegen aan module',
                      callback: policyIsInAModule
                          ? () =>
                                removePolicyFromModule(
                                    policy as Beleidskeuze | Maatregel,
                                    titleSingular,
                                    queryClient,
                                    'overview'
                                )
                          : () => setModulesPopup(true),
                  },
              ]
            : []),
    ]

    return (
        <>
            <button
                data-testid="toggle-dropdown"
                onClick={e => {
                    e.preventDefault()
                    setDropdown(!dropdown)
                }}
                className="relative p-3 rounded-md hover:bg-pzh-gray-100">
                <Dropdown
                    items={dropdownItems}
                    isOpen={dropdown}
                    setIsOpen={setDropdown}
                    className="right-[2px]"
                />
                <EllipsisVertical />
            </button>
            <PopUpAddPolicyToModule
                isOpen={modulesPopup}
                setIsOpen={setModulesPopup}
                policy={policy as Beleidskeuze | Maatregel}
                titleSingular={titleSingular as 'Beleidskeuze' | 'Maatregel'}
            />
        </>
    )
}

type OverviewTableRowProps = {
    titleSingular: string
    policyObject: PossiblePolicyRead
    overviewSlug: string
}

const OverviewTableRow: FC<OverviewTableRowProps> = ({
    titleSingular,
    policyObject,
    overviewSlug,
    children,
}) => {
    const formattedModifiedDate = formatDate(
        new Date(policyObject.Modified_Date!),
        'cccc dd MMMM yyyy'
    )

    const tableRowLink =
        titleSingular === 'Maatregel' ||
        titleSingular === 'Beleidskeuze' ||
        titleSingular === 'Gebiedsprogramma' ||
        titleSingular === 'Verordening' ||
        titleSingular === 'Beleidsmodule'
            ? `/muteer/${overviewSlug}/${policyObject.ID}`
            : `/muteer/${overviewSlug}/${policyObject.ID}/bewerk`

    return (
        <div className="flex items-center justify-between border-b border-gray-300 hover:bg-pzh-gray-100 hover:bg-opacity-50">
            <Link className="w-4/12 px-4 py-3 text-gray-800" to={tableRowLink}>
                {policyObject.Titel}
            </Link>
            {titleSingular === 'Maatregel' ||
            titleSingular === 'Beleidskeuze' ||
            titleSingular === 'Gebiedsprogramma' ? (
                <Link
                    className="w-4/12 px-4 py-3 text-gray-800"
                    to={tableRowLink}>
                    {
                        (
                            policyObject as
                                | Maatregel
                                | Beleidskeuze
                                | Gebiedsprogramma
                        )['Status']
                    }
                </Link>
            ) : null}
            <Link to={tableRowLink} className="w-3/12 px-4 py-3 text-gray-800">
                {formattedModifiedDate}
            </Link>
            <div className="flex justify-end w-1/12 px-4 py-3 text-gray-800">
                {children}
            </div>
        </div>
    )
}

type OverviewTableHeadingProps = {
    ascending: boolean
    setAscending: (ascending: boolean) => void
    titleSingular: string
}

const OverviewTableHeading = ({
    ascending,
    setAscending,
    titleSingular,
}: OverviewTableHeadingProps) => {
    return (
        <div className="border-b border-gray-300">
            <div className="flex items-center justify-between">
                <div
                    className="w-4/12 px-4 py-3 font-bold text-left cursor-pointer text-pzh-blue-dark"
                    onClick={() => setAscending(!ascending)}>
                    Naam{' '}
                    {ascending ? (
                        <ArrowDownAZ className="inline-block ml-2 text-lg" />
                    ) : (
                        <ArrowDownZA className="inline-block ml-2 text-lg" />
                    )}
                </div>
                {titleSingular === 'Maatregel' ||
                titleSingular === 'Beleidskeuze' ||
                titleSingular === 'Gebiedsprogramma' ? (
                    <div className="w-4/12 px-4 py-3 font-bold text-left text-pzh-blue-dark">
                        Status
                    </div>
                ) : null}
                <div className="w-3/12 px-4 py-3 font-bold text-left text-pzh-blue-dark">
                    Laatst bewerkt
                </div>
                <div className="w-1/12 px-4 py-3"></div>
            </div>
        </div>
    )
}

export default Overview
