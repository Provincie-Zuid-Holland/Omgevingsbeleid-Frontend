import {
    AmbitiesRead,
    VerordeningenRead,
    BeleidskeuzesRead,
    BeleidsmodulesRead,
} from '@/api/fetchers.schemas'
import allDimensies from '@/constants/dimensies'

type filteredDimensieConstants = Exclude<
    typeof allDimensies[keyof typeof allDimensies],
    | typeof allDimensies['VERORDENINGSARTIKEL']
    | typeof allDimensies['BELEIDSRELATIES']
>

export const getLatestObjectFromLineage = (
    lineage: Array<
        | AmbitiesRead
        | VerordeningenRead
        | BeleidskeuzesRead
        | BeleidsmodulesRead
    >,
    titleSingular: filteredDimensieConstants['TITLE_SINGULAR'],
    modus: string | null
) => {
    const isMaatregelOrBeleidskeuze =
        titleSingular === 'Beleidskeuze' || titleSingular === 'Maatregel'

    const isWijzigVigerendOrOntwerpMaken =
        (modus && modus === 'wijzig_vigerend') ||
        (modus && modus === 'ontwerp_maken')

    if (isWijzigVigerendOrOntwerpMaken) {
        return lineage.find(e => 'Status' in e && e.Status === 'Vigerend')
    } else if (isMaatregelOrBeleidskeuze) {
        return lineage.find(
            e => 'Aanpassing_Op' in e && e.Aanpassing_Op === null
        )
    } else {
        return lineage[0]
    }
}
