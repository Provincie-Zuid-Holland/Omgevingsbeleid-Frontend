import { ValidateModuleError } from '@/api/fetchers.schemas'
import Modal, { ModalFooter } from '@/components/Modal/Modal'
import ScanRule from '@/components/ScanRule'
import useModalStore from '@/store/modalStore'
import { Button } from '@pzh-ui/components'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ModalStateMap } from '../../types'

const RULE_OTHER_ISSUES = 'other_issues'
const RULE_ATTACHMENT_IN_BILL = 'attachment_in_bill_reference_rule'

const PublicationScanModal = () => {
    const setActiveModal = useModalStore(state => state.setActiveModal)
    const data = useModalStore(
        state => state.modalStates['publicationScan']
    ) as ModalStateMap['publicationScan']

    const issuesByObject = useMemo<ValidateModuleError[]>(() => {
        if (!data?.errors?.length) return []

        const map = new Map<string, ValidateModuleError>()
        const otherMessages: string[] = []

        for (const err of data.errors) {
            const key = err.object?.code

            if (!err.object?.object_id || err.rule === RULE_ATTACHMENT_IN_BILL) {
                otherMessages.push(...(err.messages ?? []))
                continue
            }

            const existing = map.get(key)

            if (existing) {
                existing.messages?.push(...(err.messages ?? []))
            } else {
                map.set(key, { ...err, messages: [...(err.messages ?? [])] })
            }
        }

        const results = Array.from(map.values())

        if (otherMessages.length) {
            results.push({
                rule: RULE_OTHER_ISSUES,
                object: {},
                messages: otherMessages,
            } as ValidateModuleError)
        }

        return results
    }, [data?.errors])

    const handleCloseModal = () => {
        setActiveModal(null)
    }

    return (
        <Modal
            id="publicationScan"
            title="Actie vereist voordat je verder kan"
            description="Neem contact op met de technisch beheerder."
            onClose={handleCloseModal}>
            <div className="flex flex-col gap-3">
                {issuesByObject.map(item => (
                    <ObjectIssueCard
                        key={item.object?.code || item.rule}
                        item={item}
                    />
                ))}
            </div>

            <ModalFooter>
                <Button onPress={handleCloseModal} className="ml-auto">
                    Sluiten
                </Button>
            </ModalFooter>
        </Modal>
    )
}

const ObjectIssueCard = ({ item }: { item: ValidateModuleError }) => {
    const { moduleId } = useParams()
    const { object, messages, rule } = item

    const link =
        object.object_type && object.object_type !== 'gebied' && rule !== RULE_OTHER_ISSUES && rule !== RULE_ATTACHMENT_IN_BILL
            ? `/muteer/modules/${moduleId}/${object.object_type}/${object.object_id}/bewerk`
            : undefined
    const title =
        rule === RULE_OTHER_ISSUES || rule === RULE_ATTACHMENT_IN_BILL
            ? 'Overige meldingen'
            : object.object_type
              ? `${object.title} (${object.object_type})`
              : `${object.title}`

    return <ScanRule title={title} link={link} messages={messages} />
}

export default PublicationScanModal
