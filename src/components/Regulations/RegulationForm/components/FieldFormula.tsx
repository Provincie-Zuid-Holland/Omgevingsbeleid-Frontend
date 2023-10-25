import FieldLabel from './FieldLabel'
import { RegulationFieldProps } from './types'

const FieldFormula = ({ name, label, ...props }: RegulationFieldProps) => (
    <div>
        <FieldLabel name={`${name}.${label}`} label={label} {...props} />
        To-Do: Create Formule field
    </div>
)

export default FieldFormula
