import FieldLabel from './FieldLabel'
import { RegulationFieldProps } from './types'

const FieldQuote = ({ name, label, ...props }: RegulationFieldProps) => (
    <div>
        <FieldLabel name={`${name}.${label}`} label={label} {...props} />
        To-Do: Create Citaat field
    </div>
)

export default FieldQuote
