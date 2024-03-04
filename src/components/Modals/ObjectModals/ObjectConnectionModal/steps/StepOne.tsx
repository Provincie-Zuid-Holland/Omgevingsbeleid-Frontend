import { Button, Divider, Heading, Text } from '@pzh-ui/components'
import { PenToSquare, TrashCan } from '@pzh-ui/icons'
import classNames from 'clsx'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'

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
    const {
        atemporal,
        pluralCapitalize,
        plural,
        prefixNewObject,
        singularReadable,
        singularCapitalize,
    } = defaults || {}

    /**
     * Get amount of connections
     */
    const amount = useMemo(
        () => Object.values(connections || {}).length,
        [connections]
    )

    return (
        <>
            <Heading level="2" className="mb-2">
                {singularCapitalize} koppelen
            </Heading>

            <Text className="mb-4">
                {pluralCapitalize} koppelen aan{' '}
                {model.defaults.singularReadable}:{' '}
                <span className="font-bold">{title}</span>
            </Text>
            <Divider />
            <div className="mt-4 flex items-center justify-between">
                <span className="font-bold">
                    {amount} Gekoppelde{' '}
                    {amount === 1
                        ? singularReadable
                        : plural?.replaceAll('-', ' ')}
                </span>
                <Button
                    size="small"
                    variant="cta"
                    type="button"
                    onPress={() => setStep?.(2)}>
                    {prefixNewObject} {singularReadable} koppelen
                </Button>
            </div>

            {amount > 0 && (
                <>
                    {Array.isArray(connections) &&
                        connections.map(connection => (
                            <Connection
                                key={
                                    connection.Object_Type +
                                    connection.Object_ID
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
    Object_ID,
    Object_Type,
    Title,
    Description,
    setStep,
}: ConnectionProps) => {
    const { setFieldValue } = useFormikContext<ReadRelation>()

    return (
        <div className="mt-3">
            <div
                className={classNames(
                    'flex items-center justify-between border border-pzh-gray-300 bg-pzh-gray-100 px-3 pb-1 pt-2',
                    {
                        rounded: atemporal,
                        'rounded-tl rounded-tr': !atemporal,
                        'rounded-bl rounded-br': !Description && !atemporal,
                    }
                )}>
                <span className="font-bold">{Title}</span>
                <div className="-mt-1 flex items-center">
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
                        onClick={() => {
                            setFieldValue('Title', Title)
                            setFieldValue('Object_ID', Object_ID)
                            setFieldValue('Object_Type', Object_Type)
                            setStep(4)
                        }}
                        aria-label="Verwijderen">
                        <TrashCan size={16} className="text-pzh-red" />
                    </button>
                </div>
            </div>
            {!atemporal && !!Description && (
                <div className="rounded-bl rounded-br border border-t-0 border-pzh-gray-300 px-3 py-2">
                    <Text>{Description}</Text>
                </div>
            )}
        </div>
    )
}
