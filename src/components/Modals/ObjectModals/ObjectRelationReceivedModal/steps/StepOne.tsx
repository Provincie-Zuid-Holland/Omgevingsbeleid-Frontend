import { Divider, Text } from '@pzh-ui/components'
import { useMemo } from 'react'

import ObjectAcknowledgedRelationPart from '@/components/DynamicObject/ObjectAcknowledgedRelationPart'

import { StepProps } from './types'

export const StepOne = ({ title, model, relations, history }: StepProps) => {
    const { singular } = model.defaults

    const amount = useMemo(() => relations?.length || 0, [relations])
    const historyAmount = useMemo(() => history?.length || 0, [history])

    return (
        <>
            <Text className="mb-4">
                Overzicht van verzoeken tot relatie met {singular}:{' '}
                <span className="font-bold">{title}</span>
            </Text>

            <Divider className="mb-5" />

            <Text type="body-bold">
                {amount}{' '}
                {amount > 1 ? 'Openstaande verzoeken' : 'Openstaand verzoek'}
            </Text>

            {relations?.map((relation, index) => (
                <div
                    key={`received-relation-${index}`}
                    className="flex items-center mt-3">
                    <ObjectAcknowledgedRelationPart
                        type="received"
                        {...relation}
                    />
                </div>
            ))}

            <Divider className="my-5" />

            <Text type="body-bold">
                {historyAmount === 0
                    ? 'Geen afgeronde verzoeken'
                    : historyAmount > 1
                    ? `${historyAmount} Afgeronde verzoeken`
                    : `${historyAmount} Afgerond verzoek`}
            </Text>

            <Divider className="my-5" />
        </>
    )
}
