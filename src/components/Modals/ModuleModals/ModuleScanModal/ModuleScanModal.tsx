import { useModulesGetModuleValidate } from '@/api/fetchers'
import {
    ValidateModuleObject,
    ValidateModuleSeverity,
} from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import Modal, { ModalFooter } from '@/components/Modal/Modal'
import useModalStore from '@/store/modalStore'
import { Button, cn, Text } from '@pzh-ui/components'
import {
    ArrowUpRightFromSquare,
    CircleCheckSolid,
    CircleInfoSolid,
    CircleXmark,
} from '@pzh-ui/icons'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

type ObjectIssueItem = {
    object: ValidateModuleObject
    messages: string[]
    severity?: ValidateModuleSeverity
}

const SCAN_RULES: Array<{
    ruleKey: string
    defaultTitle: string
}> = [
    {
        ruleKey: 'required_object_fields_rule',
        defaultTitle: 'Alle verplichte velden zijn gevuld',
    },
    {
        ruleKey: 'newest_input_geo_onderverdeling_used_rule',
        defaultTitle: 'Alle geo-data is up-to-date',
    },
    {
        ruleKey: 'require_existing_hierarchy_code_rule',
        defaultTitle: 'Alle hiërarchische koppelingen zijn op orde',
    },
    {
        ruleKey: 'forbid_empty_html_nodes',
        defaultTitle: 'Er zijn geen lege html-tags gevonden',
    },
]

const ModuleScanModal = () => {
    const queryClient = useQueryClient()
    const { moduleId } = useParams()
    const activeModal = useModalStore(state => state.activeModal)
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const {
        data,
        isFetching,
        isSuccess,
        refetch: validateModule,
        queryKey,
    } = useModulesGetModuleValidate(Number(moduleId), {
        query: { enabled: activeModal === 'moduleScan' },
    })

    const issuesByObject = useMemo<ObjectIssueItem[]>(() => {
        if (!data?.errors?.length) return []

        const map = new Map<string, ObjectIssueItem>()

        for (const err of data.errors) {
            const key = err.object.code
            const existing = map.get(key)

            if (existing) {
                existing.messages.push(...err.messages)
            } else {
                map.set(key, {
                    object: err.object,
                    messages: [...err.messages],
                    severity: err.severity,
                })
            }
        }

        return Array.from(map.values())
    }, [data?.errors])

    const handleCloseModal = () => {
        queryClient.resetQueries({ queryKey })
        setActiveModal(null)
    }

    const showSuccess = !!data && data.status === 'OK' && !isFetching
    const showIssues = !!data && data.status === 'Failed' && !isFetching

    return (
        <Modal
            id="moduleScan"
            title="Volledigheidsscan"
            onClose={handleCloseModal}>
            {!data && !isFetching && (
                <div className="text-pzh-gray-700 flex items-center justify-between">
                    <Text>
                        Start de scan om te controleren op volledigheid.
                    </Text>
                </div>
            )}
            {isFetching && <LoaderSpinner />}

            {showSuccess && (
                <div className="border-pzh-green-500 bg-pzh-green-10 rounded-lg border p-4">
                    <div className="flex items-start gap-3">
                        <CircleCheckSolid
                            size={16}
                            className="text-pzh-green-500 min-w-4"
                        />
                        <div className="-mt-1.5 flex flex-col gap-2">
                            <Text className="text-pzh-blue-500 font-bold">
                                Geen fouten gevonden
                            </Text>
                            <ul className="text-pzh-blue-500 flex flex-col gap-1">
                                {SCAN_RULES.map(r => (
                                    <li
                                        key={r.ruleKey}
                                        className="text-s flex pl-2 before:relative before:top-2 before:mr-2 before:text-4xl before:leading-1 before:content-['·']">
                                        {r.defaultTitle}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {showIssues && (
                <div className="flex flex-col gap-3">
                    {issuesByObject.map(item => (
                        <ObjectIssueCard key={item.object.code} item={item} />
                    ))}
                </div>
            )}

            <ModalFooter>
                <Button
                    variant={isFetching ? 'secondary' : 'primary'}
                    onPress={handleCloseModal}
                    className="ml-auto">
                    Sluiten
                </Button>
            </ModalFooter>
        </Modal>
    )
}

const ObjectIssueCard = ({ item }: { item: ObjectIssueItem }) => {
    const { moduleId } = useParams()
    const { object, messages, severity } = item
    const icon =
        severity === 'error' ? (
            <CircleXmark size={16} className="text-pzh-red-500 min-w-4" />
        ) : (
            <CircleInfoSolid
                size={16}
                className="text-pzh-orange-500 min-w-4"
            />
        )

    const isLink = object.object_type !== 'gebied'
    const title = `${object.title} (${object.object_type})`

    return (
        <div
            className={cn('w-full rounded-lg border px-4 py-3', {
                'border-pzh-red-500 bg-pzh-red-10': severity === 'error',
                'border-pzh-orange-500 bg-pzh-orange-500/10':
                    severity !== 'error',
            })}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-2">
                    <div className="flex-shrink-0">{icon}</div>

                    <div className="-mt-1.5 min-w-0">
                        {isLink ? (
                            <Link
                                to={`/muteer/modules/${moduleId}/${object.object_type}/${object.object_id}/bewerk`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pzh-blue-500 hover:text-pzh-green-500 inline-flex items-center gap-2 font-bold"
                                title={`${object.title} (${object.object_type})`}>
                                <span className="truncate">{title}</span>
                                <ArrowUpRightFromSquare size={16} />
                            </Link>
                        ) : (
                            <Text bold className="text-pzh-blue-500">
                                {title}
                            </Text>
                        )}

                        <ul className="text-pzh-blue-500 mt-1 flex flex-col gap-1">
                            {messages.map((m, idx) => (
                                <li
                                    key={`${object.code}-${idx}`}
                                    className="text-s flex pl-2 before:relative before:top-2 before:mr-2 before:text-4xl before:leading-1 before:content-['·']">
                                    {m}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModuleScanModal
