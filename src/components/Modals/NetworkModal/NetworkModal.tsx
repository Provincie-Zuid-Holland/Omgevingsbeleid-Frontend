import { Hyperlink, Text } from '@pzh-ui/components'
import { Link } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import Modal from '@/components/Modal'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import useNetworkStore from '@/store/networkStore'

const NetworkModal = () => {
    const { activeNode, activeConnections } = useNetworkStore(
        useShallow(state => ({
            activeNode: state.activeNode,
            activeConnections: state.activeConnections,
        }))
    )

    const model = models[activeNode?.Object_Type as ModelType] || {}
    const { prefixSingular, singular, demonstrative, plural, slugOverview } =
        model.defaults || {}

    return (
        <Modal id="objectDetails" title="Details van object">
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
                                    to={`/${model.defaults.slugOverview}/${model.defaults.plural}/${connection.UUID}`}
                                    className="flex items-center justify-between border-b border-pzh-blue-900/35 px-2 pb-1 pt-2">
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

            <Hyperlink asChild>
                <Link to={`/${slugOverview}/${plural}/${activeNode?.UUID}`}>
                    Bekijk de detailpagina van {demonstrative} {singular} in het
                    digitaal omgevingsbeleid
                </Link>
            </Hyperlink>
        </Modal>
    )
}

export default NetworkModal
