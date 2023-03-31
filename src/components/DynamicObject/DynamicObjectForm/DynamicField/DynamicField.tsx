import {
    FormikInput,
    FormikRte,
    FormikSelect,
    FormikTextArea,
} from '@pzh-ui/components'

import SelectArea from '@/components/SelectArea'
import { DynamicField as DynamicFieldProps } from '@/config/objects/types'

const inputFieldMap = {
    text: FormikInput,
    textarea: FormikTextArea,
    wysiwyg: FormikRte,
    select: FormikSelect,
    area: SelectArea,
}

const DynamicField = ({
    type,
    isFirst,
    isLocked,
    ...field
}: DynamicFieldProps & { isFirst?: boolean; isLocked?: boolean }) => {
    const InputField = inputFieldMap[type]
    if (!InputField) {
        throw new Error(`Oh no! No field found for type: ${type}..`)
    }

    const marginTop = isFirst ? '' : 'mt-8'

    return (
        <div className={marginTop}>
            <InputField disabled={isLocked} {...field} />
        </div>
    )
}

export default DynamicField
