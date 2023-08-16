import {
    Heading,
    Modal as ProvidedModal,
    ModalProps as ProvidedModalProps,
} from '@pzh-ui/components'

import useModalStore from '@/store/modalStore'

import { ModalType } from '../Modals/types'

interface ModalProps extends ProvidedModalProps {
    id: ModalType
}

const Modal = ({ id, title, children, ...rest }: ModalProps) => {
    const isOpen = useModalStore(state => state.activeModal === id)
    const setActiveModal = useModalStore(state => state.setActiveModal)

    return (
        <ProvidedModal
            isOpen={isOpen}
            onOpenChange={isOpen => !isOpen && setActiveModal(null)}
            title={title}
            {...rest}>
            <div className="px-8 py-[24px]">
                {title && (
                    <Heading level="2" className="mb-4">
                        {title}
                    </Heading>
                )}
                {children}
            </div>
        </ProvidedModal>
    )
}

export default Modal
