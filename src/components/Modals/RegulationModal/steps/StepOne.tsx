import { Button, Divider, Text } from '@pzh-ui/components'
import { TrashCan } from '@pzh-ui/icons'
import { useMemo } from 'react'

import { Regulation, RegulationObjectOverwrite } from '@/api/fetchers.schemas'

import { StepProps } from './types'

export const StepOne = ({
    title,
    model,
    connections,
    setStep,
    handleDeleteConnection,
}: StepProps) => {
    /**
     * Get amount of connections
     */
    const amount = useMemo(
        () => Object.values(connections || {}).length,
        [connections]
    )

    return (
        <>
            <Text className="mb-4">
                Nationale belangen en Wettelijke taken koppelen aan{' '}
                {model.defaults.singular}:{' '}
                <span className="font-bold">{title}</span>
            </Text>
            <Divider />
            <div className="mt-4 flex justify-between items-center">
                <span className="font-bold">
                    {amount} Gekoppelde nationale belangen en wettelijke taken
                </span>
                <Button
                    size="small"
                    variant="cta"
                    type="button"
                    onPress={() => setStep?.(2)}>
                    Nieuwe koppeling maken
                </Button>
            </div>

            {amount > 0 && (
                <>
                    {Array.isArray(connections) &&
                        connections.map(connection => (
                            <Connection
                                key={connection.UUID}
                                handleDeleteConnection={handleDeleteConnection!}
                                {...connection}
                            />
                        ))}
                </>
            )}
        </>
    )
}

interface ConnectionProps extends Regulation {
    handleDeleteConnection: (connection: RegulationObjectOverwrite) => void
}

const Connection = ({
    Title,
    UUID,
    handleDeleteConnection,
}: ConnectionProps) => (
    <div className="mt-3">
        <div className="px-3 pt-2 pb-1 flex justify-between items-center bg-pzh-gray-100 border border-pzh-gray-300 rounded-[4px]">
            <span className="font-bold">{Title}</span>
            <div className="flex items-center -mt-[4px]">
                <button
                    type="button"
                    onClick={() => handleDeleteConnection({ UUID })}
                    aria-label="Verwijderen">
                    <TrashCan size={16} className="text-pzh-red" />
                </button>
            </div>
        </div>
    </div>
)
