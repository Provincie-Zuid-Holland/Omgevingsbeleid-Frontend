import { FieldLabel } from '@pzh-ui/components'
import { useFormikContext } from 'formik'
import { useState } from 'react'

import { DynamicField } from '@/config/objects/types'

import AreaModal from '../Modals/AreaModal'
import { AreaProps } from '../Modals/AreaModal/AreaModal'

const SelectArea = ({
    name,
    label,
    required,
    description,
}: Omit<DynamicField, 'type'>) => {
    const { setFieldValue } = useFormikContext()

    const [isOpen, setOpen] = useState(false)

    const handleFormSubmit = (payload: AreaProps) =>
        setFieldValue(name, payload.version)

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

            <button
                onClick={() => setOpen(true)}
                type="button"
                className="w-full py-4 px-2 mt-4 border border-pzh-gray-600 rounded-[4px] text-pzh-green underline">
                Werkingsgebied koppelen
            </button>

            <div className="relative">
                <input name={name} type="hidden" />
            </div>

            <AreaModal
                isOpen={isOpen}
                onClose={() => setOpen(false)}
                handleFormSubmit={handleFormSubmit}
            />
        </>
    )
}

export default SelectArea
