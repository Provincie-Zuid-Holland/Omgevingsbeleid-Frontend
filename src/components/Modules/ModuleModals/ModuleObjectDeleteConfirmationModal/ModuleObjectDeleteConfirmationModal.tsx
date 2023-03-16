import { Button, Heading, Modal, Text } from '@pzh-ui/components'

import { Module, ModuleObjectShort } from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import useModules from '@/hooks/useModules'

interface ModuleObjectDeleteConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    object: ModuleObjectShort
    module: Module
}

const ModuleObjectDeleteConfirmationModal = ({
    isOpen,
    onClose,
    object,
    module,
}: ModuleObjectDeleteConfirmationModalProps) => {
    const { useRemoveObjectFromModule } = useModules()
    const { mutate } = useRemoveObjectFromModule(object.Object_ID, () =>
        onClose()
    )

    const model = models[object.Object_Type as keyof typeof models]

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            ariaLabel="Onderdeel verwijderen"
            maxWidth="sm:max-w-[812px]">
            <Heading level="2" className="mb-4">
                Onderdeel verwijderen
            </Heading>

            <Text>
                Wanneer je {model?.defaults.prefixSingular} {object.Object_Type}{' '}
                ‘{object.Title}’ uit de module ‘{module.Title}’ verwijdert, zal
                de huidige ontwerpversie komen te vervallen.
                <br />
                <br />
                Weet je zeker dat je dit onderdeel wilt verwijderen?
            </Text>

            <div className="mt-6 flex items-center justify-between">
                <button type="button" className="underline" onClick={onClose}>
                    Annuleren
                </button>
                <Button
                    onPress={() =>
                        mutate({
                            moduleId: module.Module_ID,
                            objectType: object.Object_Type,
                            lineageId: object.Object_ID,
                        })
                    }>
                    Ja, verwijder
                </Button>
            </div>
        </Modal>
    )
}

export default ModuleObjectDeleteConfirmationModal
