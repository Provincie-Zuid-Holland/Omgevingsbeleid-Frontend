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
const HEADING_ORDER_ERROR =
    'De koppenstructuur klopt niet. Begin met Kop 3 en sla geen kopniveaus over.'
const HEADING_FOLLOWED_BY_TEXT_ERROR =
    'Een kop moet altijd gevolgd worden door tekst.'

const HEADING_SELECTOR = 'h3, h4, h5'
const EMPTY_INLINE_TAG_SELECTOR = 'em, strong, b, i, u, li p, sub, sup'
const HEADING_TAG_REGEX = /^H[3-5]$/

export const schemaDefaults = {
    requiredString: (msg = EMPTY_ERROR) =>
        string({
            required_error: msg,
            invalid_type_error: msg,
        })
            .trim()
            .min(1, msg),

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
        string({
            required_error: msg,
            invalid_type_error: msg,
        }).datetime('Onjuiste datum'),

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

const getHeadingLevel = (heading: Element) =>
    Number(heading.tagName.substring(1))

const hasEmptyParagraphs = (doc: Document) =>
    Array.from(doc.querySelectorAll('p'))
        .filter(p => !p.closest('table, li'))
        .some(p => isVisuallyEmpty(p.innerHTML))

const hasEmptyInlineTags = (doc: Document) =>
    Array.from(doc.querySelectorAll(EMPTY_INLINE_TAG_SELECTOR)).some(el =>
        isVisuallyEmpty(el.innerHTML)
    )

const hasInvalidHeadingOrder = (headings: Element[]) =>
    headings.some((heading, index) => {
        const level = getHeadingLevel(heading)

        if (index === 0) return level !== 3

        const previousLevel = getHeadingLevel(headings[index - 1])

        return level > previousLevel + 1
    })

const hasHeadingWithoutTextAfter = (headings: Element[]) =>
    headings.some(heading => {
        const next = heading.nextElementSibling

        if (!next) return true
        if (HEADING_TAG_REGEX.test(next.tagName)) return true

        return isVisuallyEmpty(next.innerHTML)
    })

const validateHeadingStructure = (doc: Document) => {
    const headings = Array.from(doc.querySelectorAll(HEADING_SELECTOR))

    return {
        hasInvalidHeadingOrder: hasInvalidHeadingOrder(headings),
        hasHeadingWithoutTextAfter: hasHeadingWithoutTextAfter(headings),
    }
}

const addCustomIssue = (
    ctx: Parameters<Parameters<ReturnType<typeof string>['superRefine']>[0]>[1],
    message: string
) => {
    ctx.addIssue({
        code: 'custom',
        message,
    })
}

const customRteValidation = () =>
    string({
        required_error: EMPTY_ERROR,
        invalid_type_error: EMPTY_ERROR,
    }).superRefine((html, ctx) => {
        if (isVisuallyEmpty(html)) {
            addCustomIssue(ctx, EMPTY_ERROR)
            return
        }

        const doc = new DOMParser().parseFromString(html, 'text/html')

        if (hasEmptyParagraphs(doc)) {
            addCustomIssue(ctx, EMPTY_PARAGRAPH_ERROR)
        }

        if (hasEmptyInlineTags(doc)) {
            addCustomIssue(ctx, EMPTY_TAGS_ERROR)
        }

        const { hasInvalidHeadingOrder, hasHeadingWithoutTextAfter } =
            validateHeadingStructure(doc)

        if (hasInvalidHeadingOrder) {
            addCustomIssue(ctx, HEADING_ORDER_ERROR)
        }

        if (hasHeadingWithoutTextAfter) {
            addCustomIssue(ctx, HEADING_FOLLOWED_BY_TEXT_ERROR)
        }
    })

export type Validation = ZodTypeAny

export function zodAlwaysRefine<T extends ZodTypeAny>(zodType: T) {
    return any().superRefine(async (value, ctx) => {
        const res = await zodType.safeParseAsync(value)

        if (!res.success) {
            res.error.issues.forEach(issue => {
                ctx.addIssue(issue)
            })
        }
    }) as unknown as T
}
