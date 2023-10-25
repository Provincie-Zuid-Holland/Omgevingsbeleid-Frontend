import FieldLabel from './FieldLabel'
import { RegulationFieldProps } from './types'

const FieldList = ({ name, label, ...props }: RegulationFieldProps) => (
    <>
        <FieldLabel name={`${name}.${label}`} label={label} {...props} />
        To-Do: Create Lijst field
    </>
)

export default FieldList
