import { FormikInput, Text } from '@pzh-ui/components'
import classNames from 'classnames'
import { FC } from 'react'

export interface FormNumberAndTitleProps {
    type: 'Hoofdstuk' | 'Afdeling' | 'Paragraaf' | 'Artikel'
    marginLeft?: boolean
}

const FormNumberAndTitle: FC<FormNumberAndTitleProps> = ({
    type,
    children,
    marginLeft,
}) => {
    return (
        <div
            className={classNames(
                'flex text-pzh-blue-dark items-center py-2 my-2 font-bold',
                {
                    'rounded bg-pzh-blue-super-light px-4':
                        type === 'Hoofdstuk' ||
                        type === 'Afdeling' ||
                        type === 'Paragraaf',
                    'ml-4': marginLeft,
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
                />
            </div>
            <Text type="span" className="mx-2">
                -
            </Text>
            <div className="flex-1 h-full -mb-1">
                <FormikInput name="Titel" type="text" placeholder="Titel" />
            </div>

            {children}
        </div>
    )
}

export default FormNumberAndTitle
