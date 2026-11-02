import { generateSchema } from './objectGeneralInformation'

const schema = generateSchema([
    'owner_1_id',
    'owner_2_id',
    'owner_3_id',
    'portfolio_holder_1_id',
])

const values = {
    owner_1_id: 'first-owner',
    owner_2_id: 'second-owner',
    owner_3_id: 'third-owner',
    portfolio_holder_1_id: 'portfolio-holder',
}

describe('static person fields in the new API schema', () => {
    it('accepts three distinct owners and uses lowercase ID keys', async () => {
        expect(await schema.parseAsync(values)).toEqual(values)
    })

    it.each(['owner_1_id', 'owner_2_id'] as const)(
        'rejects a third owner who is already %s',
        async key => {
            const result = await schema.safeParseAsync({
                ...values,
                owner_3_id: values[key],
            })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues.map(issue => issue.path[0])).toEqual(
                    expect.arrayContaining([key, 'owner_3_id'])
                )
            }
        }
    )

    it('allows an owner to also be the portfolio holder', async () => {
        const result = await schema.safeParseAsync({
            ...values,
            portfolio_holder_1_id: values.owner_3_id,
        })
        expect(result.success).toBe(true)
    })
})
