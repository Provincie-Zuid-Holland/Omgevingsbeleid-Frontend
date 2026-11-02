import { useCallback, useMemo, useState } from 'react'

import { Button, Text } from '@pzh-ui/components'
import {
    AngleDown,
    Ban,
    CircleCheck,
    LinkSlash,
    MessageCheck,
    MessageQuestion,
    MessageXmark,
    PenToSquare,
    Share,
} from '@pzh-ui/icons'

import clsx from 'clsx'

import { AcknowledgedRelation } from '@/api/fetchers.schemas'

type RelationType = 'awaiting' | 'approved' | 'declined' | 'received'

interface ObjectAcknowledgedRelationPartProps extends AcknowledgedRelation {
    /** Type of relation */
    type: RelationType
    /** Handle action function */
    handleAction?: (type: 'accept' | 'deny', e: AcknowledgedRelation) => void
    /** Handle edit function */
    handleEdit?: (relation: AcknowledgedRelation) => void
    /** Handle disconnect function */
    handleDisconnect?: (Object_ID: number, Title?: string | null) => void
}

const ICON_BY_TYPE: Record<
    RelationType,
    React.ComponentType<{ size?: number; className?: string }>
> = {
    awaiting: Share,
    approved: CircleCheck,
    declined: Ban,
    received: MessageQuestion,
}

const ICON_COLOR_BY_TYPE: Record<RelationType, string> = {
    awaiting: 'text-pzh-yellow-900',
    approved: 'text-pzh-green-500',
    declined: 'text-pzh-red-500',
    received: 'text-pzh-orange-500',
}

export default function ObjectAcknowledgedRelationPart({
    type,
    side_a,
    side_b,
    handleAction,
    handleEdit,
    handleDisconnect,
    ...rest
}: ObjectAcknowledgedRelationPartProps) {
    const [open, setOpen] = useState(false)

    const isAwaiting = type === 'awaiting'
    const isApproved = type === 'approved'
    const isDeclined = type === 'declined'
    const isReceived = type === 'received'
    const isCollapsible = !isReceived

    const Icon = ICON_BY_TYPE[type]
    const iconColor = ICON_COLOR_BY_TYPE[type]

    const header = useMemo(() => {
        // Title always from Side_B
        // Description: awaiting => Side_A.Explanation, otherwise Side_B.Explanation
        const title = side_b.title ?? ''
        const description = isAwaiting
            ? (side_a.explanation ?? '')
            : (side_b.explanation ?? '')
        return { title, description }
    }, [side_a.explanation, side_b.title, side_b.explanation, isAwaiting])

    const composedRelation = useMemo(
        () => ({ ...rest, side_a, side_b }),
        [rest, side_a, side_b]
    )

    const onAccept = useCallback(
        () => handleAction?.('accept', composedRelation),
        [handleAction, composedRelation]
    )
    const onDeny = useCallback(
        () => handleAction?.('deny', composedRelation),
        [handleAction, composedRelation]
    )
    const onEdit = useCallback(
        () => handleEdit?.(composedRelation),
        [handleEdit, composedRelation]
    )
    const onDisconnect = useCallback(
        () => handleDisconnect?.(side_b.object_id, side_b.title),
        [handleDisconnect, side_b.object_id, side_b.title]
    )

    return (
        <div className="w-full">
            <div
                className={clsx(
                    'relative flex items-center justify-between rounded-t border border-pzh-gray-300 bg-pzh-gray-100 p-4',
                    { 'rounded-b': !open && !isReceived }
                )}>
                <div className="flex items-center">
                    <Icon size={16} className={clsx('mr-3', iconColor)} />
                    <Text bold>{header.title}</Text>
                </div>

                <div className="flex content-center">
                    {isAwaiting && !!handleEdit && (
                        <Button
                            variant="default"
                            className="z-10 mr-3"
                            onClick={onEdit}>
                            <PenToSquare
                                size={18}
                                className="text-pzh-green-500"
                            />
                            <span className="sr-only">Wijzigen</span>
                        </Button>
                    )}

                    {isApproved && !!handleDisconnect && (
                        <Button
                            variant="default"
                            className="z-10 mr-3"
                            onClick={onDisconnect}>
                            <LinkSlash size={18} className="text-pzh-red-500" />
                            <span className="sr-only">Verbreken</span>
                        </Button>
                    )}

                    {isCollapsible ? (
                        <Button
                            variant="default"
                            onClick={() => setOpen(v => !v)}
                            className="after:content-[' '] after:absolute after:top-0 after:left-0 after:h-full after:w-full"
                            aria-expanded={open}
                            aria-controls="relation-details">
                            <AngleDown
                                size={18}
                                className={clsx('transition', {
                                    'rotate-180': open,
                                })}
                            />
                            <span className="sr-only">
                                {open ? 'Lees minder' : 'Lees meer'}
                            </span>
                        </Button>
                    ) : (
                        !!handleAction && (
                            <div className="flex">
                                <Button
                                    variant="secondary"
                                    size="small"
                                    className="mr-3 bg-pzh-white"
                                    onPress={onDeny}>
                                    Afwijzen
                                </Button>
                                <Button
                                    variant="cta"
                                    size="small"
                                    onPress={onAccept}>
                                    Accepteren
                                </Button>
                            </div>
                        )
                    )}
                </div>
            </div>

            {(open || isReceived) && (
                <>
                    <div
                        id="relation-details"
                        className="flex items-start rounded-b border-r border-b border-l border-pzh-gray-300 px-4 pt-2 pb-3">
                        {!isReceived && !isAwaiting && (
                            <div className="mt-1 mr-4">
                                {(isApproved || side_b.acknowledged) && (
                                    <MessageCheck size={20} />
                                )}
                                {isDeclined && !side_b.acknowledged && (
                                    <MessageXmark size={20} />
                                )}
                            </div>
                        )}
                        {header.description && (
                            <Text>{header.description}</Text>
                        )}
                    </div>

                    {(isApproved || isDeclined) && (
                        <div className="mt-2 rounded border border-pzh-gray-300 px-4 pt-2 pb-3">
                            <div className="mb-2 flex items-center">
                                {(isApproved || side_a.acknowledged) && (
                                    <MessageCheck size={20} className="mr-4" />
                                )}
                                {isDeclined && !side_a.acknowledged && (
                                    <MessageXmark size={20} className="mr-3" />
                                )}
                                <Text bold>{side_a.title}</Text>
                            </div>
                            <Text className="ml-9">{side_a.explanation}</Text>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
