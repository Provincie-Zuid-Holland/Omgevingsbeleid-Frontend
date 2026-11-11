import { describe, expect, it } from 'vitest'

import { getStaticDataFilterRoles, ownerFields } from '@/utils/dynamicObject'

import { SCHEMA_ADD_OBJECT_STEPS } from './modules'
import { generateSchema } from './objectGeneralInformation'

describe.each([
    ['eigenaren wijzigen', generateSchema([...ownerFields])],
    ['object aan module toevoegen', SCHEMA_ADD_OBJECT_STEPS[2]],
])('%s', (_, schema) => {
    const valid = {
        Title: 'Een beleidsonderdeel',
        Owner_1_UUID: 'owner-1',
        Owner_2_UUID: 'owner-2',
        Owner_3_UUID: 'owner-3',
    }

    it.each([
        ['Owner_1_UUID', 'Owner_2_UUID'],
        ['Owner_1_UUID', 'Owner_3_UUID'],
        ['Owner_2_UUID', 'Owner_3_UUID'],
    ] as const)(
        'rejects duplicate owners in %s and %s',
        async (first, second) => {
            const result = await schema.safeParseAsync({
                ...valid,
                [second]: valid[first],
            })

            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues.map(issue => issue.path[0])).toEqual(
                    [first, second]
                )
            }
        }
    )

    it('requires the ambtelijk opdrachtnemer only', async () => {
        const input = {
            Title: valid.Title,
            Owner_2_UUID: null,
            Owner_3_UUID: null,
        }

        expect((await schema.safeParseAsync(input)).success).toBe(false)
        expect(
            (
                await schema.safeParseAsync({
                    ...input,
                    Owner_1_UUID: valid.Owner_1_UUID,
                })
            ).success
        ).toBe(true)
        expect((await schema.safeParseAsync(valid)).success).toBe(true)
    })
})

it('only offers behandelend ambtenaren for ambtelijk opdrachtnemer', () => {
    expect(getStaticDataFilterRoles('Owner_1_UUID')).toEqual([
        'Behandelend Ambtenaar',
    ])
})
