import { currentDate, futureDate, currentDateFormatted } from './testValues'

export const TITLE_SINGULAR = 'Beleidskeuze'
export const TITLE_SINGULAR_PREFIX = 'de'
export const TITLE_PLURAL = 'Beleidskeuzes'
export const API_ENDPOINT = 'beleidskeuzes'
export const API_ENDPOINT_VIGEREND = 'valid/beleidskeuzes'
export const SLUG_OVERVIEW = 'beleidskeuzes'
export const SLUG_CREATE_NEW = 'nieuwe-beleidskeuze'

// De required property bevat de statussen waarin de property verplicht is om in te vullen
// De type property bevat de type van het veld. Op basis hiervan wordt de veld validatie gedaan
// De requiredMessage property wordt getoond in de UI in een notifitie zodra de gebruiker geen waarde heeft ingevuld. D
export const CRUD_PROPERTIES = {
    Titel: {
        initValue: '',
        required: [
            'Ontwerp in concept',
            'Ontwerp',
            'Vastgesteld',
            'Gepubliceerd',
        ],
        requiredMessage: 'Vul een titel in',
        testValue: `Test beleidskeuze ${currentDateFormatted}`,
        type: 'text input',
    },
    Eigenaar_1: {
        initValue: null,
        required: [
            'Ontwerp in concept',
            'Ontwerp',
            'Vastgesteld',
            'Gepubliceerd',
        ],
        requiredMessage: 'Selecteer een eerste eigenaar',
        testValue: `Alex de Roos`,
        type: 'react select',
    },
    Eigenaar_2: {
        initValue: null,
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Selecteer een tweede eigenaar',
        testValue: `Maurice Hermans`,
        type: 'react select',
    },
    Portefeuillehouder_1: {
        initValue: null,
        required: [
            'Ontwerp in concept',
            'Ontwerp',
            'Vastgesteld',
            'Gepubliceerd',
        ],
        requiredMessage: 'Selecteer een eerste portefeuillehouder',
        testValue: `Willy de Zoete`,
        type: 'react select',
    },
    Portefeuillehouder_2: {
        initValue: null,
        required: [],
        requiredMessage: 'Selecteer een tweede portefeuillehouder',
        testValue: `Adri Bom-Lemstra`,
        type: 'react select',
    },
    Opdrachtgever: {
        initValue: null,
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Selecteer een opdrachtgever',
        testValue: `Albert Koffeman`,
        type: 'react select',
    },
    Omschrijving_Keuze: {
        initValue: null,
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Vul de omschrijving van de beleidskeuze in',
        testValue: `Test tekst over wat de beleidskeuze wil bereiken`,
        type: 'text input',
    },
    Omschrijving_Werking: {
        initValue: null,
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Vul de toelichting van de beleidskeuze in',
        testValue: `Test toelichting van de beleidskeuze`,
        type: 'text input',
    },
    Aanleiding: {
        initValue: null,
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Vul het aanleiding veld in',
        testValue: `Test aanleiding van de beleidskeuze`,
        type: 'text input',
    },
    Provinciaal_Belang: {
        initValue: null,
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Vul het provinciaal belang veld in',
        testValue: `Test aanleiding van de beleidskeuze`,
        type: 'text input',
    },
    Werkingsgebieden: {
        initValue: [],
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Selecteer een werkingsgebied',
        type: 'werkingsgebied',
    },
    Weblink: {
        initValue: null,
        required: ['Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Vul de link in naar het besluitdocument op IDMS',
        testValue: `Test weblink`,
        type: 'text input',
    },
    Besluitnummer: {
        initValue: null,
        required: ['Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Vul het besluitnummer veld in van ',
        testValue: `Test besluitnummer`,
        type: 'text input',
    },
    Begin_Geldigheid: {
        initValue: null,
        required: ['Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Vul een datum van inwerkingstreding in',
        testValue: currentDate,
        type: 'date input',
    },
    Eind_Geldigheid: {
        initValue: null,
        required: [],
        requiredMessage: 'Vul een datum van uitwerkingstreding in',
        testValue: futureDate,
        type: 'date input',
    },
    Beleidsregels: {
        initValue: [],
        required: [],
        requiredMessage: '',
        type: 'connection',
    },
    Verordeningen: {
        initValue: [],
        required: [],
        requiredMessage: '',
        type: 'connection',
    },
    Maatregelen: {
        initValue: [],
        required: [],
        requiredMessage: '',
        type: 'connection',
    },
    Themas: {
        initValue: [],
        required: [],
        requiredMessage: '',
        type: 'connection',
    },
    Ambities: {
        initValue: [],
        required: [],
        requiredMessage: '',
        type: 'connection',
    },
    Beleidsprestaties: {
        initValue: [],
        required: [],
        requiredMessage: '',
        type: 'connection',
    },
    Belangen: {
        initValue: [],
        required: [],
        requiredMessage: '',
        type: 'connection',
    },
    Beleidsdoelen: {
        initValue: [],
        required: [],
        requiredMessage: '',
        type: 'connection',
    },
    Status: {
        initValue: 'Ontwerp GS Concept',
        required: [
            'Ontwerp in concept',
            'Ontwerp',
            'Vastgesteld',
            'Gepubliceerd',
        ],
        requiredMessage: 'Zorg dat de beleidskeuze een status heeft',
        type: 'hidden',
    },
    Tags: {
        initValue: null,
        required: [],
        requiredMessage: 'Vul het tags veld in',
        type: null,
    },
}
