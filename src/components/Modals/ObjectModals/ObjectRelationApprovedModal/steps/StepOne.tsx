import { Divider, Heading, Text } from '@pzh-ui/components'
import { useMemo } from 'react'

import ObjectAcknowledgedRelationPart from '@/components/DynamicObject/ObjectAcknowledgedRelationPart'

import { StepProps } from './types'

export const StepOne = ({
    title,
    model,
    relations,
    handleDisconnect,
}: StepProps) => {
    const { plural, singular, singularReadable } = model.defaults

    const amount = useMemo(() => relations?.length || 0, [relations])

    return (
        <>
            <Heading level="2" size="xl" className="mb-2">
                Gelegde beleidsrelaties
            </Heading>

            <Text className="mb-4">
                Overzicht van {plural} tot relatie met {singular}:{' '}
                <span className="font-bold">{title}</span>
            </Text>

            <Divider className="mb-5" />

            <Text bold>
                {amount} {amount !== 1 ? plural : singularReadable}
            </Text>

            {relations?.map((relation, index) => (
                <div
                    key={`approved-relation-${index}`}
                    className="mt-3 flex items-center">
                    <ObjectAcknowledgedRelationPart
                        type="approved"
                        handleDisconnect={handleDisconnect}
                        {...relation}
                    />
                </div>
            ))}
        </>
    )
}
