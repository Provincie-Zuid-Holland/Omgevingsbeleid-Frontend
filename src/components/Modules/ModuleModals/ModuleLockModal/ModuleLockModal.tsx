import { Button, Heading, Modal, Text } from '@pzh-ui/components'
import { useParams } from 'react-router-dom'

import useModules from '@/hooks/useModules'

interface ModuleLockModalProps {
    isOpen: boolean
    onClose: () => void
}

const ModuleLockModal = ({ isOpen, onClose }: ModuleLockModalProps) => {
    const { moduleId } = useParams()

    const { useEditModule } = useModules()
    const { mutate } = useEditModule(parseInt(moduleId!), () => onClose())

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            ariaLabel="Module locken"
            maxWidth="sm:max-w-[812px]">
            <Heading level="2" className="mb-4">
                Module locken
            </Heading>

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
                <Button variant="link" onPress={onClose}>
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
