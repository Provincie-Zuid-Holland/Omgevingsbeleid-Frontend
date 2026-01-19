import {
    cn,
    Heading,
    Modal as ProvidedModal,
    ModalProps as ProvidedModalProps,
    Text,
} from '@pzh-ui/components'

import { ModalType } from '@/components/Modals/types'
import useModalStore from '@/store/modalStore'
import { ReactNode } from 'react'

interface ModalProps extends Omit<ProvidedModalProps, 'id'> {
    id: ModalType
    hideTitle?: boolean
    onClose?: () => void
    description?: string
}

const Modal = ({
    id,
    title,
    description,
    hideTitle,
    size = 'xl',
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
            size={size}
            {...rest}>
            <div className="flex flex-col gap-4 px-10 py-8">
                {(!!title || !!description) && (
                    <div>
                        {title && !hideTitle && (
                            <Heading level="2" size="xl">
                                {title}
                            </Heading>
                        )}
                        {description && <Text>{description}</Text>}
                    </div>
                )}
                {children}
            </div>
        </ProvidedModal>
    )
}

export const ModalFooter = ({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) => (
    <div
        className={cn(
            'border-pzh-gray-300 flex items-center justify-between border-t pt-4',
            className
        )}>
        {children}
    </div>
)

export default Modal
