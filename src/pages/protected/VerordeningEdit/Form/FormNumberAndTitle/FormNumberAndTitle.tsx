import { FormikInput, Text } from '@pzh-ui/components'
import classNames from 'classnames'
import React from 'react'

import { VerordeningChildRead } from '@/types/verordening'

import { useVerordening } from '../../verordeningEditContext'
import FormSubmitOrCancel from '../FormSubmitOrCancel'

export interface FormNumberAndTitleProps {
    type: 'Hoofdstuk' | 'Afdeling' | 'Paragraaf' | 'Artikel'
}

const FormNumberAndTitle = ({ type }: FormNumberAndTitleProps) => {
    const { state } = useVerordening()
    const { activeSectionData } = state

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
        <div
            className={classNames(
                'flex text-pzh-blue-dark items-center py-2 my-2 font-bold',
                {
                    'rounded bg-pzh-blue-super-light px-4':
                        type === 'Hoofdstuk' ||
                        type === 'Afdeling' ||
                        type === 'Paragraaf',
                }
            )}>
            <Text type="span" className="mr-2">
                {type}
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

export default FormNumberAndTitle
