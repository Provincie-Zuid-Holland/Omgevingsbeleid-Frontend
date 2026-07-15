import { Button, Text } from '@pzh-ui/components'
import { useParams } from 'react-router-dom'

import Modal from '@/components/Modal'
import { ModalFooter } from '@/components/Modal/Modal'
import useModule from '@/hooks/useModule'
import useModalStore from '@/store/modalStore'

const ModuleLockModal = () => {
    const { moduleId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { useEditModule } = useModule()
    const { mutate } = useEditModule('moduleLocked', () => setActiveModal(null))

    return (
        <Modal id="moduleLock" title="Module vergrendelen">
            <Text>
                Je staat op het punt om de module te vergrendelen. Dit houdt in
                dat de onderdelen in deze module tijdelijk niet meer kunnen
                worden bewerkt. Dit is handig voor het maken van (technische)
                exports van de stukken.
                <br />
                <br />
                Let op: je moet de vergrendeling van de module handmatig
                verwijderen zodra de behandelend ambtenaren weer aan hun stukken
                mogen werken.
            </Text>

            <ModalFooter>
                <Button variant="link" onPress={() => setActiveModal(null)}>
                    Annuleren
                </Button>
                <Button
                    variant="cta"
                    onPress={() =>
                        mutate({
                            moduleId: parseInt(moduleId!),
                            data: { Temporary_Locked: true },
                        })
                    }>
                    Vergrendelen
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModuleLockModal
