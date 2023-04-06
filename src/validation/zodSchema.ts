import { z } from 'zod'

export const schemaDefaults = {
    requiredString: (msg = 'Dit veld is verplicht.') =>
        z.string({
            required_error: msg,
            invalid_type_error: msg,
        }),
    optionalString: z.string().optional().nullable(),
    requiredNumber: (msg = 'Dit veld is verplicht.') =>
        z.number({
            required_error: msg,
            invalid_type_error: msg,
        }),
    email: (msg = 'Dit veld is verplicht.') =>
        z
            .string({
                required_error: msg,
                invalid_type_error: msg,
            })
            .email('Onjuist e-mailadres'),
    url: (msg = 'Dit veld is verplicht.') =>
        z
            .string({
                required_error: msg,
                invalid_type_error: msg,
            })
            .url('Onjuiste link'),
    title: z
        .string({ required_error: 'Vul een titel in' })
        .min(4, 'Vul een titel in van minimaal 4 karakters')
        .max(100, 'Vul een titel in van maximaal 100 karakters'),
    date: z
        .string({ required_error: 'Selecteer een datum' })
        .datetime('Onjuiste datum'),
}

export type Validation = {
    [K in keyof typeof schemaDefaults]?: typeof schemaDefaults[K]
}
