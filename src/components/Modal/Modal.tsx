import { ReactNode, useEffect } from 'react'

import {
    cn,
    Heading,
    Modal as ProvidedModal,
    ModalProps as ProvidedModalProps,
    Text,
} from '@pzh-ui/components'

import { ModalType } from '@/components/Modals/types'
import useModalStore from '@/store/modalStore'

interface ModalProps extends Omit<ProvidedModalProps, 'id'> {
    id: ModalType
    hideTitle?: boolean
    onClose?: () => void
    description?: React.JSX.Element | string
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

    /**
     * The active modal lives in a global store that isn't tied to the
     * route, so it survives navigating away and back. This closes it whenever
     * the modal leaves the tree to prevent reopening by itself.
     */
    useEffect(() => {
        return () => {
            if (useModalStore.getState().activeModal === id) {
                setActiveModal(null)
            }
        }
    }, [id, setActiveModal])

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
                        {description && typeof description === 'string' ? (
                            <Text>{description}</Text>
                        ) : (
                            description
                        )}
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
            'flex items-center justify-between border-t border-pzh-gray-300 pt-4',
            className
        )}>
        {children}
    </div>
)

export default Modal
