import { Link } from 'react-router-dom'

import { Hyperlink, Text } from '@pzh-ui/components'

import Modal from '@/Modal'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import useNetworkStore from '@/store/networkStore'

const NetworkModal = () => {
    const { activeNode, activeConnections } = useNetworkStore(state => ({
        ...state,
    }))

    const model = models[activeNode?.Object_Type as ModelType] || {}
    const { prefixSingular, singular, demonstrative, slugOverview } =
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
                                    to={`/${model.defaults.slugOverview}/${connection.UUID}`}
                                    className="flex items-center justify-between border-b border-pzh-blue-dark/35 px-2 pb-1 pt-2">
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
                to={`/${slugOverview}/${activeNode?.UUID}`}
                text={`Bekijk de detailpagina van ${demonstrative} ${singular} in het digitaal omgevingsbeleid`}
            />
        </Modal>
    )
}

export default NetworkModal
