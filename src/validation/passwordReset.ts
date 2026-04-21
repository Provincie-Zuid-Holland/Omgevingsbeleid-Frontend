import { ZodIssueCode, object, string } from 'zod'

const noLeadingOrTrailingSpaces = (value: string) => value === value.trim()

export const SCHEMA = object({
    currentPassword: string({
        required_error: 'Vul je huidige wachtwoord in',
    }).refine(
        noLeadingOrTrailingSpaces,
        'Spaties aan het begin of einde zijn niet toegestaan'
    ),
    newPassword: string({ required_error: 'Vul een nieuw wachtwoord in' })
        .min(12, 'Gebruik minimaal 12 tekens')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{12,}$/,
            'Gebruik minimaal 1 hoofdletter, 1 kleine letter, 1 cijfer en 1 speciaal teken'
        )
        .refine(
            noLeadingOrTrailingSpaces,
            'Spaties aan het begin of einde zijn niet toegestaan'
        ),
    newPasswordCopy: string({
        required_error: 'Herhaal hier je nieuwe wachtwoord',
    }),
}).superRefine(({ currentPassword, newPassword, newPasswordCopy }, ctx) => {
    if (currentPassword === newPassword) {
        ctx.addIssue({
            code: ZodIssueCode.custom,
            message:
                'Het nieuwe wachtwoord mag niet gelijk zijn aan het oude wachtwoord',
            path: ['newPassword'],
        })
    }

    if (newPassword !== newPasswordCopy) {
        ctx.addIssue({
            code: ZodIssueCode.custom,
            message: 'Het herhaalde wachtwoord komt niet overeen',
            path: ['newPasswordCopy'],
        })
    }
})
