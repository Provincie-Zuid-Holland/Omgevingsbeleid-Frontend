import { render, screen } from '@testing-library/react'

import FormFieldRichTextEditor from './FormFieldRichTextEditor'

describe('FormFieldRichTextEditor', () => {
    const defaultProps = {
        dataObjectProperty: 'property',
        placeholder: 'Placeholder',
        handleChange: () => null,
        initialValue: 'InitialValue',
        fieldValue: 'FieldValue',
        titleSingular: 'Title Singular',
        editorFormats: ['bold', 'header', 'list', 'image'],
        editorToolbar: ['image'],
    }

    it('should render', () => {
        const props = { ...defaultProps }
        render(<FormFieldRichTextEditor {...props} />)
        expect(screen.getByText('FieldValue')).toBeTruthy()
    })
})
