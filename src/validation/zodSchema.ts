import { isVisuallyEmpty } from '@/utils/removeEmptyInlineTags'
import {
    ZodTypeAny,
    any,
    array,
    instanceof as instanceOf,
    number,
    object,
    string,
    union,
} from 'zod'

const EMPTY_ERROR = 'Het veld is niet (goed) ingevuld.'
const EMPTY_PARAGRAPH_ERROR =
    'Lege paragrafen zijn niet toegestaan. Vul ze in of verwijder ze.'
export const EMPTY_TAGS_ERROR =
    'Er staan nog lege tags in het tekstveld, haal de lege tags weg voordat je verder kan gaan.'

export const schemaDefaults = {
    requiredString: (msg = EMPTY_ERROR) =>
        string({
            required_error: msg,
            invalid_type_error: msg,
        })
            .trim()
            .min(1, EMPTY_ERROR),
    optionalString: string().optional().nullable(),
    requiredNumber: (msg = EMPTY_ERROR) =>
        number({
            required_error: msg,
            invalid_type_error: msg,
        }),
    optionalNumber: number().optional().nullable(),
    email: (msg = EMPTY_ERROR) =>
        string({
            required_error: msg,
            invalid_type_error: msg,
        })
            .email('Onjuist e-mailadres')
            .max(255, 'Vul een e-mailadres in van maximaal 255 karakters'),
    url: (msg = EMPTY_ERROR) =>
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
    rte: () => customRteValidation(),
    optionalRte: () => customRteValidation().optional().nullable(),
    requiredArray: (msg = EMPTY_ERROR) =>
        array(
            string({
                required_error: msg,
                invalid_type_error: msg,
            })
        ).nonempty(msg),
    optionalArray: array(string()).optional().nullable(),
    options: array(union([string(), object({ label: any(), value: string() })]))
        .optional()
        .nullable()
        .transform(val => val?.map(v => (typeof v === 'string' ? v : v.value))),
}

const customRteValidation = () =>
    string({
        required_error: EMPTY_ERROR,
        invalid_type_error: EMPTY_ERROR,
    }).superRefine((html, ctx) => {
        if (isVisuallyEmpty(html)) {
            ctx.addIssue({
                code: 'custom',
                message: EMPTY_ERROR,
            })
            return
        }

        const doc = new DOMParser().parseFromString(html, 'text/html')

        const containsEmptyParagraphs = Array.from(doc.querySelectorAll('p'))
            .filter(p => !p.closest('table, li'))
            .some(p => isVisuallyEmpty(p.innerHTML))

        if (containsEmptyParagraphs) {
            ctx.addIssue({
                code: 'custom',
                message: EMPTY_PARAGRAPH_ERROR,
            })
        }

        const emptyInlineTags = Array.from(
            doc.querySelectorAll('em, strong, b, i, u, li p')
        ).some(el => isVisuallyEmpty(el.innerHTML))

        if (emptyInlineTags) {
            ctx.addIssue({
                code: 'custom',
                message: EMPTY_TAGS_ERROR,
            })
        }
    })

export type Validation = ZodTypeAny

export function zodAlwaysRefine<T extends ZodTypeAny>(zodType: T) {
    return any().superRefine(async (value, ctx) => {
        const res = await zodType.safeParseAsync(value)

        if (res.success === false)
            for (const issue of res.error.issues) {
                ctx.addIssue(issue)
            }
    }) as unknown as T
}
