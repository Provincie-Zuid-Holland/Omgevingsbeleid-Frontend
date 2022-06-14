import { Button, FieldInput, Heading } from '@pzh-ui/components'
import {
    MagnifyingGlass,
    ArrowDownZA,
    ArrowDownAZ,
    EllipsisVertical,
} from '@pzh-ui/icons'
import { FC, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'

import { BeleidskeuzesRead, MaatregelenRead } from '@/api/fetchers.schemas'
import { ContainerMain } from '@/components/Container'
import Dropdown from '@/components/Dropdown'
import { LoaderCard } from '@/components/Loader'
import PageSpecificNavBar from '@/components/PageSpecificNavBar'
import { PopUpAddPolicyToModule } from '@/components/Popup'
import { filteredDimensieConstants } from '@/constants/dimensies'
import { PossiblePolicyRead } from '@/types/PossiblePolicyRead'
import filterSortPolicies from '@/utils/filterSortPolicies'
import formatDate from '@/utils/formatDate'
import { getFetcherForType } from '@/utils/getFetchers'
import { removePolicyFromModule } from '@/utils/removePolicyFromModule'

/**
 * A component to display all the objects from a specific dimension
 * @param {Object} dimensieConstants - Contains the variables of the dimension
 */
interface MuteerOverviewProps {
    dimensieConstants: filteredDimensieConstants
    hideAddObject?: boolean
}

const MuteerOverview = ({
    dimensieConstants,
    hideAddObject,
}: MuteerOverviewProps) => {
    const [filterQuery, setFilterQuery] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [ascending, setAscending] = useState(true)
    const [policyObjects, setPolicyObjects] = useState<PossiblePolicyRead[]>([])

    const titleSingular = dimensieConstants.TITLE_SINGULAR
    const titlePlural = dimensieConstants.TITLE_PLURAL
    const createNewSlug = dimensieConstants.SLUG_CREATE_NEW
    const overviewSlug = dimensieConstants.SLUG_OVERVIEW

    const useGetLineage = getFetcherForType(titleSingular)
    const { data: policyObjectsFromAPI } = useGetLineage()

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

    const isMaatregelOrBeleidskeuze =
        titleSingular === 'Maatregel' || titleSingular === 'Beleidskeuze'

    const isBeleidsmodule = titleSingular === 'Beleidsmodule'

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
                            {hideAddObject ? null : (
                                <Button variant="cta" className="ml-2">
                                    <Link
                                        to={`/muteer/${overviewSlug}/${createNewSlug}`}>
                                        {addNewPolicyObjectText}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {!isLoading ? (
                        <div className="w-full mt-10">
                            <OverviewTableHeading
                                ascending={ascending}
                                setAscending={setAscending}
                                isMaatregelOrBeleidskeuze={
                                    isMaatregelOrBeleidskeuze
                                }
                            />
                            <div>
                                {policyObjects.map(policyObject => (
                                    <OverviewTableRow
                                        isBeleidsmodule={isBeleidsmodule}
                                        policyObject={policyObject}
                                        isMaatregelOrBeleidskeuze={
                                            isMaatregelOrBeleidskeuze
                                        }
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

    const linkToRaadpleegPage = `/detail/${overviewSlug}/${policy.UUID}`
    const linkToEditPage = `/muteer/${overviewSlug}/edit/${policy.ID}`

    const policyIsInAModule =
        'Ref_Beleidsmodules' in policy
            ? policy?.Ref_Beleidsmodules?.length !== 0
            : false

    const isMaatregelOrBeleidskeuze =
        titleSingular === 'Maatregel' || titleSingular === 'Beleidskeuze'

    const isBeleidsmodule = titleSingular === 'Beleidsmodule'

    const dropdownItems = [
        {
            text: 'Bewerken',
            link: linkToEditPage,
        },
        ...(isBeleidsmodule
            ? []
            : [
                  {
                      text: 'Raadpleegomgeving',
                      link: linkToRaadpleegPage,
                  },
              ]),
        ...(isMaatregelOrBeleidskeuze
            ? [
                  {
                      text: policyIsInAModule
                          ? 'Verwijderen uit module'
                          : 'Toevoegen aan module',
                      callback: policyIsInAModule
                          ? () =>
                                removePolicyFromModule(
                                    policy as
                                        | BeleidskeuzesRead
                                        | MaatregelenRead,
                                    titleSingular,
                                    queryClient
                                )
                          : () => setModulesPopup(true),
                  },
              ]
            : []),
    ]

    return (
        <>
            <button
                name="toggle-dropdown"
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
                policy={policy as BeleidskeuzesRead | MaatregelenRead}
                titleSingular={titleSingular as 'Beleidskeuze' | 'Maatregel'}
            />
        </>
    )
}

type OverviewTableRowProps = {
    policyObject: PossiblePolicyRead
    isMaatregelOrBeleidskeuze: boolean
    isBeleidsmodule: boolean
    overviewSlug: string
}

const OverviewTableRow: FC<OverviewTableRowProps> = ({
    policyObject,
    isMaatregelOrBeleidskeuze,
    isBeleidsmodule,
    overviewSlug,
    children,
}) => {
    const formattedModifiedDate = formatDate(
        new Date(policyObject.Modified_Date!),
        'cccc dd MMMM yyyy'
    )

    const tableRowLink =
        isMaatregelOrBeleidskeuze || isBeleidsmodule
            ? `/muteer/${overviewSlug}/${policyObject.ID}`
            : `/muteer/${overviewSlug}/edit/${policyObject.ID}`

    return (
        <Link
            key={policyObject.UUID}
            className="flex items-center justify-between border-b border-gray-300 hover:bg-pzh-gray-100 hover:bg-opacity-50"
            to={tableRowLink}>
            <div className="w-4/12 px-4 py-3 text-gray-800">
                {policyObject.Titel}
            </div>
            {isMaatregelOrBeleidskeuze ? (
                <div className="w-4/12 px-4 py-3 text-gray-800">
                    {
                        (policyObject as MaatregelenRead | BeleidskeuzesRead)[
                            'Status'
                        ]
                    }
                </div>
            ) : null}
            <div className="w-3/12 px-4 py-3 text-gray-800">
                {formattedModifiedDate}
            </div>
            <div className="flex justify-end w-1/12 px-4 py-3 text-gray-800">
                {children}
            </div>
        </Link>
    )
}

type OverviewTableHeadingProps = {
    ascending: boolean
    setAscending: (ascending: boolean) => void
    isMaatregelOrBeleidskeuze: boolean
}

const OverviewTableHeading = ({
    ascending,
    setAscending,
    isMaatregelOrBeleidskeuze,
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
                {isMaatregelOrBeleidskeuze ? (
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

export default MuteerOverview
