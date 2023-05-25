import { Divider, Heading, Text } from '@pzh-ui/components'
import { LinkSlash } from '@pzh-ui/icons'
import { useMemo } from 'react'

import ObjectAcknowledgedRelationPart from '@/components/DynamicObject/ObjectAcknowledgedRelationPart'

import { StepProps } from './types'

export const StepOne = ({
    title,
    model,
    relations,
    handleDisconnect,
}: StepProps) => {
    const { plural, pluralCapitalize, singular, singularCapitalize } =
        model.defaults

    const amount = useMemo(() => relations?.length || 0, [relations])

    return (
        <>
            <Heading level="2" className="mb-2">
                Gelegde beleidsrelaties
            </Heading>

            <Text className="mb-4">
                Overzicht van {plural} tot relatie met {singular}:{' '}
                <span className="font-bold">{title}</span>
            </Text>

            <Divider className="mb-5" />

            <Text type="body-bold">
                {amount} {amount !== 1 ? pluralCapitalize : singularCapitalize}
            </Text>

            {relations?.map((relation, index) => (
                <div
                    key={`approved-relation-${index}`}
                    className="flex items-center mt-3">
                    <ObjectAcknowledgedRelationPart
                        type="approved"
                        {...relation}
                    />
                    <button
                        type="button"
                        className="px-3"
                        onClick={() =>
                            handleDisconnect(
                                relation.Side_B.Object_ID,
                                relation.Side_B.Title
                            )
                        }>
                        <LinkSlash size={20} className="text-pzh-red" />
                        <span className="sr-only">Wijzigen</span>
                    </button>
                </div>
            ))}

            <Divider className="my-5" />
        </>
    )
}
