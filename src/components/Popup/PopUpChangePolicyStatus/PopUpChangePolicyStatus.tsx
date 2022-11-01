import { Button, FieldSelect, Heading, Modal, Text } from '@pzh-ui/components'
import { useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'

import {
    getGetBeleidskeuzesLineageidQueryKey,
    getGetBeleidskeuzesQueryKey,
    getGetGebiedsprogrammasLineageidQueryKey,
    getGetGebiedsprogrammasQueryKey,
    getGetMaatregelenLineageidQueryKey,
    getGetMaatregelenQueryKey,
} from '@/api/fetchers'
import {
    BeleidskeuzesRead,
    MaatregelenRead,
    MaatregelenReadStatus,
    BeleidskeuzesReadStatus,
} from '@/api/fetchers.schemas'
import VOLGENDE_STATUS from '@/constants/beleidskeuzeStatusAanpassen'
import { getMutationForPolicyLineage } from '@/utils/getFetchers'
import { toastNotification } from '@/utils/toastNotification'

type OptionType = {
    value: MaatregelenReadStatus | BeleidskeuzesReadStatus
    label: MaatregelenReadStatus | BeleidskeuzesReadStatus
}

export interface PopUpChangePolicyStatusProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    policy: MaatregelenRead | BeleidskeuzesRead
    titleSingular: 'Beleidskeuze' | 'Maatregel' | 'Gebiedsprogramma'
}

function PopUpChangePolicyStatus({
    isOpen,
    setIsOpen,
    policy,
    titleSingular,
}: PopUpChangePolicyStatusProps) {
    const queryClient = useQueryClient()

    const useMutatePolicyLineage = getMutationForPolicyLineage(titleSingular)

    const mutatePolicyLineage = useMutatePolicyLineage({
        mutation: {
            onError: () => {
                toastNotification({ type: 'standard error' })
            },
            onSuccess: () => {
                const queryKeyLineage =
                    titleSingular === 'Beleidskeuze'
                        ? getGetBeleidskeuzesLineageidQueryKey(policy.ID!)
                        : titleSingular === 'Maatregel'
                        ? getGetMaatregelenLineageidQueryKey(policy.ID!)
                        : titleSingular === 'Gebiedsprogramma'
                        ? getGetGebiedsprogrammasLineageidQueryKey(policy.ID!)
                        : ''

                const queryKeyAllLineages =
                    titleSingular === 'Beleidskeuze'
                        ? getGetBeleidskeuzesQueryKey()
                        : titleSingular === 'Maatregel'
                        ? getGetMaatregelenQueryKey()
                        : titleSingular === 'Gebiedsprogramma'
                        ? getGetGebiedsprogrammasQueryKey()
                        : ''

                queryClient.invalidateQueries(queryKeyLineage)
                queryClient.invalidateQueries(queryKeyAllLineages)

                toastNotification({ type: 'status changed' })
                setIsOpen(false)
            },
        },
    })

    const [options, setOptions] = useState<OptionType[]>([])
    const [selectedStatus, setSelectedStatus] = useState<
        OptionType | undefined
    >(undefined)

    useEffect(() => {
        const getOptions = (): OptionType[] => {
            const currentStatus = policy.Status
            if (!currentStatus) return []

            return VOLGENDE_STATUS[currentStatus].map(status => ({
                value: status,
                label: status,
            }))
        }

        const options = getOptions()
        setOptions(options)
    }, [policy])

    useEffect(() => {
        if (!isOpen) {
            // Timeout for the modal animation to finish
            window.setTimeout(() => {
                setSelectedStatus(undefined)
            }, 800)
        }
    }, [isOpen])

    const updatePolicyStatus = () => {
        if (!selectedStatus) return

        const patchObject = {
            Status: selectedStatus.value,
        }

        mutatePolicyLineage.mutate({
            lineageid: policy.ID!,
            data: patchObject as any,
        })
    }

    return (
        <Modal
            maxWidth="sm:max-w-[450px]"
            overflowVisible={true}
            open={isOpen}
            onClose={() => setIsOpen(false)}
            ariaLabel="Status wijzigen">
            <Heading level="4">Status wijzigen</Heading>
            <FieldSelect
                placeholder="Selecteer een status"
                className="mt-4"
                value={selectedStatus}
                onChange={(status: any) => {
                    setSelectedStatus(status)
                }}
                name="selected-status"
                options={options}
            />
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => {
                        setIsOpen(false)
                        // Wait for framer motion animation to finish
                        window.setTimeout(() => {
                            setSelectedStatus(undefined)
                        }, 800)
                    }}>
                    <Text className="underline">Annuleren</Text>
                </button>
                <Button
                    disabled={selectedStatus === null}
                    onClick={() => updatePolicyStatus()}
                    variant="cta">
                    Aanpassen
                </Button>
            </div>
        </Modal>
    )
}

export default PopUpChangePolicyStatus
