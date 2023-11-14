import { useParams } from 'react-router-dom'

import { Button, Text } from '@pzh-ui/components'

import Modal from '@/components/Modal'
import useModule from '@/hooks/useModule'
import useModalStore from '@/store/modalStore'

const ModuleLockModal = () => {
    const { moduleId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { useEditModule } = useModule()
    const { mutate } = useEditModule('moduleLocked', () => setActiveModal(null))

    return (
        <Modal id="moduleLock" title="Module locken">
            <Text>
                Je staat op het punt om de module te locken. Dit houdt in dat de
                onderdelen in deze module tijdelijk niet meer kunnen worden
                bewerkt. Dit is handig voor het maken van (technische) exports
                van de stukken.
                <br />
                <br />
                Let op, je moet handmatig de lock weer van de module afhalen
                zodra de behandelend ambtenaren weer aan hun stukken mogen
                werken.
            </Text>

            <div className="mt-6 flex items-center justify-between">
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
                    Locken
                </Button>
            </div>
        </Modal>
    )
}

export default ModuleLockModal
