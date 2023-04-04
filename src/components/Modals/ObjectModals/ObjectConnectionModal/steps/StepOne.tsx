import { Button, Divider, Text } from '@pzh-ui/components'
import { PenToSquare, TrashCan } from '@pzh-ui/icons'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'

import { RelationShort } from '@/api/fetchers.schemas'

import { StepProps } from './types'

export const StepOne = ({
    title,
    model,
    connectionModel,
    connections,
    setStep,
    handleDeleteConnection,
}: StepProps) => {
    const { defaults } = connectionModel || {}
    const { pluralCapitalize, plural, prefixNewObject, singular } =
        defaults || {}

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
                {pluralCapitalize} koppelen aan {model.defaults.singular}:{' '}
                <span className="font-bold">{title}</span>
            </Text>
            <Divider />
            <div className="mt-4 flex justify-between items-center">
                <span className="font-bold">
                    {amount} Gekoppelde {amount === 1 ? singular : plural}
                </span>
                <Button
                    size="small"
                    variant="cta"
                    type="button"
                    onPress={() => setStep?.(2)}>
                    {prefixNewObject} {singular} koppelen
                </Button>
            </div>

            {amount > 0 && (
                <>
                    {Array.isArray(connections) &&
                        connections.map(connection => (
                            <Connection
                                key={connection.UUID}
                                setStep={setStep!}
                                handleDeleteConnection={handleDeleteConnection!}
                                {...connection}
                            />
                        ))}
                </>
            )}
        </>
    )
}

interface ConnectionProps extends RelationShort {
    Title?: string
    setStep: (step: number) => void
    handleDeleteConnection: (connection: RelationShort) => void
}

const Connection = ({
    Object_ID,
    Object_Type,
    Title,
    Description,
    setStep,
    handleDeleteConnection,
}: ConnectionProps) => {
    const { setFieldValue } = useFormikContext<RelationShort>()

    return (
        <div className="mt-3">
            <div className="px-3 pt-2 pb-1 flex justify-between items-center bg-pzh-gray-100 border border-pzh-gray-300 rounded-tl-[4px] rounded-tr-[4px]">
                <span className="font-bold">{Title}</span>
                <div className="flex items-center -mt-[4px]">
                    <button
                        className="mr-3"
                        onClick={() => {
                            setFieldValue('Title', Title)
                            setFieldValue('Description', Description)
                            setFieldValue('Object_ID', Object_ID)
                            setStep(3)
                        }}
                        aria-label="Wijzigen">
                        <PenToSquare size={16} className="text-pzh-green" />
                    </button>
                    <button
                        onClick={() =>
                            handleDeleteConnection({ Object_ID, Object_Type })
                        }
                        aria-label="Verwijderen">
                        <TrashCan size={16} className="text-pzh-red" />
                    </button>
                </div>
            </div>
            <div className="px-3 py-2 border border-t-0 border-pzh-gray-300 rounded-bl-[4px] rounded-br-[4px]">
                <Text>{Description}</Text>
            </div>
        </div>
    )
}
