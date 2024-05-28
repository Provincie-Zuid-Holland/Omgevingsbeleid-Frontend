import { custom, instanceof as instanceOf, number, string } from 'zod'

export const schemaDefaults = {
    requiredString: (msg = 'Dit veld is verplicht.') =>
        string({
            required_error: msg,
            invalid_type_error: msg,
        }).trim(),
    optionalString: string().optional().nullable(),
    requiredNumber: (msg = 'Dit veld is verplicht.') =>
        number({
            required_error: msg,
            invalid_type_error: msg,
        }),
    email: (msg = 'Dit veld is verplicht.') =>
        string({
            required_error: msg,
            invalid_type_error: msg,
        })
            .email('Onjuist e-mailadres')
            .max(255, 'Vul een e-mailadres in van maximaal 255 karakters'),
    url: (msg = 'Dit veld is verplicht.') =>
        string({
            required_error: msg,
            invalid_type_error: msg,
        }).url('Onjuiste link'),
    optionalUrl: string().url('Onjuiste link').optional().nullable(),
    title: string({
        required_error: 'Vul een titel in',
        invalid_type_error: 'Vul een titel in',
    })
        .trim()
        .min(4, 'Vul een titel in van minimaal 4 karakters')
        .max(220, 'Vul een titel in van maximaal 220 karakters'),
    date: string({ required_error: 'Selecteer een datum' }).datetime(
        'Onjuiste datum'
    ),
    file: instanceOf(File),
    rte: (msg = 'Het is niet toegestaan om lege paragrafen te gebruiken.') =>
        customRteValidation(msg).and(
            string({
                required_error: 'Dit veld is verplicht.',
                invalid_type_error: 'Dit veld is verplicht.',
            })
        ),
    optionalRte: (
        msg = 'Lege paragrafen zijn niet toegestaan. Vul ze in of verwijder ze.'
    ) => customRteValidation(msg).optional().nullable(),
}

const customRteValidation = (msg: string) =>
    custom<string>(html => {
        const doc = new DOMParser().parseFromString(html as string, 'text/html')

        const containsEmptyParagraphs = Array.from(
            doc.querySelectorAll('p')
        ).some(p => p.innerHTML.trim() === '<br>' || p.innerHTML.trim() === '')

        return !containsEmptyParagraphs
    }, msg)

export type Validation = {
    [K in keyof typeof schemaDefaults]?: (typeof schemaDefaults)[K]
}
