import { FieldLabel, FormikError, Text, formatDate } from '@pzh-ui/components'
import { Pencil, TrashCan } from '@pzh-ui/icons'
import classNames from 'clsx'
import { useFormikContext } from 'formik'
import { useEffect, useMemo, useState } from 'react'

import { AreaBasic } from '@/api/fetchers.schemas'
import AreaPreview from '@/components/AreaPreview'
import { AreaModalAdd, AreaModalEdit } from '@/components/Modals/AreaModals'
import { AreaProps } from '@/components/Modals/AreaModals/AreaModalAdd'
import { ModelReturnType } from '@/config/objects/types'
import { DynamicField } from '@/config/types'
import useObject from '@/hooks/useObject'
import useModalStore from '@/store/modalStore'

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

    const [area, setArea] = useState<Partial<AreaBasic | undefined>>(data?.Area)

    const createdDate = useMemo(
        () =>
            area?.Created_Date &&
            formatDate(new Date(area.Created_Date + 'Z'), 'd MMMM yyyy'),
        [area?.Created_Date]
    )

    /**
     * On delete clear Formik value
     */
    const handleDeleteArea = () => {
        setFieldValue(name, null)
        setFieldValue('Source_Title', null)
        setArea(undefined)
    }

    /**
     * Handle form submit, set Formik value
     */
    const handleFormSubmit = (payload: AreaProps) => {
        setArea({
            Source_Title: payload.Title || '',
            UUID: payload.area,
            Source_UUID: payload.area,
            Created_Date: payload.Created_Date,
        })
        setFieldValue(name, payload.area)
        setFieldValue('Source_Title', payload.Title)
    }

    useEffect(() => {
        setFieldValue('Source_Title', area?.Source_Title)
    }, [area?.Source_Title, setFieldValue])

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
                            'text-pzh-green-500': !disabled,
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
                                        {area?.Source_Title}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActiveModal('areaEdit')
                                            }
                                            disabled={disabled}>
                                            <span className="sr-only">
                                                Werkingsgebied wijzigen
                                            </span>
                                            <Pencil
                                                className={classNames('mt-1', {
                                                    'text-pzh-blue': !disabled,
                                                    'text-pzh-gray-600':
                                                        disabled,
                                                })}
                                            />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleDeleteArea}
                                            disabled={disabled}>
                                            <span className="sr-only">
                                                Werkingsgebied verwijderen
                                            </span>
                                            <TrashCan
                                                className={classNames('mt-1', {
                                                    'text-pzh-red-500':
                                                        !disabled,
                                                    'text-pzh-gray-600':
                                                        disabled,
                                                })}
                                            />
                                        </button>
                                    </div>
                                </div>
                                <span className="block text-s">
                                    Datum: {createdDate}
                                </span>
                            </div>
                        </div>
                        <div className="col-span-9 flex h-[500px] flex-1 md:col-span-6">
                            <AreaPreview
                                key={
                                    area &&
                                    'Source_UUID' in area &&
                                    area.Source_UUID
                                        ? area.Source_UUID
                                        : area?.UUID || ''
                                }
                                UUID={
                                    area &&
                                    'Source_UUID' in area &&
                                    area.Source_UUID
                                        ? area.Source_UUID
                                        : area?.UUID || ''
                                }
                            />
                        </div>
                    </div>
                </div>
            )}

            <input name={name} type="hidden" />
            <input name="Source_Title" type="hidden" />

            <FormikError name={name} />

            <AreaModalAdd
                initialValues={{
                    area: area?.Source_UUID,
                }}
                handleFormSubmit={handleFormSubmit}
            />
            <AreaModalEdit
                initialValues={{
                    area: area?.Source_UUID,
                    Title: area?.Source_Title,
                }}
                handleFormSubmit={handleFormSubmit}
            />
        </>
    )
}

export default FieldSelectArea
