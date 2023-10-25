import FieldLabel from './FieldLabel'
import { RegulationFieldProps } from './types'

const FieldSubheading = ({ name, label, ...props }: RegulationFieldProps) => (
    <div>
        <FieldLabel name={`${name}.${label}`} label={label} {...props} />
        To-Do: Create Tussenkop field
    </div>
)

export default FieldSubheading
