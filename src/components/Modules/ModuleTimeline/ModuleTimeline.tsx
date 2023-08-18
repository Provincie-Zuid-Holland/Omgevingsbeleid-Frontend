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
        <div data-testid="module-timeline" className="mt-4 sm:mt-0">
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
                            <span className="-mb-[4px] w-[84px] text-[16px]">
                                {formatDate(
                                    new Date(status.Created_Date + 'Z'),
                                    'dd-MM-yyyy'
                                )}
                            </span>
                            <div className="relative mx-2 h-[13px] w-[13px] rounded-full border-2 border-pzh-blue">
                                {hasPeer && (
                                    <div className="absolute left-[4px] top-[11px] h-[36px] w-px bg-pzh-blue" />
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
