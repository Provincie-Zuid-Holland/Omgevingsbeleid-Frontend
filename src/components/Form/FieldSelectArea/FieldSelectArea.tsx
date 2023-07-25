import { FieldLabel, Text, formatDate } from '@pzh-ui/components'
import { TrashCan } from '@pzh-ui/icons'
import classNames from 'classnames'
import { useFormikContext } from 'formik'
import { useMemo, useState } from 'react'

import { Werkingsgebied } from '@/api/fetchers.schemas'
import { ModelReturnType } from '@/config/objects/types'
import { DynamicField } from '@/config/types'
import useObject from '@/hooks/useObject'

import AreaPreview from '../../AreaPreview'
import AreaModal from '../../Modals/AreaModal'
import { AreaProps } from '../../Modals/AreaModal/AreaModal'

const FieldSelectArea = ({
    name,
    label,
    required,
    description,
    disabled,
}: Omit<DynamicField, 'type'> & { disabled?: boolean }) => {
    const { values, setFieldValue } = useFormikContext<ModelReturnType>()
    const value = values[name as keyof typeof values]

    const { data } = useObject()

    const [area, setArea] = useState<Partial<Werkingsgebied | undefined>>(
        data?.Gebied
    )
    const [isOpen, setOpen] = useState(false)

    const modifiedDate = useMemo(
        () =>
            area?.Modified_Date &&
            formatDate(new Date(area.Modified_Date + 'Z'), 'd MMMM yyyy'),
        [area?.Modified_Date]
    )

    /**
     * On delete clear Formik value
     */
    const handleDeleteArea = () => setFieldValue(name, null)

    /**
     * Handle form submit, set Formik value
     */
    const handleFormSubmit = (payload: AreaProps) => {
        setArea({
            Title: payload.Title || '',
            Modified_Date: payload.Modified_Date || '',
        })
        setFieldValue(name, payload.version)
    }

    return (
        <>
            {label && (
                <FieldLabel
                    name={name}
                    label={label}
                    description={description}
                    required={required}
                />
            )}

            {!value ? (
                <button
                    onClick={() => setOpen(true)}
                    type="button"
                    className={classNames(
                        'mt-4 w-full rounded-[4px] border border-pzh-gray-600 px-2 py-4 underline',
                        {
                            'text-pzh-green': !disabled,
                            'bg-pzh-gray-100 text-pzh-gray-600': disabled,
                        }
                    )}
                    disabled={disabled}>
                    Werkingsgebied koppelen
                </button>
            ) : (
                <div className="mt-4 w-full rounded-[4px] border border-pzh-gray-600 p-2">
                    <div className="grid grid-cols-9 gap-4">
                        <div className="col-span-9 p-2 md:col-span-3">
                            <Text type="body-bold">
                                Gekoppeld werkingsgebied
                            </Text>

                            <div className="mt-5 rounded-[4px] border border-pzh-gray-200 p-2">
                                <div className="flex items-start justify-between">
                                    <p className="font-bold leading-5">
                                        {area?.Title}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleDeleteArea}
                                        disabled={disabled}>
                                        <span className="sr-only">
                                            Werkingsgebied verwijderen
                                        </span>
                                        <TrashCan
                                            className={classNames('mt-[4px]', {
                                                'text-pzh-red': !disabled,
                                                'text-pzh-gray-600': disabled,
                                            })}
                                        />
                                    </button>
                                </div>
                                <span className="block text-[16px]">
                                    Laatste update van {modifiedDate}
                                </span>
                            </div>
                        </div>
                        <div className="col-span-9 flex h-[500px] flex-1 md:col-span-6">
                            <AreaPreview area={area} />
                        </div>
                    </div>
                </div>
            )}

            <input name={name} type="hidden" />

            <AreaModal
                isOpen={isOpen}
                onClose={() => setOpen(false)}
                handleFormSubmit={handleFormSubmit}
            />
        </>
    )
}

export default FieldSelectArea
