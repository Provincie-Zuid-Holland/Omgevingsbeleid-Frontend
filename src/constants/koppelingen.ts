import {
    getAmbities,
    getBelangen,
    getBeleidsdoelen,
    getBeleidsprestaties,
    getBeleidsregels,
    getMaatregelen,
    getThemas,
    getVerordeningen,
} from '@/api/fetchers'

const connectionProperties = [
    'belangen',
    'beleidsdoelen',
    'themas',
    'beleidsprestaties',
    'maatregelen',
    'beleidsregels',
    'taken',
    'verordening',
] as const
export type connectionPropertiesType = typeof connectionProperties[number]

const propertyNames = [
    'Belangen',
    'Beleidsdoelen',
    'Themas',
    'Beleidsprestaties',
    'Maatregelen',
    'Verordeningen',
    'Beleidsregels',
] as const
export type propertyNamesType = typeof propertyNames[number]

const objecten = {
    belangen: {
        buttonTekst: 'belang',
        volledigeTitel: 'Nationaal Belang',
        volledigeTitelMeervoud: 'Nationale Belangen',
        api: getBelangen,
        filterAPI: true,
        filterType: 'Nationaal Belang',
        propertyName: 'Belangen',
        type: 'Nationaal Belang',
    },
    taken: {
        buttonTekst: 'taak',
        volledigeTitel: 'Wettelijke taken & bevoegdheden',
        volledigeTitelMeervoud: 'Wettelijke taken & bevoegdheden',
        api: getBelangen,
        filterAPI: true,
        filterType: 'Wettelijke Taak & Bevoegdheid',
        propertyName: 'Belangen',
        type: 'Wettelijke Taak & Bevoegdheid',
    },
    beleidsdoelen: {
        buttonTekst: 'beleidsdoelen',
        volledigeTitel: 'Beleidsdoelen',
        volledigeTitelMeervoud: 'Beleidsdoelen',
        api: getBeleidsdoelen,
        filterAPI: false,
        filterType: null,
        propertyName: 'Beleidsdoelen',
        type: 'Beleidsdoel',
    },
    themas: {
        buttonTekst: 'themas',
        volledigeTitel: 'Themas',
        volledigeTitelMeervoud: 'Themas',
        api: getThemas,
        filterAPI: false,
        filterType: null,
        propertyName: 'Themas',
        type: 'Thema',
    },
    beleidsprestaties: {
        buttonTekst: 'beleidsprestaties',
        volledigeTitel: 'Beleidsprestaties',
        volledigeTitelMeervoud: 'Beleidsprestaties',
        api: getBeleidsprestaties,
        filterAPI: false,
        filterType: null,
        propertyName: 'Beleidsprestaties',
        type: 'Beleidsprestatie',
    },
    maatregelen: {
        buttonTekst: 'maatregelen',
        volledigeTitel: 'Maatregelen',
        volledigeTitelMeervoud: 'Maatregelen',
        api: getMaatregelen,
        filterAPI: false,
        filterType: null,
        propertyName: 'Maatregelen',
        type: 'Maatregel',
    },
    verordening: {
        buttonTekst: 'verordeningen',
        volledigeTitel: 'Verordening',
        volledigeTitelMeervoud: 'Verordeningen',
        api: getVerordeningen,
        filterAPI: false,
        filterType: null,
        propertyName: 'Verordeningen',
        type: 'Verordening',
    },
    beleidsregels: {
        buttonTekst: 'beleidsregels',
        volledigeTitel: 'Beleidsregels',
        volledigeTitelMeervoud: 'Beleidsregels',
        api: getBeleidsregels,
        filterAPI: false,
        filterType: null,
        propertyName: 'Beleidsregels',
        type: 'Beleidsregel',
    },
} as const

export default objecten
