import { useFormikContext } from 'formik'
import { useMemo } from 'react'

import { FieldLabel, FormikRadio, Text, formatDate } from '@pzh-ui/components'

import AreaPreview from '@/components/AreaPreview'

import { AreaProps } from '../AreaModal'
import { StepProps } from './types'

export const StepTwo = ({ data }: StepProps) => {
    const { values, setFieldValue } = useFormikContext<AreaProps>()

    /**
     * Find selected area by ID
     */
    const options = useMemo(() => {
        if (!data) return

        const selected = Object.keys(data).find(item =>
            data[item].some(
                item => values.area && item.UUID === values.area
            )
        )

        if (!selected) return

        return data[selected].sort((a, b) => new Date(b.Modified_Date).getTime() - new Date(a.Modified_Date).getTime())
    }, [data, values.area])

    /**
     * Find selected area by ID
     */
    const selectedArea = useMemo(() => {
        if (!options) return

        const selected = options.find(
            item => values.version && item.UUID === values.version
        )

        setFieldValue('Title', selected?.Title)
        setFieldValue('Modified_Date', selected?.Modified_Date)

        return selected
    }, [options, values.version, setFieldValue])

    return (
        <div>
            <Text className="mb-6">Selecteer een versie om te koppelen</Text>

            <div className="grid grid-cols-9 gap-4">
                <div className="col-span-5">
                    <FieldLabel name="version" label="Versie" />

                    <div className="h-[460px] overflow-y-auto rounded border border-pzh-gray-200 p-4">
                        {options?.map((version, index) => (
                            <div
                                key={version.UUID}
                                className={
                                    index + 1 !== options.length ? 'mb-2' : ''
                                }>
                                <FormikRadio
                                    name="version"
                                    value={version.UUID}
                                    defaultChecked={
                                        version.UUID === values.version
                                    }>
                                    {version.Title}
                                </FormikRadio>
                                <span className="ml-[34px] block text-s">
                                    Laatste update van{' '}
                                    {formatDate(
                                        new Date(version.Modified_Date),
                                        'd MMMM yyyy'
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-4 flex flex-col">
                    <Text bold className="mb-2">
                        Voorbeeld
                    </Text>

                    <div className="flex flex-1">
                        <AreaPreview area={selectedArea} />
                    </div>
                </div>
            </div>
        </div>
    )
}
