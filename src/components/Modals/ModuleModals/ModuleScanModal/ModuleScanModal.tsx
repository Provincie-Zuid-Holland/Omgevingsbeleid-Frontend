import { useModulesGetModuleValidate } from '@/api/fetchers'
import {
    ValidateModuleObject,
    ValidateModuleSeverity,
} from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import Modal, { ModalFooter } from '@/components/Modal/Modal'
import ScanRule from '@/components/ScanRule'
import useModalStore from '@/store/modalStore'
import { Button, Text } from '@pzh-ui/components'
import { CircleCheckSolid } from '@pzh-ui/icons'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

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
    const { moduleId } = useParams()
    const activeModal = useModalStore(state => state.activeModal)
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data, isFetching } = useModulesGetModuleValidate(Number(moduleId), {
        query: { enabled: activeModal === 'moduleScan', staleTime: 0 },
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

    const link =
        object.object_type !== 'gebied'
            ? `/muteer/modules/${moduleId}/${object.object_type}/${object.object_id}/bewerk`
            : undefined
    const title = `${object.title} (${object.object_type})`

    return (
        <ScanRule
            severity={severity}
            title={title}
            link={link}
            messages={messages}
        />
    )
}

export default ModuleScanModal
