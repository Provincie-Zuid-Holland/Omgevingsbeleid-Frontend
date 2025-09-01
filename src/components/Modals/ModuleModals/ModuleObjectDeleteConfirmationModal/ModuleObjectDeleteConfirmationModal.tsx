import { Button, Text } from '@pzh-ui/components'

import { Module, ModuleObjectShort } from '@/api/fetchers.schemas'
import Modal from '@/components/Modal'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import useModule from '@/hooks/useModule'
import useModalStore from '@/store/modalStore'

import { ModalFooter } from '@/components/Modal/Modal'
import { ModalStateMap } from '../../types'

const ModuleObjectDeleteConfirmationModal = () => {
    const setActiveModal = useModalStore(state => state.setActiveModal)
    const modalState = useModalStore(
        state => state.modalStates['moduleDeleteObject']
    ) as ModalStateMap['moduleDeleteObject']

    const { object = {} as ModuleObjectShort, module = {} as Module } =
        modalState || {}

    const { useRemoveObjectFromModule } = useModule()
    const { mutate } = useRemoveObjectFromModule(() => setActiveModal(null))

    const handleDeletion = () =>
        mutate({
            moduleId: module.Module_ID,
            objectType: object.Object_Type,
            lineageId: object.Object_ID,
        })

    const model = models[object?.Object_Type as ModelType]

    return (
        <Modal id="moduleDeleteObject" title="Onderdeel verwijderen">
            <Text>
                Wanneer je {model?.defaults.prefixSingular} {object.Object_Type}{' '}
                ‘{object.Title}’ uit de module ‘{module.Title}’ verwijdert, zal
                de huidige ontwerpversie komen te vervallen.
                <br />
                <br />
                Weet je zeker dat je dit onderdeel wilt verwijderen?
            </Text>

            <ModalFooter>
                <Button variant="link" onPress={() => setActiveModal(null)}>
                    Annuleren
                </Button>
                <Button onPress={handleDeletion}>Ja, verwijder</Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModuleObjectDeleteConfirmationModal
