import { render } from '@testing-library/react';
import React from 'react';
import FormFieldInputContainer from './FormFieldInputContainer';

describe('FormFieldInputContainer', () => {
    const defaultProps = {};

    it('should render', () => {
        const props = {...defaultProps};
        const { asFragment, queryByText } = render(<FormFieldInputContainer {...props} />);

        expect(asFragment()).toMatchSnapshot();
        expect(queryByText('FormFieldInputContainer')).toBeTruthy();
    });
});
