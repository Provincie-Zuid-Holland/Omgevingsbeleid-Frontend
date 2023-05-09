import { Button, Divider, Text } from '@pzh-ui/components'
import { PenToSquare, TrashCan } from '@pzh-ui/icons'
import classNames from 'classnames'
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
    const { atemporal, pluralCapitalize, plural, prefixNewObject, singular } =
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
                    {amount} Gekoppelde{' '}
                    {amount === 1
                        ? singular?.replaceAll('_', ' ')
                        : plural?.replaceAll('_', ' ')}
                </span>
                <Button
                    size="small"
                    variant="cta"
                    type="button"
                    onPress={() => setStep?.(2)}>
                    {prefixNewObject} {singular?.replaceAll('_', ' ')} koppelen
                </Button>
            </div>

            {amount > 0 && (
                <>
                    {Array.isArray(connections) &&
                        connections.map(connection => (
                            <Connection
                                key={connection.UUID}
                                atemporal={atemporal}
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
    atemporal?: boolean
    Title?: string
    setStep: (step: number) => void
    handleDeleteConnection: (connection: RelationShort) => void
}

const Connection = ({
    atemporal,
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
            <div
                className={classNames(
                    'px-3 pt-2 pb-1 flex justify-between items-center bg-pzh-gray-100 border border-pzh-gray-300',
                    {
                        'rounded-[4px]': atemporal,
                        'rounded-tl-[4px] rounded-tr-[4px]': !atemporal,
                    }
                )}>
                <span className="font-bold">{Title}</span>
                <div className="flex items-center -mt-[4px]">
                    {!atemporal && (
                        <button
                            type="button"
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
                    )}
                    <button
                        type="button"
                        onClick={() =>
                            handleDeleteConnection({ Object_ID, Object_Type })
                        }
                        aria-label="Verwijderen">
                        <TrashCan size={16} className="text-pzh-red" />
                    </button>
                </div>
            </div>
            {!atemporal && (
                <div className="px-3 py-2 border border-t-0 border-pzh-gray-300 rounded-bl-[4px] rounded-br-[4px]">
                    <Text>{Description}</Text>
                </div>
            )}
        </div>
    )
}
