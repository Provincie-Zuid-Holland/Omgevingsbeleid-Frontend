import FieldLabel from './FieldLabel'
import { RegulationFieldProps } from './types'

const FieldSubheading = ({ name, label, ...props }: RegulationFieldProps) => (
    <>
        <FieldLabel name={`${name}.${label}`} label={label} {...props} />
        To-Do: Create Tussenkop field
    </>
)

export default FieldSubheading
