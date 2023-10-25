import FieldLabel from './FieldLabel'
import { RegulationFieldProps } from './types'

const FieldGlossary = ({ name, label, ...props }: RegulationFieldProps) => (
    <>
        <FieldLabel name={`${name}.${label}`} label={label} {...props} />
        To-Do: Create Begrippenlijst field
    </>
)

export default FieldGlossary
