import FieldLabel from './FieldLabel'
import { RegulationFieldProps } from './types'

const FieldFormula = ({ name, label, ...props }: RegulationFieldProps) => (
    <>
        <FieldLabel name={`${name}.${label}`} label={label} {...props} />
        To-Do: Create Formule field
    </>
)

export default FieldFormula
