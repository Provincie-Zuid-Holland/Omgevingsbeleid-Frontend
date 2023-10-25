import FieldLabel from './FieldLabel'
import { RegulationFieldProps } from './types'

const FieldGlossary = ({ name, label, ...props }: RegulationFieldProps) => (
    <div>
        <FieldLabel name={`${name}.${label}`} label={label} {...props} />
        To-Do: Create Begrippenlijst field
    </div>
)

export default FieldGlossary
