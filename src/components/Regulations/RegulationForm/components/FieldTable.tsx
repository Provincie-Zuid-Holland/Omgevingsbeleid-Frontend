import FieldLabel from './FieldLabel'
import { RegulationFieldProps } from './types'

const FieldTable = ({ name, label, ...props }: RegulationFieldProps) => (
    <>
        <FieldLabel name={`${name}.${label}`} label={label} {...props} />
        To-Do: Create Tabel field
    </>
)

export default FieldTable
