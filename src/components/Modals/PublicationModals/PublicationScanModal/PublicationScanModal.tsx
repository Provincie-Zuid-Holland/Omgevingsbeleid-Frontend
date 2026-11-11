import { useMemo } from 'react'

import { Button, Notification } from '@pzh-ui/components'

import { AxiosError } from 'axios'
import { useParams } from 'react-router-dom'

import { usePublicationActPackagesGetValidateActPackage } from '@/api/fetchers'
import {
    HTTPValidationError,
    ValidateModuleError,
} from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import Modal, { ModalFooter } from '@/components/Modal/Modal'
import ScanRule from '@/components/ScanRule'
import useModalStore from '@/store/modalStore'

import { ModalStateMap } from '../../types'

const RULE_OTHER_ISSUES = 'other_issues'
const RULE_ATTACHMENT_IN_BILL = 'attachment_in_bill_reference_rule'

const normaliseError = (raw: any): ValidateModuleError => {
    if (raw?.object || raw?.messages || raw?.rule) {
        return raw as ValidateModuleError
    }

    const location = Array.isArray(raw?.loc)
        ? raw.loc.filter((part: unknown) => part !== 'body').join(' → ')
        : undefined

    return {
        rule: RULE_OTHER_ISSUES,
        object: {},
        messages: [location ? `${location}: ${raw?.msg}` : raw?.msg].filter(
            Boolean
        ),
    } as ValidateModuleError
}

const PublicationScanModal = () => {
    const setActiveModal = useModalStore(state => state.setActiveModal)
    const isOpen = useModalStore(
        state => state.activeModal === 'publicationScan'
    )
    const data = useModalStore(
        state => state.modalStates['publicationScan']
    ) as ModalStateMap['publicationScan']

    const isValidatorMode = !!data?.versionUUID

    const {
        error: validateError,
        isFetching: validating,
        isSuccess: validationOk,
    } = usePublicationActPackagesGetValidateActPackage(
        String(data?.versionUUID),
        {
            query: {
                enabled: isOpen && isValidatorMode,
                retry: false,
                gcTime: 0,
                staleTime: 0,
            },
        }
    )

    const rawErrors = useMemo<any[]>(() => {
        if (data?.errors?.length) return data.errors

        const detail = (validateError as AxiosError<HTTPValidationError> | null)
            ?.response?.data?.detail

        return Array.isArray(detail) ? detail : []
    }, [data?.errors, validateError])

    const issuesByObject = useMemo<ValidateModuleError[]>(() => {
        if (!rawErrors.length) return []

        const map = new Map<string, ValidateModuleError>()
        const otherMessages: string[] = []

        for (const rawErr of rawErrors) {
            const err = normaliseError(rawErr)
            const key = err.object?.code || String(err.object?.object_id)

            if (
                !err.object?.object_id ||
                err.rule === RULE_ATTACHMENT_IN_BILL
            ) {
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
    }, [rawErrors])

    const handleCloseModal = () => {
        setActiveModal(null)
    }

    const hasIssues = issuesByObject.length > 0
    const showAllClear =
        isValidatorMode && !validating && !hasIssues && validationOk
    const showGenericError =
        isValidatorMode && !validating && !hasIssues && !!validateError

    return (
        <Modal
            id="publicationScan"
            title={
                isValidatorMode
                    ? 'Publicatie-validator'
                    : 'Actie vereist voordat je verder kan'
            }
            description={
                isValidatorMode
                    ? 'De regeling wordt gecontroleerd op fouten.'
                    : 'Neem contact op met de technisch beheerder.'
            }
            onClose={handleCloseModal}>
            {validating ? (
                <div className="flex justify-center py-6">
                    <LoaderSpinner />
                </div>
            ) : showAllClear ? (
                <Notification
                    variant="positive"
                    title="Geen problemen gevonden">
                    De regeling voldoet aan de validatieregels en kan worden
                    aangeleverd.
                </Notification>
            ) : showGenericError ? (
                <Notification variant="negative" title="Validatie mislukt">
                    De validatie kon niet worden uitgevoerd. Probeer het later
                    opnieuw of neem contact op met de technisch beheerder.
                </Notification>
            ) : (
                <div className="flex flex-col gap-3">
                    {issuesByObject.map(item => (
                        <ObjectIssueCard
                            key={item.object?.code || item.rule}
                            item={item}
                        />
                    ))}
                </div>
            )}

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
        object.object_type &&
        object.object_type !== 'gebied' &&
        rule !== RULE_OTHER_ISSUES &&
        rule !== RULE_ATTACHMENT_IN_BILL
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
