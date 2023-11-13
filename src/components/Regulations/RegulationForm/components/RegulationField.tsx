import { Content } from '@/config/regulations/contents/types'
import FieldBoxtext from './FieldBoxtext'
import FieldFigure from './FieldFigure'
import FieldFormula from './FieldFormula'
import FieldGlossary from './FieldGlossary'
import FieldGroup from './FieldGroup'
import FieldList from './FieldList'
import FieldListItem from './FieldListItem'
import FieldParagraph from './FieldParagraph'
import FieldQuote from './FieldQuote'
import FieldSubheading from './FieldSubheading'
import FieldTable from './FieldTable'
import { RegulationFieldProps } from './types'

const inputFieldMap = {
    boxtext: FieldBoxtext,
    figure: FieldFigure,
    formula: FieldFormula,
    glossary: FieldGlossary,
    group: FieldGroup,
    list: FieldList,
    listItem: FieldListItem,
    paragraph: FieldParagraph,
    quote: FieldQuote,
    subheading: FieldSubheading,
    table: FieldTable,
}

const RegulationField = ({
    type,
    style,
    className,
    ...field
}: RegulationFieldProps &
    Omit<Content, 'children'> & { className?: string }) => {
    const InputField = inputFieldMap[type]
    if (!InputField) {
        throw new Error(`Oh no! No field found for type: ${type}..`)
    }

    return (
        <div style={style} className={className}>
            <InputField {...field} />
        </div>
    )
}

export default RegulationField
