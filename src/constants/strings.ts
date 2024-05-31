export const strings = {
    FORM_REQUIRED_FIELD: 'Dit veld is verplicht',
    FORM_EMAIL_INVALID: 'Onjuist e-mailadres',
    FORM_EMAIL_MAX_CHARS: 'Vul een e-mailadres in van maximaal 255 karakters',
    FORM_URL_INVALID: 'Onjuiste link',
    FORM_TITLE_REQUIRED: 'Vul een titel in',
    FORM_TITLE_MIN_CHARS: 'Vul een titel in van minimaal 4 karakters',
    FORM_TITLE_MAX_CHARS: 'Vul een titel in van maximaal 220 karakters',
    FORM_DATE_REQUIRED: 'Selecteer een datum',
    FORM_DATE_INVALID: 'Onjuiste datum',
    FORM_RTE_EMPTY_PARAGRAPH:
        'Lege paragrafen zijn niet toegestaan. Vul ze in of verwijder ze.',
    TXT_NO_RESULTS: 'Er zijn geen resultaten gevonden',
    LBL_EMAIL: 'omgevingsbeleid@pzh.nl',
} as const

/**
 * Export the strings collection as optimized enum
 */
export type strings = (typeof strings)[keyof typeof strings]
