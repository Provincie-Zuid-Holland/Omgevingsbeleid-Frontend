import { Divider, Heading, Text } from '@pzh-ui/components'
import { PenToSquare } from '@pzh-ui/icons'
import { useMemo } from 'react'

import ObjectAcknowledgedRelationPart from '@/components/DynamicObject/ObjectAcknowledgedRelationPart/ObjectAcknowledgedRelationPart'

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
            <Heading level="2" className="mb-2">
                Uitgezonden verzoeken tot beleidsrelatie
            </Heading>

            <Text className="mb-4">
                Overzicht van uitgezonden verzoeken tot relatie met {singular}:{' '}
                <span className="font-bold">{title}</span>
            </Text>

            <Divider className="mb-5" />

            <Text type="body-bold">
                {amount}{' '}
                {amount > 1 ? 'Openstaande verzoeken' : 'Openstaand verzoek'}
            </Text>

            {relations?.map((relation, index) => (
                <div
                    key={`awaiting-relation-${index}`}
                    className="flex items-center mt-3">
                    <ObjectAcknowledgedRelationPart
                        type="awaiting"
                        {...relation}
                    />
                    <button
                        type="button"
                        className="px-3"
                        onClick={() => handleEdit(relation)}>
                        <PenToSquare size={20} className="text-pzh-green" />
                        <span className="sr-only">Wijzigen</span>
                    </button>
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
