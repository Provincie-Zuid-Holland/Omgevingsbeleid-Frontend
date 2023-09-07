import { useMemo } from 'react'

import { Divider, Heading, Text } from '@pzh-ui/components'

import ObjectAcknowledgedRelationPart from '@/components/DynamicObject/ObjectAcknowledgedRelationPart'

import { StepProps } from './types'

export const StepOne = ({
    title,
    model,
    relations,
    history,
    handleAction,
}: StepProps) => {
    const { singular } = model.defaults

    const amount = useMemo(() => relations?.length || 0, [relations])
    const historyAmount = useMemo(() => history?.length || 0, [history])

    return (
        <>
            <Heading level="2" className="mb-2">
                Binnengekomen verzoeken
            </Heading>

            <Text className="mb-4">
                Overzicht van verzoeken tot relatie met {singular}:{' '}
                <span className="font-bold">{title}</span>
            </Text>

            <Divider className="mb-5" />

            <Text bold>
                {amount === 1
                    ? `${amount} Openstaand verzoek`
                    : amount > 1
                    ? `${amount} Openstaande verzoeken`
                    : 'Geen openstaande verzoeken'}
            </Text>

            {relations?.map((relation, index) => (
                <div
                    key={`received-relation-${index}`}
                    className="mt-3 flex items-center">
                    <ObjectAcknowledgedRelationPart
                        type="received"
                        handleAction={handleAction}
                        {...relation}
                    />
                </div>
            ))}

            <Divider className="my-5" />

            <Text bold>
                {historyAmount === 0
                    ? 'Geen afgeronde verzoeken'
                    : historyAmount > 1
                    ? `${historyAmount} Afgeronde verzoeken`
                    : `${historyAmount} Afgerond verzoek`}
            </Text>

            {history?.map((relation, index) => (
                <div
                    key={`received-relation-${index}`}
                    className="mt-3 flex items-center">
                    <ObjectAcknowledgedRelationPart
                        type={relation.Denied ? 'declined' : 'approved'}
                        {...relation}
                    />
                </div>
            ))}

            <Divider className="my-5" />
        </>
    )
}
