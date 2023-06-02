import { Badge, Text } from '@pzh-ui/components'
import classNames from 'classnames'
import { useMemo } from 'react'

import { ModuleStatus } from '@/api/fetchers.schemas'
import formatDate from '@/utils/formatDate'
import getModuleStatusColor from '@/utils/getModuleStatusColor'

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
        <div data-testid="module-timeline">
            <Text className="font-bold text-pzh-blue">Tijdlijn</Text>

            <div className="mt-3">
                {filteredHistory.map((status, index) => {
                    const hasPeer =
                        index + 1 !== filteredHistory.length &&
                        filteredHistory.length !== 1

                    return (
                        <div
                            key={status.ID}
                            className={classNames('flex items-center', {
                                'mb-4': hasPeer,
                            })}>
                            <span className="w-[84px] -mb-[4px] text-[16px]">
                                {formatDate(
                                    new Date(status.Created_Date + 'Z'),
                                    'dd-MM-yyyy'
                                )}
                            </span>
                            <div className="relative mx-2 w-[13px] h-[13px] border-2 border-pzh-blue rounded-full">
                                {hasPeer && (
                                    <div className="absolute top-[11px] left-[4px] w-px h-[36px] bg-pzh-blue" />
                                )}
                            </div>

                            <Badge
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
