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
import { useCallback, useMemo, useState } from 'react'

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
    Side_A,
    Side_B,
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
        const title = Side_B.Title ?? ''
        const description = isAwaiting
            ? (Side_A.Explanation ?? '')
            : (Side_B.Explanation ?? '')
        return { title, description }
    }, [Side_A.Explanation, Side_B.Title, Side_B.Explanation, isAwaiting])

    const composedRelation = useMemo(
        () => ({ ...rest, Side_A, Side_B }),
        [rest, Side_A, Side_B]
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
        () => handleDisconnect?.(Side_B.Object_ID, Side_B.Title),
        [handleDisconnect, Side_B.Object_ID, Side_B.Title]
    )

    return (
        <div className="w-full">
            <div
                className={clsx(
                    'bg-pzh-gray-100 border-pzh-gray-300 relative flex items-center justify-between rounded-t border p-4',
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
                                    className="bg-pzh-white mr-3"
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
                        className="border-pzh-gray-300 flex items-start rounded-b border-r border-b border-l px-4 pt-2 pb-3">
                        {!isReceived && !isAwaiting && (
                            <div className="mt-1 mr-4">
                                {(isApproved || Side_B.Acknowledged) && (
                                    <MessageCheck size={20} />
                                )}
                                {isDeclined && !Side_B.Acknowledged && (
                                    <MessageXmark size={20} />
                                )}
                            </div>
                        )}
                        {header.description && (
                            <Text>{header.description}</Text>
                        )}
                    </div>

                    {(isApproved || isDeclined) && (
                        <div className="border-pzh-gray-300 mt-2 rounded border px-4 pt-2 pb-3">
                            <div className="mb-2 flex items-center">
                                {(isApproved || Side_A.Acknowledged) && (
                                    <MessageCheck size={20} className="mr-4" />
                                )}
                                {isDeclined && !Side_A.Acknowledged && (
                                    <MessageXmark size={20} className="mr-3" />
                                )}
                                <Text bold>{Side_A.Title}</Text>
                            </div>
                            <Text className="ml-9">{Side_A.Explanation}</Text>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
