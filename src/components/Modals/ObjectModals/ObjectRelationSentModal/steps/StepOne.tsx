import { Divider, Heading, Text } from '@pzh-ui/components'
import { useMemo } from 'react'

import ObjectAcknowledgedRelationPart from '@/components/DynamicObject/ObjectAcknowledgedRelationPart'

import { StepProps } from './types'

export const StepOne = ({
    title,
    model,
    relations,
    history,
    handleEdit,
}: StepProps) => {
    const { singular } = model.defaults

    const amount = useMemo(() => relations?.length || 0, [relations])
    const historyAmount = useMemo(() => history?.length || 0, [history])

    return (
        <>
            <Heading level="2" size="xl" className="mb-2">
                Uitgezonden verzoeken tot beleidsrelatie
            </Heading>

            <Text className="mb-4">
                Overzicht van uitgezonden verzoeken tot relatie met {singular}:{' '}
                <span className="font-bold">{title}</span>
            </Text>

            <Divider className="mb-5" />

            <Text bold>
                {amount === 1
                    ? `${amount} openstaand verzoek`
                    : amount > 1
                      ? `${amount} openstaande verzoeken`
                      : 'Geen openstaande verzoeken'}
            </Text>

            {relations?.map((relation, index) => (
                <div
                    key={`awaiting-relation-${index}`}
                    className="mt-3 flex items-center">
                    <ObjectAcknowledgedRelationPart
                        type="awaiting"
                        handleEdit={handleEdit}
                        {...relation}
                    />
                </div>
            ))}

            <Divider className="my-5" />

            <Text bold>
                {historyAmount === 0
                    ? 'Geen afgeronde verzoeken'
                    : historyAmount > 1
                      ? `${historyAmount} afgeronde verzoeken`
                      : `${historyAmount} afgerond verzoek`}
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
        </>
    )
}
