import { Button, Text } from '@pzh-ui/components'
import {
    AngleDown,
    Ban,
    CircleCheck,
    MessageCheck,
    MessageQuestion,
    MessageXmark,
    Share,
} from '@pzh-ui/icons'
import classNames from 'clsx'
import { useMemo, useState } from 'react'

import { AcknowledgedRelation } from '@/api/fetchers.schemas'

interface ObjectAcknowledgedRelationPartProps extends AcknowledgedRelation {
    /** Type of relation */
    type: 'awaiting' | 'approved' | 'declined' | 'received'
    /** Handle action function */
    handleAction?: (type: 'accept' | 'deny', e: AcknowledgedRelation) => void
}

const ObjectAcknowledgedRelationPart = ({
    type,
    Side_A,
    Side_B,
    handleAction,
    ...rest
}: ObjectAcknowledgedRelationPartProps) => {
    const [open, setOpen] = useState(false)

    const Icon =
        type === 'awaiting'
            ? Share
            : type === 'approved'
              ? CircleCheck
              : type === 'received'
                ? MessageQuestion
                : Ban

    const { title, description } = useMemo(() => {
        switch (type) {
            case 'approved':
            case 'declined':
            case 'received':
                return { title: Side_B.Title, description: Side_B.Explanation }
            case 'awaiting':
                return { title: Side_B.Title, description: Side_A.Explanation }
            default:
                return { title: '', description: '' }
        }
    }, [type, Side_A, Side_B])

    return (
        <div className="w-full">
            <div
                className={classNames(
                    'border-pzh-gray-300 bg-pzh-gray-100 relative flex items-center justify-between rounded-t border px-3 py-2',
                    {
                        'rounded-b': !open && type !== 'received',
                    }
                )}>
                <div className="flex items-center">
                    <Icon
                        size={16}
                        className={classNames('mr-3', {
                            'text-pzh-yellow-900': type === 'awaiting',
                            'text-pzh-green-500': type === 'approved',
                            'text-pzh-red-500': type === 'declined',
                            'text-pzh-orange-500': type === 'received',
                        })}
                    />
                    <Text bold>{title}</Text>
                </div>
                {type !== 'received' ? (
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="after:content-[' '] after:absolute after:top-0 after:left-0 after:h-full after:w-full">
                        <AngleDown
                            size={18}
                            className={classNames('transition', {
                                'rotate-180': open,
                            })}
                        />
                        <span className="sr-only">
                            {open ? 'Lees meer' : 'Lees minder'}
                        </span>
                    </button>
                ) : (
                    !!handleAction && (
                        <div className="flex">
                            <Button
                                variant="secondary"
                                size="small"
                                className="bg-pzh-white mr-3"
                                onPress={() =>
                                    handleAction('deny', {
                                        ...rest,
                                        Side_A,
                                        Side_B,
                                    })
                                }>
                                Afwijzen
                            </Button>
                            <Button
                                variant="cta"
                                size="small"
                                onPress={() =>
                                    handleAction('accept', {
                                        ...rest,
                                        Side_A,
                                        Side_B,
                                    })
                                }>
                                Accepteren
                            </Button>
                        </div>
                    )
                )}
            </div>
            {(open || type === 'received') && (
                <>
                    <div className="border-pzh-gray-300 flex items-start rounded-b border-r border-b border-l px-3 pt-2 pb-3">
                        {type !== 'received' && type !== 'awaiting' && (
                            <div className="mt-1 mr-3 w-4">
                                {type === 'approved' || Side_B.Acknowledged ? (
                                    <MessageCheck size={20} />
                                ) : (
                                    type === 'declined' &&
                                    !Side_B.Acknowledged && (
                                        <MessageXmark size={20} />
                                    )
                                )}
                            </div>
                        )}
                        <Text>{description}</Text>
                    </div>
                    {(type === 'approved' || type === 'declined') && (
                        <div className="border-pzh-gray-300 mt-2 rounded border px-3 pt-2 pb-3">
                            <div className="mb-2 flex items-center">
                                {type === 'approved' || Side_A.Acknowledged ? (
                                    <MessageCheck size={20} className="mr-3" />
                                ) : (
                                    type === 'declined' &&
                                    !Side_A.Acknowledged && (
                                        <MessageXmark
                                            size={20}
                                            className="mr-3"
                                        />
                                    )
                                )}
                                <Text bold>{Side_A.Title}</Text>
                            </div>
                            <Text className="ml-7">{Side_A.Explanation}</Text>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default ObjectAcknowledgedRelationPart
