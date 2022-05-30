import { Button, FieldSelect, Heading, Modal, Text } from '@pzh-ui/components'
import { useState } from 'react'
import { useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

import {
    useGetBeleidsmodules,
    patchBeleidsmodulesLineageid,
    getGetBeleidskeuzesLineageidQueryKey,
    getGetMaatregelenLineageidQueryKey,
} from '@/api/fetchers'
import {
    BeleidskeuzesRead,
    BeleidsmodulesRead,
    ListReference,
    MaatregelenRead,
} from '@/api/fetchers.schemas'
import { LoaderSelect } from '@/components/Loader'
import handleError from '@/utils/handleError'

export interface PopUpAddPolicyToModuleProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    policy: MaatregelenRead | BeleidskeuzesRead
    titleSingular: 'Beleidskeuze' | 'Maatregel'
}

function PopUpAddPolicyToModule({
    isOpen,
    setIsOpen,
    policy,
    titleSingular,
}: PopUpAddPolicyToModuleProps) {
    const queryClient = useQueryClient()

    const { isLoading: modulesAreLoading, data: policyModules } =
        useGetBeleidsmodules()
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
            titleSingular === 'Maatregel' ? 'Maatregelen' : 'Beleidskeuzes'

        const newConnection = {
            Koppeling_Omschrijving: '',
            UUID: policy.UUID,
        }

        const formattedExistingConnections: ListReference[] =
            selectedModule[connectionProperty]?.map(connection => ({
                UUID: connection.Object?.UUID || '',
                Koppeling_Omschrijving: '',
            })) || []

        patchBeleidsmodulesLineageid(selectedModule.ID, {
            [connectionProperty]: [
                ...(formattedExistingConnections || []),
                newConnection,
            ],
        })
            .then(() => {
                const queryKey =
                    titleSingular === 'Beleidskeuze'
                        ? getGetBeleidskeuzesLineageidQueryKey(policy.ID!)
                        : titleSingular === 'Maatregel'
                        ? getGetMaatregelenLineageidQueryKey(policy.ID!)
                        : ''

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
            maxWidth="sm:w-[450px]"
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
                    options={policyModules?.map(
                        (module: BeleidsmodulesRead) => ({
                            value: module.UUID,
                            label: module.Titel,
                        })
                    )}
                />
            )}
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => {
                        setIsOpen(false)
                    }}>
                    <Text className="underline">Annuleren</Text>
                </button>
                <Button onClick={() => addPolicyToModule()} variant="cta">
                    Aanpassen
                </Button>
            </div>
        </Modal>
    )
}

export default PopUpAddPolicyToModule