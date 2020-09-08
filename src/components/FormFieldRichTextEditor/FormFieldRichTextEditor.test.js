import { render } from '@testing-library/react';
import React from 'react';
import FormFieldRichTextEditor from './FormFieldRichTextEditor';

describe('FormFieldRichTextEditor', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<FormFieldRichTextEditor {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FormFieldRichTextEditor')).toBeTruthy();
    });
});
