import { FormikInput, Text } from '@pzh-ui/components'
import React from 'react'

import { VerordeningChildRead } from '@/types/verordening'

import { useVerordening } from '../../verordeningEditContext'
import FormSubmitOrCancel from '../FormSubmitOrCancel'

export interface FormChapterProps {}

const FormChapter = ({ type }: { type: 'Hoofdstuk' }) => {
    const { state } = useVerordening()
    const { activeSectionData, isLoadingOrSaving } = state
    const emptyChild: Partial<VerordeningChildRead> = {
        Children: [],
        Gebied: null,
        Inhoud: '',
        Titel: '',
        Type: type,
        Volgnummer: 'string',
    }
    const values = activeSectionData ? activeSectionData : emptyChild

    return (
        <div className="flex items-center px-4 py-2 my-2 font-bold rounded bg-pzh-blue-super-light">
            <Text type="span" className="mr-2">
                Hoofdstuk
            </Text>

            <div className="w-10 -mb-1">
                <FormikInput
                    name="Volgnummer"
                    className="px-1 text-center"
                    type="text"
                    value={values.Volgnummer}
                />
            </div>
            <Text type="span" className="mx-2">
                -
            </Text>
            <div className="flex-1 h-full -mb-1">
                <FormikInput
                    name="Titel"
                    type="text"
                    placeholder="Titel"
                    value={values.Titel}
                />
            </div>

            <FormSubmitOrCancel />
        </div>
    )
}

export default FormChapter
