import { z } from 'zod'

export const schemaDefaults = {
    requiredString: (msg = 'Dit veld is verplicht.') =>
        z.string({
            required_error: msg,
        }),
    optionalString: z.string().optional().nullable(),
    requiredNumber: (msg = 'Dit veld is verplicht.') =>
        z.number({
            required_error: msg,
        }),
    email: (msg = 'Dit veld is verplicht.') =>
        z
            .string({
                required_error: msg,
            })
            .email('Onjuist e-mailadres'),
    title: z
        .string({ required_error: 'Vul een titel in' })
        .min(4, 'Vul een titel in van minimaal 4 karakters')
        .max(100, 'Vul een titel in van maximaal 100 karakters'),
}
