import { Fragment, useMemo } from 'react'

import { Badge, cn, formatDate, Text } from '@pzh-ui/components'

import { ModuleStatus } from '@/api/fetchers.schemas'
import { getModuleStatusColor } from '@/utils/module'
import { parseUtc } from '@/utils/parseUtc'

interface ModuleTimelineProps {
    /** Array containing module history */
    statusHistory: ModuleStatus[]
}

const ModuleTimeline = ({ statusHistory }: ModuleTimelineProps) => {
    const filteredHistory = useMemo(
        () =>
            statusHistory
                .filter(status => status.Status !== 'Niet-Actief')
                .sort(
                    (a, b) =>
                        parseUtc(b.Created_Date).getTime() -
                        parseUtc(a.Created_Date).getTime()
                ),
        [statusHistory]
    )

    return (
        <div data-testid="module-timeline" className="mt-6 sm:mt-0">
            <Text bold color="text-pzh-blue-500">
                Tijdlijn
            </Text>

            <div className="mt-4 grid grid-cols-[max-content_45px_1fr] items-center gap-y-5">
                {filteredHistory.map((status, index) => {
                    const hasPeer =
                        index + 1 !== filteredHistory.length &&
                        filteredHistory.length !== 1

                    return (
                        <Fragment key={status.ID}>
                            <span className="text-s whitespace-nowrap">
                                {formatDate(
                                    parseUtc(status.Created_Date),
                                    'dd-MM-yyyy, kk:mm'
                                )}
                            </span>

                            <div className="relative flex items-start justify-center">
                                <div
                                    className={cn(
                                        'bg-white h-[13px] w-[13px] rounded-full border-2 border-pzh-blue-500',
                                        {
                                            'bg-pzh-blue-500 outline-2 outline-offset-1 outline-pzh-blue-500':
                                                index === 0,
                                        }
                                    )}
                                />
                                {hasPeer && (
                                    <div
                                        className={cn(
                                            'absolute top-[13px] left-1/2 h-8 w-px -translate-x-1/2 bg-pzh-blue-500',
                                            {
                                                'top-4 h-7': index === 0,
                                            }
                                        )}
                                    />
                                )}
                            </div>

                            <Badge
                                className="w-fit truncate"
                                text={status.Status}
                                variant={getModuleStatusColor(status.Status)}
                                solid={index === 0}
                                upperCase={false}
                            />
                        </Fragment>
                    )
                })}
            </div>
        </div>
    )
}

export default ModuleTimeline
