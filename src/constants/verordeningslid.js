export const TITEL_ENKELVOUD = 'Lid'
export const TITEL_MEERVOUD = 'Leden'
export const TYPE = 'Lid'

export const CRUD_PROPERTIES = {
    Titel: {
        initValue: '',
        required: true,
        requiredMessage: 'Vul een titel in',
    },
    Volgnummer: {
        initValue: '',
        required: true,
        requiredMessage: 'Vul een volgnummer in',
    },
    Begin_Geldigheid: {
        initValue: null,
        required: true,
        requiredMessage: 'Vul een datum van inwerkingstreding in',
    },
    Eind_Geldigheid: {
        initValue: null,
        required: false,
        requiredMessage: 'Vul een datum van uitwerkingstreding in',
    },
    Status: {
        initValue: 'Vigerend',
    },
    Type: {
        initValue: 'Paragraaf',
    },
}
