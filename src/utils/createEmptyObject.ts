import clone from 'lodash.clonedeep'
import type { input, ZodTypeAny } from 'zod'

function createEmptyObject<T extends ZodTypeAny>(schema: T): input<T> {
    const def = schema._def

    switch (def.typeName) {
        case 'ZodObject':
            const outputObject: Record<string, any> = {}
            Object.entries(def.shape()).forEach(
                ([key, value]) =>
                    (outputObject[key] = createEmptyObject(value as ZodTypeAny))
            )
            return outputObject
        case 'ZodRecord':
            return {}
        case 'ZodString':
            return ''
        case 'ZodNumber':
            for (const check of def.checks || []) {
                if (['min', 'max'].includes(check.kind)) {
                    return check.value
                }
            }
            return 0
        case 'ZodBigInt':
            return 0
        case 'ZodBoolean':
            return false
        case 'ZodDate':
            return new Date()
        case 'ZodLiteral':
            return def.value
        case 'ZodEffects':
            return createEmptyObject(def.schema)
        case 'ZodArray':
            return []
        case 'ZodTuple':
            return def.items.map((item: ZodTypeAny) => createEmptyObject(item))
        case 'ZodSet':
            return new Set()
        case 'ZodMap':
            return new Map()
        case 'ZodEnum':
            return def.values[0]
        case 'ZodNativeEnum':
            return Object.values(def.values).filter(
                value => typeof def.values[value as any] !== 'number'
            )[0]
        case 'ZodUnion':
            return createEmptyObject(def.options[0])
        case 'ZodDiscriminatedUnion':
            return createEmptyObject(
                Array.from(def.options.values() as any[])[0]
            )
        case 'ZodIntersection':
            return Object.assign(
                createEmptyObject(def.left) as any,
                createEmptyObject(def.right)
            )
        case 'ZodFunction':
            return (..._: any[]) => createEmptyObject(def.returns)
        case 'ZodDefault':
            return def.innerType._def.typeName === 'ZodFunction'
                ? def.defaultValue()
                : clone(def.defaultValue())
        case 'ZodNaN':
            return NaN
        case 'ZodNull':
        case 'ZodNullable':
            return null
        case 'ZodUndefined':
        case 'ZodVoid':
        case 'ZodOptional':
        case 'ZodAny':
        case 'ZodUnknown':
        case 'ZodNever':
        default:
            return undefined
    }
}
export default createEmptyObject
