import FieldLabel from './FieldLabel'
import { RegulationFieldProps } from './types'

const FieldBoxtext = ({ name, label, ...props }: RegulationFieldProps) => (
    <>
        <FieldLabel name={`${name}.${label}`} label={label} {...props} />
        To-Do: Create Kadertekst field
    </>
)

export default FieldBoxtext
