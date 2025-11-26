import {
    ZodTypeAny,
    any,
    array,
    custom,
    instanceof as instanceOf,
    number,
    string,
} from 'zod'

export const schemaDefaults = {
    requiredString: (msg = 'Het veld is niet (goed) ingevuld.') =>
        string({
            required_error: msg,
            invalid_type_error: msg,
        })
            .trim()
            .min(1, 'Het veld is niet (goed) ingevuld.'),
    optionalString: string().optional().nullable(),
    requiredNumber: (msg = 'Het veld is niet (goed) ingevuld.') =>
        number({
            required_error: msg,
            invalid_type_error: msg,
        }),
    optionalNumber: number().optional().nullable(),
    email: (msg = 'Het veld is niet (goed) ingevuld.') =>
        string({
            required_error: msg,
            invalid_type_error: msg,
        })
            .email('Onjuist e-mailadres')
            .max(255, 'Vul een e-mailadres in van maximaal 255 karakters'),
    url: (msg = 'Het veld is niet (goed) ingevuld.') =>
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
    date: (msg = 'Selecteer een datum') =>
        string({ required_error: msg, invalid_type_error: msg }).datetime(
            'Onjuiste datum'
        ),
    optionalDate: string().datetime().optional().nullable(),
    file: instanceOf(File),
    rte: () =>
        customRteValidation().and(
            string({
                required_error: 'Het veld is niet (goed) ingevuld.',
                invalid_type_error: 'Het veld is niet (goed) ingevuld.',
            })
        ),
    optionalRte: () => customRteValidation().optional().nullable(),
    requiredArray: (msg = 'Het veld is niet (goed) ingevuld.') =>
        array(
            string({
                required_error: msg,
                invalid_type_error: msg,
            })
        ).nonempty(msg),
    optionalArray: array(string()).optional().nullable(),
}

const customRteValidation = () =>
    custom<string>(html => {
        const doc = new DOMParser().parseFromString(html as string, 'text/html')

        const containsEmptyParagraphs = Array.from(doc.querySelectorAll('p'))
            // exclude <p> elements that are inside tables
            .filter(p => !p.closest('table'))
            .some(
                p => p.innerHTML.trim() === '<br>' || p.innerHTML.trim() === ''
            )

        return !containsEmptyParagraphs
    }, 'Lege paragrafen zijn niet toegestaan. Vul ze in of verwijder ze.')

export type Validation = {
    [K in keyof typeof schemaDefaults]?: (typeof schemaDefaults)[K]
}

export function zodAlwaysRefine<T extends ZodTypeAny>(zodType: T) {
    return any().superRefine(async (value, ctx) => {
        const res = await zodType.safeParseAsync(value)

        if (res.success === false)
            for (const issue of res.error.issues) {
                ctx.addIssue(issue)
            }
    }) as unknown as T
}
