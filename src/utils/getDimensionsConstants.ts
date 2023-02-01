import { BeleidsrelatieType } from '@/api/fetchers.schemas'
import allDimensieConstants from '@/constants/dimensies'

function getDimensionsConstants(
    type: BeleidsrelatieType | 'artikel' | 'beleidsregels'
) {
    switch (type) {
        case 'ambities':
            return allDimensieConstants.AMBITIES
        case 'belangen':
            return allDimensieConstants.BELANGEN
        case 'beleidskeuzes':
            return allDimensieConstants.BELEIDSKEUZES
        case 'beleidsregels':
            return allDimensieConstants.BELEIDSREGELS
        case 'beleidsprestaties':
            return allDimensieConstants.BELEIDSPRESTATIES
        case 'maatregelen':
            return allDimensieConstants.MAATREGELEN
        case 'beleidsdoelen':
            return allDimensieConstants.BELEIDSDOELEN
        case 'themas':
            return allDimensieConstants.THEMAS
        case 'verordeningen':
            return allDimensieConstants.VERORDENINGSARTIKEL
        case 'artikel':
            return allDimensieConstants.VERORDENINGSARTIKEL
        default:
            throw new Error(
                `Oh no! The type '${type}' could not be found within allDimensieConstants...`
            )
    }
}

export default getDimensionsConstants
