export const TITEL_ENKELVOUD = 'Beleidskeuze'
export const TITEL_MEERVOUD = 'Beleidskeuzes'
export const API_ENDPOINT = 'beleidsbeslissingen'
export const SLUG_OVERZICHT = 'beleidskeuzes'
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
    },
    Eigenaar_2: {
        initValue: null,
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Selecteer een tweede eigenaar',
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
    },
    Portefeuillehouder_2: {
        initValue: null,
        required: [],
        requiredMessage: 'Selecteer een tweede portefeuillehouder',
    },
    Opdrachtgever: {
        initValue: null,
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Selecteer een opdrachtgever',
    },
    Omschrijving_Keuze: {
        initValue: null,
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Vul de omschrijving van de beleidskeuze in',
    },
    Omschrijving_Werking: {
        initValue: null,
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Vul de werking van de beleidskeuze in',
    },
    Aanleiding: {
        initValue: null,
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Vul het aanleiding veld in',
    },
    Provinciaal_Belang: {
        initValue: null,
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Vul het provinciaal belang veld in',
    },
    WerkingsGebieden: {
        initValue: [],
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Selecteer een werkingsgebied',
    },
    Weblink: {
        initValue: null,
        required: ['Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Vul de link in naar het besluitdocument op IDMS',
    },
    Besluitnummer: {
        initValue: null,
        required: ['Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Vul het besluitnummer veld in van ',
    },
    Begin_Geldigheid: {
        initValue: null,
        required: ['Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Vul een datum van inwerkingstreding in',
    },
    Eind_Geldigheid: {
        initValue: null,
        required: [],
        requiredMessage: 'Vul een datum van uitwerkingstreding in',
    },
    BeleidsRegels: {
        initValue: [],
        required: [],
        requiredMessage: '',
    },
    Verordening: {
        initValue: [],
        required: [],
        requiredMessage: '',
    },
    Maatregelen: {
        initValue: [],
        required: [],
        requiredMessage: '',
    },
    Themas: {
        initValue: [],
        required: [],
        requiredMessage: '',
    },
    Ambities: {
        initValue: [],
        required: [],
        requiredMessage: '',
    },
    Doelen: {
        initValue: [],
        required: [],
        requiredMessage: '',
    },
    Belangen: {
        initValue: [],
        required: [],
        requiredMessage: '',
    },
    Opgaven: {
        initValue: [],
        required: [],
        requiredMessage: '',
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
    },
    Tags: {
        initValue: null,
        required: [],
        requiredMessage: 'Vul het tags veld in',
    },
}
