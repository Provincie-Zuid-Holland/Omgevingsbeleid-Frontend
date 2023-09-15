import classNames from 'classnames'
import { useFormikContext } from 'formik'
import { useMemo, useState } from 'react'

import { FieldLabel, Text, formatDate } from '@pzh-ui/components'
import { TrashCan } from '@pzh-ui/icons'

import { Werkingsgebied } from '@/api/fetchers.schemas'
import { ModelReturnType } from '@/config/objects/types'
import { DynamicField } from '@/config/types'
import useObject from '@/hooks/useObject'
import useModalStore from '@/store/modalStore'

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
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { values, setFieldValue } = useFormikContext<ModelReturnType>()
    const value = values[name as keyof typeof values]

    const { data } = useObject()

    const [area, setArea] = useState<Partial<Werkingsgebied | undefined>>(
        data?.Gebied
    )

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
                    onClick={() => setActiveModal('areaAdd')}
                    type="button"
                    className={classNames(
                        'mt-4 w-full rounded border border-pzh-gray-600 px-2 py-4 underline',
                        {
                            'text-pzh-green': !disabled,
                            'bg-pzh-gray-100 text-pzh-gray-600': disabled,
                        }
                    )}
                    disabled={disabled}>
                    Werkingsgebied koppelen
                </button>
            ) : (
                <div className="mt-4 w-full rounded border border-pzh-gray-600 p-2">
                    <div className="grid grid-cols-9 gap-4">
                        <div className="col-span-9 p-4 md:col-span-3">
                            <Text bold>Gekoppeld werkingsgebied</Text>

                            <div className="mt-6 rounded border border-pzh-gray-200 p-2">
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
                                            className={classNames('mt-1', {
                                                'text-pzh-red': !disabled,
                                                'text-pzh-gray-600': disabled,
                                            })}
                                        />
                                    </button>
                                </div>
                                <span className="block text-s">
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

            <AreaModal handleFormSubmit={handleFormSubmit} />
        </>
    )
}

export default FieldSelectArea
