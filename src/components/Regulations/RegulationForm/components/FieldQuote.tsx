import FieldLabel from './FieldLabel'
import { RegulationFieldProps } from './types'

const FieldQuote = ({ name, label, ...props }: RegulationFieldProps) => (
    <>
        <FieldLabel name={`${name}.${label}`} label={label} {...props} />
        To-Do: Create Citaat field
    </>
)

export default FieldQuote
