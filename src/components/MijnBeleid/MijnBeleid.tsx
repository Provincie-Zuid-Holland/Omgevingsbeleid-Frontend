import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'

import {
    Ambitie,
    Beleidsprestatie,
    Gebiedsprogramma,
    MaatregelListable,
    Thema,
} from '@/api/fetchers.schemas'
import allDimensies from '@/constants/dimensies'
import useAuth from '@/hooks/useAuth'
import filterOutArchivedObjects from '@/utils/filterOutArchivedObjects'

import ButtonAddNewObject from '../ButtonAddNewObject'
import CardObjectDetails from '../CardObjectDetails'
import { LoaderCardHalfWidth } from '../Loader'

/**
 * Displays a list of beleidskeuzes.
 */

type Dimensie = keyof typeof allDimensies
type FilteredDimensies = Exclude<
    Dimensie,
    | 'BELEIDSRELATIES'
    | 'VERORDENINGSTRUCTUUR'
    | 'VERORDENINGSARTIKEL'
    | 'BELEIDSMODULES'
>

const skipDimensies: Dimensie[] = [
    'BELEIDSRELATIES',
    'VERORDENINGSTRUCTUUR',
    'VERORDENINGSARTIKEL',
    'BELEIDSMODULES',
]

const filteredDimensies = Object.keys(allDimensies).filter(
    dimensie => !skipDimensies.includes(dimensie as Dimensie)
)

type DataItem =
    | Ambitie
    | Beleidsprestatie
    | MaatregelListable
    | Thema
    | Gebiedsprogramma

interface MijnBeleidProps {
    hideAddNew?: boolean
}

const MijnBeleid = ({ hideAddNew }: MijnBeleidProps) => {
    const { user } = useAuth()

    /**
     * Fetch data based on allDimensies
     */
    const queries = useQueries({
        queries: filteredDimensies.map(dimensie => {
            return {
                queryFn: () =>
                    allDimensies[dimensie as FilteredDimensies].apiCall({
                        any_filters:
                            dimensie === 'BELEIDSKEUZES' ||
                            dimensie === 'MAATREGELEN'
                                ? `Created_By_UUID:${user?.UUID},Eigenaar_1_UUID:${user?.UUID},Eigenaar_2_UUID:${user?.UUID},Opdrachtgever_UUID:${user?.UUID}`
                                : `Created_By_UUID:${user?.UUID}`,
                    }),
                queryKey:
                    allDimensies[dimensie as FilteredDimensies].queryKey(),
            }
        }),
    })

    /**
     * Transform fetched data
     */
    const transformedData = useMemo(() => {
        if (!queries?.length) return

        const items: { type: string; object: DataItem }[] = []

        queries.forEach((query, index) => {
            if (!query.data) return

            const filteredResponse = filterOutArchivedObjects(query.data)

            return filteredResponse.forEach(item => {
                items.push({
                    type: filteredDimensies[index],
                    object: item,
                })
            })
        })

        return items
    }, [queries])

    const isLoading = useMemo(
        () => !!queries.find(query => query.isLoading),
        [queries]
    )

    return (
        <div className="MijnBeleid">
            {!isLoading ? (
                <>
                    {!hideAddNew ? <AddNewSection /> : null}
                    <ul className="grid grid-cols-2 gap-4">
                        {transformedData?.map(dimensie => {
                            if (!dimensie) return null

                            const overzichtSlug =
                                allDimensies[
                                    dimensie.type as keyof typeof allDimensies
                                ]?.SLUG_OVERVIEW
                            const titleSingular =
                                allDimensies[
                                    dimensie.type as keyof typeof allDimensies
                                ]?.TITLE_SINGULAR

                            return (
                                <li
                                    key={dimensie.object.UUID}
                                    className={`w-full h-28 display-inline`}>
                                    {
                                        <CardObjectDetails
                                            object={dimensie.object}
                                            titleSingular={titleSingular}
                                            hoofdOnderdeelSlug={
                                                overzichtSlug || ''
                                            }
                                        />
                                    }
                                </li>
                            )
                        })}
                        {transformedData?.length === 0 && (
                            <span className="mb-4 text-gray-600 font-italic">
                                Je hebt nog geen beleid
                            </span>
                        )}
                    </ul>
                </>
            ) : (
                <div className="mt-8">
                    <div className="flex flex-row w-full">
                        <LoaderCardHalfWidth mr />
                        <LoaderCardHalfWidth />
                    </div>
                    <div className="flex flex-row w-full">
                        <LoaderCardHalfWidth mr />
                        <LoaderCardHalfWidth />
                    </div>
                </div>
            )}
        </div>
    )
}

/**
 * Displays two buttons, one to add a Beleidskeuze and one to add a Maatregel
 */
const AddNewSection = () => {
    return (
        <div className="flex">
            <div className="w-full mr-6">
                <ButtonAddNewObject
                    titleSingular="Beleidskeuze"
                    createNewSlug="nieuw#mijn-beleid"
                    hoofdOnderdeelSlug="beleidskeuzes"
                />
            </div>
            <ButtonAddNewObject
                titleSingular="Maatregel"
                createNewSlug="nieuw#mijn-beleid"
                hoofdOnderdeelSlug="maatregelen"
            />
        </div>
    )
}

export default MijnBeleid
