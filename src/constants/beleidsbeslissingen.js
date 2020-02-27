export const TITEL_ENKELVOUD = 'Beleidsbeslissing'
export const TITEL_MEERVOUD = 'Beleidsbeslissingen'
export const API_ENDPOINT = 'beleidsbeslissingen'
export const SLUG_OVERZICHT = 'beleidsbeslissingen'
export const SLUG_CREATE_NEW = 'nieuwe-beleidsbeslissing'

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
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Selecteer een tweede portefeuillehouder',
    },
    Opdrachtgever: {
        initValue: null,
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Selecteer een opdrachtgever',
    },
    Omschrijving_Keuze: {
        initValue: '',
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Vul de omschrijving van de beleidsbeslissing in',
    },
    Omschrijving_Werking: {
        initValue: '',
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Vul de werking van de beleidsbeslissing in',
    },
    Aanleiding: {
        initValue: '',
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Vul het aanleiding veld in',
    },
    Afweging: {
        initValue: '',
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Vul het afwegingen veld in',
    },
    Provinciaal_Belang: {
        initValue: '',
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Vul het provinciaal belang veld in',
    },
    WerkingsGebieden: {
        initValue: [],
        required: ['Ontwerp', 'Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Selecteer een werkingsgebied',
    },
    Weblink: {
        initValue: '',
        required: ['Vastgesteld', 'Gepubliceerd'],
        requiredMessage: 'Vul de link in naar het besluitdocument op IDMS',
    },
    Besluitnummer: {
        initValue: '',
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
        initValue: 'Ontwerp in concept',
        required: [
            'Ontwerp in concept',
            'Ontwerp',
            'Vastgesteld',
            'Gepubliceerd',
        ],
        requiredMessage: 'Zorg dat de beleidsbeslissing een status heeft',
    },
    Tags: {
        initValue: '',
        required: [],
        requiredMessage: 'Vul het tags veld in',
    },
}
