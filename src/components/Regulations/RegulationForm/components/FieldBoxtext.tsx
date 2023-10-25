import FieldLabel from './FieldLabel'
import { RegulationFieldProps } from './types'

const FieldBoxtext = ({ name, label, ...props }: RegulationFieldProps) => (
    <div>
        <FieldLabel name={`${name}.${label}`} label={label} {...props} />
        To-Do: Create Kadertekst field
    </div>
)

export default FieldBoxtext
