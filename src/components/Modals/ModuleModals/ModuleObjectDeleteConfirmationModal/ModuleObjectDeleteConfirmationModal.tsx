import { Button, Heading, Modal, Text } from '@pzh-ui/components'

import { Module, ModuleObjectShort } from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import useModule from '@/hooks/useModule'

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
    const { useRemoveObjectFromModule } = useModule()
    const { mutate } = useRemoveObjectFromModule(() => onClose())

    const model = models[object.Object_Type as ModelType]

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
                <Button variant="link" onPress={onClose}>
                    Annuleren
                </Button>
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
