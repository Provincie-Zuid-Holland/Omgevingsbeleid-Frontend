import { Button, FieldSelect, Heading, Modal, Text } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import {
    getReadBeleidskeuzeLineageQueryKey,
    getReadBeleidskeuzesQueryKey,
    getReadGebiedsprogrammasQueryKey,
    getReadMaatregelLineageQueryKey,
    getReadMaatregelenQueryKey,
    getReadGebiedsprogrammaLineageQueryKey,
} from '@/api/fetchers'
import {
    Beleidskeuze,
    Gebiedsprogramma,
    Maatregel,
    Status,
} from '@/api/fetchers.schemas'
import VOLGENDE_STATUS from '@/constants/beleidskeuzeStatusAanpassen'
import { getMutationForPolicyLineage } from '@/utils/getFetchers'
import { toastNotification } from '@/utils/toastNotification'

type OptionType = {
    value: Status
    label: Status
}

export interface PopUpChangePolicyStatusProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    policy: Maatregel | Beleidskeuze | Gebiedsprogramma
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

    const mutatePolicyLineage = useMutatePolicyLineage?.({
        mutation: {
            onError: () => {
                toastNotification({ type: 'standard error' })
            },
            onSuccess: () => {
                const queryKeyLineage =
                    titleSingular === 'Beleidskeuze'
                        ? getReadBeleidskeuzeLineageQueryKey(policy.ID!)
                        : titleSingular === 'Maatregel'
                        ? getReadMaatregelLineageQueryKey(policy.ID!)
                        : titleSingular === 'Gebiedsprogramma'
                        ? getReadGebiedsprogrammaLineageQueryKey(policy.ID!)
                        : ['']

                const queryKeyAllLineages =
                    titleSingular === 'Beleidskeuze'
                        ? getReadBeleidskeuzesQueryKey()
                        : titleSingular === 'Maatregel'
                        ? getReadMaatregelenQueryKey()
                        : titleSingular === 'Gebiedsprogramma'
                        ? getReadGebiedsprogrammasQueryKey()
                        : ['']

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

            return VOLGENDE_STATUS[currentStatus as Status].map(status => ({
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

        mutatePolicyLineage?.mutate({
            lineageId: policy.ID!,
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
                    isDisabled={selectedStatus === null}
                    onPress={() => updatePolicyStatus()}
                    variant="cta">
                    Aanpassen
                </Button>
            </div>
        </Modal>
    )
}

export default PopUpChangePolicyStatus
