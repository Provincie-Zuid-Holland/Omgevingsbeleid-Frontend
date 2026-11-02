import { Button, Text } from '@pzh-ui/components'

import { Module } from '@/api/fetchers.schemas'
import Modal from '@/components/Modal'
import { ModalFooter } from '@/components/Modal/Modal'
import * as models from '@/config/objects'
import { ModelReturnTypeBasic, ModelType } from '@/config/objects/types'
import useModule from '@/hooks/useModule'
import useModalStore from '@/store/modalStore'

import { ModalStateMap } from '../../types'

const ModuleObjectDeleteConfirmationModal = () => {
    const setActiveModal = useModalStore(state => state.setActiveModal)
    const modalState = useModalStore(
        state => state.modalStates['moduleDeleteObject']
    ) as ModalStateMap['moduleDeleteObject']

    const { object = {} as ModelReturnTypeBasic, module = {} as Module } =
        modalState || {}

    const { useRemoveObjectFromModule } = useModule()
    const { mutate } = useRemoveObjectFromModule(() => setActiveModal(null))

    const handleDeletion = () =>
        mutate({
            moduleId: module.module_id,
            objectType: object.object_type,
            lineageId: object.model?.object_id || 0,
        })

    const model = models[object?.object_type as ModelType]

    return (
        <Modal id="moduleDeleteObject" title="Onderdeel verwijderen">
            <Text>
                Wanneer je {model?.defaults.prefixSingular} {object.object_type}{' '}
                ‘{object.model?.title}’ uit de module ‘{module.title}’
                verwijdert, zal de huidige ontwerpversie komen te vervallen.
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
