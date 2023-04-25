import { Heading, Hyperlink, Modal, Text } from '@pzh-ui/components'
import { Link } from 'react-router-dom'

import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import useNetworkStore from '@/store/networkStore'

interface NetworkModalProps {
    isOpen: boolean
    onClose: () => void
}

const NetworkModal = ({ isOpen, onClose }: NetworkModalProps) => {
    const activeNode = useNetworkStore(state => state.activeNode)
    const activeConnections = useNetworkStore(state => state.activeConnections)

    const model = models[activeNode?.Object_Type as ModelType] || {}
    const { prefixSingular, singular, plural, demonstrative } =
        model.defaults || {}

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            ariaLabel="Details van object"
            maxWidth="sm:max-w-[812px]"
            closeButton>
            <Heading level="2" className="mb-4">
                Details van object
            </Heading>
            <Text className="mb-4">
                Een overzicht van de koppelingen van {prefixSingular} {singular}{' '}
                ‘{activeNode?.Title}’. Er{' '}
                {activeConnections?.length === 1 ? 'is' : 'zijn'} in totaal{' '}
                {activeConnections?.length || 0}{' '}
                {activeConnections?.length === 1 ? 'koppeling' : 'koppelingen'}.
            </Text>

            {!!activeConnections?.length && (
                <ul className="mb-5">
                    {activeConnections.map(connection => {
                        const model =
                            models[connection?.Object_Type as ModelType]

                        return (
                            <li key={connection.UUID}>
                                <Link
                                    to={`/omgevingsvisie/${model?.defaults.plural}/${connection.UUID}`}
                                    className="flex items-center justify-between pt-2 pb-1 px-2 border-b border-pzh-blue-dark/35">
                                    <p className="leading-none underline decoration-1">
                                        {connection.Title}
                                    </p>
                                    <span>
                                        {model?.defaults.singularCapitalize}
                                    </span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            )}

            <Hyperlink
                to={`/omgevingsvisie/${plural}/${activeNode?.UUID}`}
                text={`Bekijk de detailpagina van ${demonstrative} ${singular} in het digitaal omgevingsbeleid`}
            />
        </Modal>
    )
}

export default NetworkModal
