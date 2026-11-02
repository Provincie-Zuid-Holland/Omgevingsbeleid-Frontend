import { useMemo } from 'react'

import { Button, Divider, Heading, Text } from '@pzh-ui/components'
import { PenToSquare, TrashCan } from '@pzh-ui/icons'

import classNames from 'clsx'
import { useFormikContext } from 'formik'

import { ReadRelation } from '@/api/fetchers.schemas'

import { StepProps } from './types'

export const StepOne = ({
    title,
    model,
    connectionModel,
    connections,
    setStep,
}: StepProps) => {
    const { defaults } = connectionModel || {}
    const { atemporal, pluralCapitalize, pluralReadable, singularReadable } =
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
            <Heading level="2" size="xl" className="mb-2">
                {pluralCapitalize}
            </Heading>

            <Text className="mb-4">
                {pluralCapitalize} koppelen aan{' '}
                {model.defaults.singularReadable}:{' '}
                <span className="font-bold">{title}</span>
            </Text>
            <Divider />
            <div className="mt-4 flex items-center justify-between">
                <span className="font-bold">
                    {amount} gekoppelde{' '}
                    {amount === 1 ? singularReadable : pluralReadable}
                </span>
                <Button
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
                                key={
                                    connection.object_type +
                                    connection.object_id
                                }
                                atemporal={atemporal}
                                setStep={setStep!}
                                {...connection}
                            />
                        ))}
                </>
            )}
        </>
    )
}

interface ConnectionProps extends ReadRelation {
    atemporal?: boolean
    setStep: (step: number) => void
}

const Connection = ({
    atemporal,
    object_id,
    object_type,
    title,
    description,
    setStep,
}: ConnectionProps) => {
    const { setFieldValue } = useFormikContext<ReadRelation>()

    return (
        <div className="mt-3">
            <div
                className={classNames(
                    'flex items-center justify-between border border-pzh-gray-300 bg-pzh-gray-100 p-4',
                    {
                        rounded: atemporal,
                        'rounded-tl rounded-tr': !atemporal,
                        'rounded-br rounded-bl': !description && !atemporal,
                    }
                )}>
                <span className="font-bold">{title}</span>
                <div className="-mt-1 flex items-center">
                    {!atemporal && (
                        <button
                            type="button"
                            className="mr-3"
                            onClick={() => {
                                setFieldValue('title', title)
                                setFieldValue('description', description)
                                setFieldValue('object_id', object_id)
                                setFieldValue('type', 'edit')
                                setStep(3)
                            }}
                            aria-label="Wijzigen">
                            <PenToSquare
                                size={16}
                                className="text-pzh-green-500"
                            />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => {
                            setFieldValue('title', title)
                            setFieldValue('object_id', object_id)
                            setFieldValue('object_type', object_type)
                            setStep(4)
                        }}
                        aria-label="Verwijderen">
                        <TrashCan size={16} className="text-pzh-red-500" />
                    </button>
                </div>
            </div>
            {!atemporal && !!description && (
                <div className="rounded-br rounded-bl border border-t-0 border-pzh-gray-300 px-3 py-2">
                    <Text>{description}</Text>
                </div>
            )}
        </div>
    )
}
