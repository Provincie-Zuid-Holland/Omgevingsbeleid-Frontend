import {
    Heading,
    Modal as ProvidedModal,
    ModalProps as ProvidedModalProps,
} from '@pzh-ui/components'

import { ModalType } from '@/components/Modals/types'
import useModalStore from '@/store/modalStore'

interface ModalProps extends Omit<ProvidedModalProps, 'id'> {
    id: ModalType
    hideTitle?: boolean
    onClose?: () => void
}

const Modal = ({
    id,
    title,
    hideTitle,
    onClose,
    children,
    ...rest
}: ModalProps) => {
    const isOpen = useModalStore(state => state.activeModal === id)
    const setActiveModal = useModalStore(state => state.setActiveModal)

    return (
        <ProvidedModal
            isOpen={isOpen}
            onOpenChange={isOpen =>
                !isOpen && onClose ? onClose() : setActiveModal(null)
            }
            title={title}
            {...rest}>
            <div className="px-8 py-6">
                {title && !hideTitle && (
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
