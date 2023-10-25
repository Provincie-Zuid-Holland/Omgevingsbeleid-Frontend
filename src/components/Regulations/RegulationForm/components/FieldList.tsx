import FieldLabel from './FieldLabel'
import { RegulationFieldProps } from './types'

const FieldList = ({ name, label, ...props }: RegulationFieldProps) => (
    <div>
        <FieldLabel name={`${name}.${label}`} label={label} {...props} />
        To-Do: Create Lijst field
    </div>
)

export default FieldList
