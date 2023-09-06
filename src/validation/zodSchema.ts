import { string, number, instanceof as instanceOf } from 'zod'

export const schemaDefaults = {
    requiredString: (msg = 'Dit veld is verplicht.') =>
        string({
            required_error: msg,
            invalid_type_error: msg,
        }),
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
        }).email('Onjuist e-mailadres'),
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
        .min(4, 'Vul een titel in van minimaal 4 karakters')
        .max(220, 'Vul een titel in van maximaal 220 karakters'),
    date: string({ required_error: 'Selecteer een datum' })
        .datetime('Onjuiste datum'),
    file: instanceOf(File),
}

export type Validation = {
    [K in keyof typeof schemaDefaults]?: (typeof schemaDefaults)[K]
}
