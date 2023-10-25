import FieldLabel from './FieldLabel'
import { RegulationFieldProps } from './types'

const FieldTable = ({ name, label, ...props }: RegulationFieldProps) => (
    <div>
        <FieldLabel name={`${name}.${label}`} label={label} {...props} />
        To-Do: Create Tabel field
    </div>
)

export default FieldTable
