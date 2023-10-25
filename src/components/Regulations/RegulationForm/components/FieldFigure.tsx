import FieldLabel from './FieldLabel'
import { RegulationFieldProps } from './types'

const FieldFigure = ({ name, label, ...props }: RegulationFieldProps) => (
    <div>
        <FieldLabel name={`${name}.${label}`} label={label} {...props} />
        To-Do: Create Figuur field
    </div>
)

export default FieldFigure
