import { useMemo } from 'react'

import { format as formatDate } from 'date-fns'

import { useModulesViewModuleListStatuses } from '@/api/fetchers'
import { ModuleStatus } from '@/api/fetchers.schemas'
import { parseUtc } from '@/utils/parseUtc'

export function useModuleStatusData(moduleId?: string | number) {
    const moduleIdNum =
        typeof moduleId === 'string' ? Number(moduleId) : moduleId
    const enabled = Number.isFinite(moduleIdNum)

    const { data: rawStatuses = [], ...rest } =
        useModulesViewModuleListStatuses(moduleIdNum as number, {
            query: { enabled },
        })

    const activeStatuses = useMemo<ModuleStatus[]>(
        () =>
            rawStatuses
                .filter(s => s.status !== 'Niet-Actief')
                .sort(
                    (a, b) =>
                        parseUtc(b.created_date).getTime() -
                        parseUtc(a.created_date).getTime()
                ),
        [rawStatuses]
    )

    const statusOptions = useMemo(
        () =>
            activeStatuses.map(s => ({
                label: `${s.status} (${formatDate(parseUtc(s.created_date), "dd-MM-yyyy 'om' HH:mm")})`,
                value: s.id,
            })),
        [activeStatuses]
    )

    const lastStatus = useMemo<ModuleStatus | null>(() => {
        if (activeStatuses.length === 0) return null
        return activeStatuses.reduce((latest, cur) =>
            parseUtc(cur.created_date) > parseUtc(latest.created_date)
                ? cur
                : latest
        )
    }, [activeStatuses])

    return { statusOptions, lastStatus, ...rest }
}
