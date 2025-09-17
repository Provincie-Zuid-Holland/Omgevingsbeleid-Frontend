import { Badge, Text, formatDate } from '@pzh-ui/components'
import classNames from 'clsx'
import { useMemo } from 'react'

import { ModuleStatus } from '@/api/fetchers.schemas'
import { getModuleStatusColor } from '@/utils/module'
import { parseUtc } from '@/utils/parseUtc'

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
                            <span className="text-s -mb-1 w-[84px]">
                                {formatDate(
                                    parseUtc(status.Created_Date),
                                    'dd-MM-yyyy'
                                )}
                            </span>
                            <div className="border-pzh-blue-500 relative mx-2 h-[13px] w-[13px] rounded-full border-2">
                                {hasPeer && (
                                    <div className="bg-pzh-blue-500 absolute top-[11px] left-1 h-8 w-px" />
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
