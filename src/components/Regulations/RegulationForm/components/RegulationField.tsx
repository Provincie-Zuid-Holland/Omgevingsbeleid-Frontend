import { Content } from '@/config/regulations/contents/types'
import FieldBoxtext from './FieldBoxtext'
import FieldFigure from './FieldFigure'
import FieldFormula from './FieldFormula'
import FieldGlossary from './FieldGlossary'
import FieldGroup from './FieldGroup'
import FieldList from './FieldList'
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
    paragraph: FieldParagraph,
    quote: FieldQuote,
    subheading: FieldSubheading,
    table: FieldTable,
}

const RegulationField = ({
    type,
    ...field
}: RegulationFieldProps & Omit<Content, 'children'>) => {
    const InputField = inputFieldMap[type]
    if (!InputField) {
        throw new Error(`Oh no! No field found for type: ${type}..`)
    }

    return <InputField {...field} />
}

export default RegulationField
