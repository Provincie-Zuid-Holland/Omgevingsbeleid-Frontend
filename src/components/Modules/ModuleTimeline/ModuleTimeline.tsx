import { Badge, Text, formatDate } from '@pzh-ui/components'
import classNames from 'clsx'
import { useMemo } from 'react'

import { ModuleStatus } from '@/api/fetchers.schemas'
import { getModuleStatusColor } from '@/utils/module'

interface ModuleTimelineProps {
    /** Array containing module history */
    statusHistory: ModuleStatus[]
}

const ModuleTimeline = ({ statusHistory }: ModuleTimelineProps) => {
    const filteredHistory = useMemo(
        () => statusHistory.filter(status => status.Status !== 'Niet-Actief'),
        [statusHistory]
    )

    return (
        <div data-testid="module-timeline" className="mt-6 sm:mt-0">
            <Text bold color="text-pzh-blue-500">
                Tijdlijn
            </Text>

            <div className="mt-4">
                {filteredHistory.map((status, index) => {
                    const hasPeer =
                        index + 1 !== filteredHistory.length &&
                        filteredHistory.length !== 1

                    return (
                        <div
                            key={status.ID}
                            className={classNames('flex items-center', {
                                'mb-5': hasPeer,
                            })}>
                            <span className="-mb-1 w-[84px] text-s">
                                {formatDate(
                                    new Date(status.Created_Date + 'Z'),
                                    'dd-MM-yyyy'
                                )}
                            </span>
                            <div className="relative mx-2 h-[13px] w-[13px] rounded-full border-2 border-pzh-blue-500">
                                {hasPeer && (
                                    <div className="absolute left-1 top-[11px] h-8 w-px bg-pzh-blue-500" />
                                )}
                            </div>

                            <Badge
                                className="truncate"
                                text={status.Status}
                                variant={getModuleStatusColor(status.Status)}
                                upperCase={false}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ModuleTimeline
