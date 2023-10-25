import { FieldTextAreaProps, FormikTextArea } from '@pzh-ui/components'
import FieldLabel from './FieldLabel'
import { RegulationFieldProps } from './types'

const FieldParagraph = ({
    name,
    label,
    ...props
}: FieldTextAreaProps & RegulationFieldProps) => (
    <div>
        <FieldLabel name={`${name}.${label}`} label={label} {...props} />
        <FormikTextArea name={`${name}.${label}`} {...props} />
    </div>
)

export default FieldParagraph
