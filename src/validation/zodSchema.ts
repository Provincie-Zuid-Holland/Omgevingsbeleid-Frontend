import { custom, instanceof as instanceOf, number, string } from 'zod'

import { strings } from '@/constants/strings'

export const schemaDefaults = {
    requiredString: (msg = strings.FORM_REQUIRED_FIELD) =>
        string({
            required_error: msg,
            invalid_type_error: msg,
        }).trim(),
    optionalString: string().optional().nullable(),
    requiredNumber: (msg = strings.FORM_REQUIRED_FIELD) =>
        number({
            required_error: msg,
            invalid_type_error: msg,
        }),
    optionalNumber: number().optional().nullable(),
    email: (msg = strings.FORM_REQUIRED_FIELD) =>
        string({
            required_error: msg,
            invalid_type_error: msg,
        })
            .email(strings.FORM_EMAIL_INVALID)
            .max(255, strings.FORM_EMAIL_MAX_CHARS),
    url: (msg = strings.FORM_REQUIRED_FIELD) =>
        string({
            required_error: msg,
            invalid_type_error: msg,
        }).url(strings.FORM_URL_INVALID),
    optionalUrl: string().url(strings.FORM_URL_INVALID).optional().nullable(),
    title: string({
        required_error: strings.FORM_TITLE_REQUIRED,
        invalid_type_error: strings.FORM_TITLE_REQUIRED,
    })
        .trim()
        .min(4, strings.FORM_TITLE_MIN_CHARS)
        .max(220, strings.FORM_TITLE_MAX_CHARS),
    date: (msg = strings.FORM_DATE_REQUIRED) =>
        string({ required_error: msg, invalid_type_error: msg }).datetime(
            strings.FORM_DATE_INVALID
        ),
    optionalDate: string().datetime().optional().nullable(),
    file: instanceOf(File),
    rte: () =>
        customRteValidation().and(
            string({
                required_error: strings.FORM_REQUIRED_FIELD,
                invalid_type_error: strings.FORM_REQUIRED_FIELD,
            })
        ),
    optionalRte: () => customRteValidation().optional().nullable(),
}

const customRteValidation = () =>
    custom<string>(html => {
        const doc = new DOMParser().parseFromString(html as string, 'text/html')

        const containsEmptyParagraphs = Array.from(
            doc.querySelectorAll('p')
        ).some(p => p.innerHTML.trim() === '<br>' || p.innerHTML.trim() === '')

        return !containsEmptyParagraphs
    }, strings.FORM_RTE_EMPTY_PARAGRAPH)

export type Validation = {
    [K in keyof typeof schemaDefaults]?: (typeof schemaDefaults)[K]
}
