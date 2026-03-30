import { useModulesViewModuleListStatuses } from '@/api/fetchers'
import { ModuleStatus } from '@/api/fetchers.schemas'
import { parseUtc } from '@/utils/parseUtc'
import { format as formatDate } from 'date-fns'
import { useMemo } from 'react'

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
                .filter(s => s.Status !== 'Niet-Actief')
                .sort(
                    (a, b) =>
                        parseUtc(b.Created_Date).getTime() -
                        parseUtc(a.Created_Date).getTime()
                ),
        [rawStatuses]
    )

    const statusOptions = useMemo(
        () =>
            activeStatuses.map(s => ({
                label: `${s.Status} (${formatDate(parseUtc(s.Created_Date), "dd-MM-yyyy 'om' HH:mm")})`,
                value: s.ID,
            })),
        [activeStatuses]
    )

    const lastStatus = useMemo<ModuleStatus | null>(() => {
        if (activeStatuses.length === 0) return null
        return activeStatuses.reduce((latest, cur) =>
            parseUtc(cur.Created_Date) > parseUtc(latest.Created_Date)
                ? cur
                : latest
        )
    }, [activeStatuses])

    return { statusOptions, lastStatus, ...rest }
}
