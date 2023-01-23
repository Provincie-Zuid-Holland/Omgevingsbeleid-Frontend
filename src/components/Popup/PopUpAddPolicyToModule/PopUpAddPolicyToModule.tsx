import { Button, FieldSelect, Heading, Modal, Text } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
    useReadBeleidsmodules,
    updateBeleidsmodule,
    getReadBeleidskeuzeLineageQueryKey,
    getReadMaatregelLineageQueryKey,
    getReadMaatregelenQueryKey,
    getReadBeleidskeuzesQueryKey,
} from '@/api/fetchers'
import {
    Beleidskeuze,
    Beleidsmodule,
    GenericReferenceUpdate,
    Maatregel,
} from '@/api/fetchers.schemas'
import { LoaderSelect } from '@/components/Loader'
import handleError from '@/utils/handleError'

export interface PopUpAddPolicyToModuleProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    policy: Maatregel | Beleidskeuze
    titleSingular: 'Beleidskeuze' | 'Maatregel' | 'Gebiedsprogramma'
}

function PopUpAddPolicyToModule({
    isOpen,
    setIsOpen,
    policy,
    titleSingular,
}: PopUpAddPolicyToModuleProps) {
    const queryClient = useQueryClient()
    const { single: idUrlParam } = useParams<{ single: string }>()

    const { isLoading: modulesAreLoading, data: policyModules } =
        useReadBeleidsmodules()
    const [selectedModuleUUID, setSelectedModuleUUID] = useState<string | null>(
        null
    )

    const addPolicyToModule = () => {
        if (!policyModules) return

        const selectedModule = policyModules.find(
            e => e.UUID === selectedModuleUUID
        )

        if (!selectedModule?.ID) return

        const connectionProperty =
            titleSingular === 'Maatregel'
                ? 'Maatregelen'
                : titleSingular === 'Beleidskeuze'
                ? 'Beleidskeuzes'
                : 'Gebiedsprogrammas'

        const newConnection = {
            Koppeling_Omschrijving: '',
            UUID: policy.UUID,
        }

        const formattedExistingConnections: GenericReferenceUpdate[] =
            selectedModule[connectionProperty]?.map(connection => ({
                UUID: connection.Object?.UUID || '',
                Koppeling_Omschrijving: '',
            })) || []

        updateBeleidsmodule(selectedModule.ID, {
            [connectionProperty]: [
                ...(formattedExistingConnections || []),
                newConnection,
            ],
        })
            .then(() => {
                const isDetailPage = idUrlParam !== undefined
                const queryKey =
                    titleSingular.toLowerCase() === 'Beleidskeuze' &&
                    isDetailPage
                        ? getReadBeleidskeuzeLineageQueryKey(policy.ID!)
                        : titleSingular === 'Maatregel' && isDetailPage
                        ? getReadMaatregelLineageQueryKey(policy.ID!)
                        : titleSingular === 'Maatregel' && !isDetailPage
                        ? getReadMaatregelenQueryKey()
                        : titleSingular === 'Beleidskeuze' && !isDetailPage
                        ? getReadBeleidskeuzesQueryKey()
                        : ['']

                queryClient.invalidateQueries(queryKey)

                toast(
                    `${titleSingular} toegevoegd aan module '${selectedModule.Titel}'`
                )
                setIsOpen(false)
            })
            .catch(err => handleError(err))
    }

    return (
        <Modal
            maxWidth="sm:max-w-[450px]"
            overflowVisible={true}
            open={isOpen}
            onClose={() => setIsOpen(false)}
            ariaLabel="Toevoegen aan een module">
            <Heading level="4">Module aanpassen</Heading>
            {modulesAreLoading ? (
                <LoaderSelect className="mt-4" />
            ) : (
                <FieldSelect
                    placeholder="Selecteer een module"
                    className="mt-4"
                    value={
                        selectedModuleUUID
                            ? {
                                  value: selectedModuleUUID,
                                  label: policyModules?.find(
                                      module =>
                                          module.UUID === selectedModuleUUID
                                  )?.Titel,
                              }
                            : null
                    }
                    onChange={(e: any) => {
                        setSelectedModuleUUID(e.value)
                    }}
                    name="selected-module"
                    options={policyModules?.map((module: Beleidsmodule) => ({
                        value: module.UUID,
                        label: module.Titel,
                    }))}
                />
            )}
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => {
                        setIsOpen(false)
                    }}>
                    <Text className="underline">Annuleren</Text>
                </button>
                <Button onPress={() => addPolicyToModule()} variant="cta">
                    Aanpassen
                </Button>
            </div>
        </Modal>
    )
}

export default PopUpAddPolicyToModule
