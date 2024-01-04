import { Badge, Text } from '@pzh-ui/components'
import classNames from 'classnames'
import { useMemo } from 'react'

import { ModuleStatus } from '@/api/fetchers.schemas'
import formatDate from '@/utils/formatDate'
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
            <Text bold color="text-pzh-blue">
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
                            <div className="size-[13px] relative mx-2 rounded-full border-2 border-pzh-blue">
                                {hasPeer && (
                                    <div className="absolute left-1 top-[11px] h-8 w-px bg-pzh-blue" />
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
